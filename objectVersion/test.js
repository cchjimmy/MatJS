import Mat from "./Mat.js";
import { measureFunc } from "../benchmark/helper.js";

(function () {
  let z = [[5, 7, 9], [4, 3, 8], [7, 5, 6]];
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
  document.body.appendChild(div);

  console.log(measureFunc(() => Mat.copy(a)), 'ms');

  a = [
    [1, 2, 3],
    [4, 5, 6]
  ];
  b = [
    [3, 4, 5],
    [6, 7, 8]
  ]
  console.log(Mat.pretty(Mat.add(a, b)));
  console.log(Mat.pretty(Mat.subtract(a, b)));
  console.log(Mat.max(a));
  console.log(Mat.min(b));
})()