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
  let samples = value.fragment.sort( (val1, val2) => { return val1 - val2} );
  const result = {
    min: samples[0],
    max: samples[samples.length - 1],
    median: 0,
    stDev: 0,
    normalizedsamples: []
  };
  if (samples.length % 2 === 0) {
    result.median = ( samples[samples.length / 2] + samples[ (samples.length / 2) - 1 ] ) / 2.0;
  } else {
    result.median = samples[ Math.floor(samples.length / 2) ];
  }
  let avgVal = value.sum / parseFloat(samples.length);
  let squareDiffValues = samples.map(val => Math.pow( (val - avgVal), 2 ) );
  result.stDev = Math.sqrt( Array.sum(squareDiffValues) / avgVal );
  for (let sample of samples) {
    result.normalizedsamples.push( (sample - result.min ) / (result.max - result.min) );
  }
  return result;
}

// db.NDBenchTestings.mapReduce( <mapFunction>, <reduceFunction>, {out: "mrResultTestingsCPU", finalize: <finalizeFunction>} )

// db.NDBenchTestings.mapReduce(map, reduce, {out: "mrResultTestingsCPU", finalize})


