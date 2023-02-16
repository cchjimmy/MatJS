import Mat from './Mat.js';

(function () {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const numberOfObjects = 1000;
  const objects = [];
  const normals = {
    top: Mat.matrix(0, -1),
    bottom: Mat.matrix(0, 1),
    left: Mat.matrix(1, 0),
    right: Mat.matrix(-1, 0)
  }
  const maxSpeed = 100;
  var last = performance.now();
  var dt = 0;

  init();

  function init() {
    canvas.width = 400;
    canvas.height = 400;

    for (let i = 0; i < numberOfObjects; i++) {
      objects.push({
        pos: Mat.matrix(Math.random() * canvas.width, Math.random() * canvas.height),
        vel: Mat.matrix((Math.random() - 0.5) * maxSpeed, (Math.random() - 0.5) * maxSpeed)
      })
    }
    
    let a = Mat.random(10, 10);
    let o, g, ot, gt;
    ot=measureFunc(()=>o=Mat.det(a, 'old'));
    gt=measureFunc(()=>g=Mat.det(a));
    let txt = `Mat.det() performance test\n\ninput matrix:\n${Mat.print(a)}\n\ntime taken:\nold: ${ot} ms\ngause: ${gt}ms\n\ndeterminant from old method: ${o}\ndeterminant incorporating gauss elimination: ${g}\n\ndifference: ${Math.abs(o-g)}`;
    
    let p = document.createElement('p');
    p.innerText = txt;
    p.style.color = 'white';
    document.body.appendChild(p);
    
    update();
  }
  
  function measureFunc(func) {
    let past = performance.now();
    func();
    return performance.now() - past;
  }

  function update() {
    // updates position
    for (let i = 0; i < numberOfObjects; i++) {
      let p = objects[i].pos;
      let v = objects[i].vel;

      if (p[0][0] < 0) {
        reflect(v, normals.left);
        p[0][0] = 1;
      }
      if (p[0][0] > canvas.width) {
        reflect(v, normals.right);
        p[0][0] = canvas.width - 1;
      }
      if (p[1][0] < 0) {
        reflect(v, normals.bottom);
        p[1][0] = 1;
      }
      if (p[1][0] > canvas.height) {
        reflect(v, normals.top);
        p[1][0] = canvas.height - 1;
      }

      Mat.add(p, Mat.multS(Mat.copy(v), dt));
    }

    // draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw objects
    ctx.strokeStyle = 'blue';
    for (let i = 0; i < numberOfObjects; i++) {
      ctx.strokeRect(objects[i].pos[0][0] - 5, objects[i].pos[1][0] - 5, 10, 10);
    }

    let now = performance.now();
    dt = (now - last) * 0.001;
    last = now;

    requestAnimationFrame(update);
  }

  function reflect(mat, normal) {
    let c = Mat.copy(normal);
    return Mat.subtract(mat, Mat.multS(c, 2 * Mat.dot(Mat.transpose(mat), c)));
  }
})();