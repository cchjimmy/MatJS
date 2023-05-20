import Mat from './Mat.js';
import { measureFunc } from "./helper.js";

(function () {
  let z = Mat.matrix([5, 7, 9], [4, 3, 8], [7, 5, 6]);
  console.log(Mat.pretty(z), Mat.pretty(Mat.inv(z)));

  let a = [[1, 2, 3], [4, 5, 6]];
  console.log(Mat.pretty(Mat.transpose(a)));
  let b = [[1, 2], [3, 4], [5, 6]];
  console.log(Mat.pretty(Mat.transpose(b)));

  let o, g, ot, gt;
  a = Mat.random(6, 6);
  ot = measureFunc(() => o = Mat.det(a, 'old'));
  gt = measureFunc(() => g = Mat.det(a));
  let txt = `<h2>Mat.det() performance test</h2>Input matrix:<pre><code>${Mat.pretty(a)}</code></pre>Time taken:<br>old: ${ot} ms<br>gauss: ${gt} ms<br><br>Determinants:<br>From old method: ${o}<br>Incorporating gauss elimination: ${g}<br><br>Percentage difference (old - gauss): ${(o - g) * 100} %`;

  let div = document.createElement('div');
  div.innerHTML = txt;
  div.style.color = 'white';
  document.body.appendChild(div);

  console.log(measureFunc(() => Mat.copy(a)), 'ms');
  console.log(measureFunc(() => Mat.matrix(...a)), 'ms');
})()