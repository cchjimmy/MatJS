export function measureFunc(func) {
  let past = performance.now();
  func();
  return performance.now() - past;
}

export function bench(func, repeats) {
  let times = new Array(repeats.length);
  for (let i = 0; i < repeats.length; i++) {
    let time = new Array(repeats[i]);
    for (let j = 0; j < repeats[i]; j++) {
      time[j] = measureFunc(func);
    }
    time.sort((a, b) => a - b);
    times[i] = time;
  }
  
  let medians = new Array(repeats.length);
  for (let i = 0; i < times.length; i++) {
    let median = times[i][Math.floor(times[i].length * 0.5)];
    medians[i] = median;
  }
  
  let average = 0;
  for (let i = 0; i < medians.length; i++) {
    average += medians[i];
  }
  average /= medians.length;
  
  return {times, medians, average};
}