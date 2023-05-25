export function measureFunc(func) {
  let past = performance.now();
  func();
  return performance.now() - past;
}

export function bench(func, repeats) {
  let times = new Array(repeats.length);
  for (let i = 0; i < repeats.length; i++) {
    times[i] = new Array(repeats[i]);
    for (let j = 0; j < repeats[i]; j++) {
      times[i][j] = measureFunc(func);
    }
    times[i].sort((a, b) => a - b);
  }
  
  let medians = new Array(repeats.length);
  for (let i = 0; i < times.length; i++) {
    let index = (times[i].length - 1) * 0.5;
    medians[i] = index - parseInt(index) > 0 ? (times[i][parseInt(index)] + times[i][parseInt(index) + 1]) * 0.5 : times[i][index];
  }
  
  let average = 0;
  for (let i = 0; i < medians.length; i++) {
    average += medians[i];
  }
  average /= medians.length;
  
  return {times, medians, average};
}