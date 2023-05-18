export function measureFunc(func) {
  let past = performance.now();
  func();
  return performance.now() - past;
}