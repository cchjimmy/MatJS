import MatC from "../classVersion/Mat.js";
import MatO from "../objectVersion/Mat.js";
import { measureFunc } from "../helper.js";

console.log("100 x 100 multiplication, 1000 repetitions");
console.log("object version:");
let a = MatO.fill(100, 100, 1);
let b = MatO.fill(100, 100, 2);

console.log(bench(()=>MatO.multM(a, b), 1000) + " ms");

console.log("class version:");

a = MatC.fill(100, 100, 1);
b = MatC.fill(100, 100, 2);

console.log(bench(()=>a.multM(b), 1000) + " ms");

function bench(func, repeat) {
  let average = 0;
  for (let i = 0; i < repeat; i++) {
    average += measureFunc(func);
  }
  average /= repeat;
  return average;
}