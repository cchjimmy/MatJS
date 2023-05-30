import Mat from "./Mat.js";

let a = Mat.define([
  [1, 2, 3],
  [4, 5, 6]
])

let b = Mat.define([
  [7, 8],
  [9, 10],
  [11, 12]
])

let c = Mat.define([
  [9, 8, 7],
  [6, 5, 4]
])

console.log(a.add(c))

console.log(a.subtract(c))

console.log(a.multM(b));

console.log(Mat.random(2, 3));

console.log(a.transpose());

console.log(a.max(), a.min());