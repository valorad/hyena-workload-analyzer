// The sample map-reduces to get non-linear statistics

const map = function () {
  emit("CPU", 
    {
      fragment: [this.CPUUtilization_Average],
      sum: this.CPUUtilization_Average
    }
  )
}

const reduce = function (key, values) {
  return values.reduce((prev, current) => {
    return {
      fragment: prev.fragment.concat(current.fragment),
      sum: prev.sum + current.sum
    }
  });
}

const finalize = function (key, value) {
  // sort samples
  let samples = value.fragment.sort( (val1, val2) => { return val1 - val2} );
  const result = {
    min: samples[0],
    max: samples[samples.length - 1],
    median: 0,
    stDev: 0,
    normalizedSamples: [],
    percentileSol1: 0,
    percentileSol2: {
      value: 0,
      normValue: 0
    }
  };
  // calculate median
  if (samples.length % 2 === 0) {
    result.median = ( samples[samples.length / 2] + samples[ (samples.length / 2) - 1 ] ) / 2.0;
  } else {
    result.median = samples[ Math.floor(samples.length / 2) ];
  }
  // calculate standard deviation
  let avgVal = value.sum / parseFloat(samples.length);
  let squareDiffValues = samples.map(val => Math.pow( (val - avgVal), 2 ) );
  result.stDev = Math.sqrt( Array.sum(squareDiffValues) / avgVal );
  for (let sample of samples) {
    result.normalizedSamples.push( (sample - result.min ) / (result.max - result.min) );
  }
  // calculate percentile solution 1
  const threshold = 0.9;
  const percentileMargin1 = Math.floor(samples.length * threshold);
  result.percentileSol1 = samples[percentileMargin1];
  // calculate percentile solution 2
  const percentileMargin2 = Math.floor(result.normalizedSamples.length * threshold);
  result.percentileSol2 = {
    normValue: result.normalizedSamples[percentileMargin2],
    value: samples[percentileMargin2]
  }
  return result;
}

// db.NDBenchTestings.mapReduce( <mapFunction>, <reduceFunction>, {out: "mrResultTestingsCPU", finalize: <finalizeFunction>} )

// db.NDBenchTestings.mapReduce(map, reduce, {out: "mrResultTestingsCPU", finalize})


