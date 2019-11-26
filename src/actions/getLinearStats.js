// The sample map-reduces to get linear statistics

// const map = function () {
//   emit("CPU", this.CPUUtilization_Average);
// }

// const reduce = function (key, values) {
//   const sortedValues = values.sort((val1, val2) => { return val1 - val2});
//   const result = {
//     min: sortedValues[0],
//     max: sortedValues[sortedValues.length - 1],
//     median: sortedValues[ Math.round(sortedValues.length / 2) ],
//     sDev: 0
//   };
//   let avgVal = Array.avg(sortedValues);
//   let squareDiffValues = sortedValues.map(val => Math.pow( (val - avgVal), 2 ) );
//   result.sDev = Math.sqrt( Array.sum(squareDiffValues) / avgVal );
//   return result;
// }

const map = function () {
  emit("CPU", {
    max: this.CPUUtilization_Average,
    min: this.CPUUtilization_Average
  });
}

const reduce = function (key, values) {

  const maxStat = values.reduce(
    (prev, current) => {
      return (current.max > prev.max ? current : prev);
    }
  );

  const minStat = values.reduce(
    (prev, current) => {
      return (current.min < prev.min ? current : prev);
    }
  );

  // There's an algorithm available to calculate standard Dev in a linear way.
  // See https://gist.github.com/RedBeard0531/1886960
  // const diffStat = values.reduce(
  //   (prev, current) => {

  //     return {
  //       sum: prev.sum + current.sum,
  //       count: prev.count + current.count,
  //       delta: prev.sum/prev.count - current.sum/current.count
  //     }

  //   }
  // );

  return {
    max: maxStat.max,
    min: minStat.min
  };
}



// db.NDBenchTestings.mapReduce( <mapFunction>, <reduceFunction>, {out: "mrResultTestingsCPU"} )