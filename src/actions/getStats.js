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
    percentileSol1: {
      value: 0,
      normValue: 0
    },
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
  result.stDev = Math.sqrt( Array.sum(squareDiffValues) / parseFloat(samples.length) );
  for (let sample of samples) {
    result.normalizedSamples.push( (sample - result.min ) / (result.max - result.min) );
  }
  // calculate percentile solution 1
  const threshold = 0.9;
  let percentileMargin1 = Math.floor(samples.length * threshold);
  result.percentileSol1 = {
    value: samples[percentileMargin1],
    normValue: result.normalizedSamples[percentileMargin1]
  }
  // calculate percentile solution 2
  let linearRanks = [];
  let thresholdPercentage = threshold * 100;
  for (let i = 0; i < samples.length; i++ ) {
    linearRanks.push(100 / samples.length * (i + 1 - 0.5));
  }
  for (let i = 0; i < samples.length; i++ ) {
    let currentRank = linearRanks[i];
    let nextRank = linearRanks[i + 1];
    if (currentRank === thresholdPercentage) {
      result.percentileSol2.value = samples[i];
      result.percentileSol2.normValue = result.normalizedSamples[i];
      break;
    } else if (currentRank < thresholdPercentage && thresholdPercentage < nextRank) {
      result.percentileSol2.value = samples[i] + samples.length * (thresholdPercentage - currentRank) * (samples[i + 1] - samples[i]) / 100.0;
      result.percentileSol2.normValue = result.normalizedSamples[i] + result.normalizedSamples.length * (thresholdPercentage - currentRank) * (result.normalizedSamples[i + 1] - result.normalizedSamples[i]) / 100.0;
      break;
    }
  }
  return result;
}

// db.NDBenchTestings.mapReduce( <mapFunction>, <reduceFunction>, {out: "mrResultTestingsCPU", finalize: <finalizeFunction>} )

// db.NDBenchTestings.mapReduce(map, reduce, {out: "mrResultTestingsCPU", finalize})


