import Mat from './Mat.js';

(function () {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const numberOfObjects = 1000;
  const normals = {
    top: Mat.matrix([0, -1]),
    bottom: Mat.matrix([0, 1]),
    left: Mat.matrix([1, 0]),
    right: Mat.matrix([-1, 0])
  }
  const maxSpeed = 20;
  var last = performance.now();
  var dt = 0;
  
  const pos = Mat.randomRange(numberOfObjects, 2, 0, 400);
  const vel = Mat.randomRange(numberOfObjects, 2, -maxSpeed, maxSpeed);
  
  init();

  function init() {
    canvas.width = 400;
    canvas.height = 400;

    let a, o, g, ot, gt;
    a = Mat.random(6, 6);
    ot = measureFunc(() => o = Mat.det(a, 'old'));
    gt = measureFunc(() => g = Mat.det(a));
    let txt = `<h2>Mat.det() performance test</h2>Input matrix:<pre><code>${Mat.string(a)}</code></pre>Time taken:<br>old: ${ot} ms<br>gauss: ${gt} ms<br><br>Determinants:<br>From old method: ${o}<br>Incorporating gauss elimination: ${g}<br><br>Percentage difference (old - gauss): ${(o - g) * 100} %`;

    let div = document.createElement('div');
    div.innerHTML = txt;
    div.style.color = 'white';
    document.body.appendChild(div);

    console.log(measureFunc(() => Mat.copy(a)), 'ms');
    console.log(measureFunc(() => Mat.matrix(...a)), 'ms');

    update();
  }

  function measureFunc(func) {
    let past = performance.now();
    func();
    return performance.now() - past;
  }

  function update() {
    // draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw objects
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (let i = 0; i < numberOfObjects; i++) {
      let x = pos[i][0];
      let y = pos[i][1];

      ctx.moveTo(x - 5, y - 5);
      ctx.lineTo(x + 5, y - 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.lineTo(x - 5, y - 5);
    }
    ctx.stroke();
    
    // update position
    Mat.add(pos, Mat.multS(Mat.copy(vel), dt));
    
    // reflect
    for (let i = 0; i < numberOfObjects; i++) {
      if (pos[i][0] > canvas.width) {
        reflect([vel[i]], normals.right);
      } else if (pos[i][0] < 0) {
        reflect([vel[i]], normals.left);
      }
      if (pos[i][1] > canvas.height) {
        reflect([vel[i]], normals.top);
      } else if (pos[i][1] < 0) {
        reflect([vel[i]], normals.bottom);
      }
    }

    let now = performance.now();
    dt = (now - last) * 0.001;
    last = now;

    requestAnimationFrame(update);
  }

  function reflect(mat, normal) {
    let c = Mat.copy(normal);
    return Mat.subtract(mat, Mat.multS(c, 2 * Mat.dot(mat[0], c[0])));
  }
  
})();