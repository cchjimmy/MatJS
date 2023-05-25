import MatC from "../classVersion/Mat.js";
import MatO from "../objectVersion/Mat.js";
import { bench } from "../helper.js";

let a, b;

console.log("100 x 100 matrix multiplication");
console.log("object version:");
a = MatO.identity(100);
b = MatO.fill(100, 100, 1);

console.log(bench(()=>MatO.multM(a, b), [10, 100, 1000]));
console.log("class version:");

a = MatC.identity(100);
b = MatC.fill(100, 100, 1);

console.log(bench(()=>a.multM(b), [10, 100, 1000]));

console.log("100 x 100 matrix addition");
console.log("object version:");
a = MatO.random(100, 100);
b = MatO.fill(100, 100, 1);

console.log(bench(() => MatO.add(a, b), [10, 100, 1000]));
console.log("class version:");

a = MatC.random(100, 100);
b = MatC.fill(100, 100, 1);

console.log(bench(() => a.add(b), [10, 100, 1000]));

console.log("100 x 100 matrix fill");
console.log("object version:");

console.log(bench(() => MatO.fill(100, 100), [10, 100, 1000]));
console.log("class version:");

console.log(bench(() => MatC.fill(100, 100), [10, 100, 1000]));

console.log("100 x 100 matrix transpose");
console.log("object version:");

a = MatO.random(100, 100);

console.log(bench(() => MatO.transpose(a), [10, 100, 1000]));
console.log("class version:");

a = MatC.random(100, 100);
console.log(bench(() => a.transpose(), [10, 100, 1000]));