import Mat from './Mat.js';

(function () {
  const canvas = document.createElement('canvas');
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
  
  var pos = Mat.randomRange(numberOfObjects, 2, 0, 400);
  var vel = Mat.randomRange(numberOfObjects, 2, -maxSpeed, maxSpeed);
  
  init();

  function init() {
    canvas.width = 400;
    canvas.height = 400;
    
    document.body.appendChild(canvas);

    update();
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
    pos = Mat.add(pos, Mat.multS(Mat.copy(vel), dt));
    
    // reflect
    for (let i = 0; i < numberOfObjects; i++) {
      if (pos[i][0] > canvas.width) {
        vel[i] = reflect([vel[i]], normals.right)[0];
      } else if (pos[i][0] < 0) {
        vel[i] = reflect([vel[i]], normals.left)[0];
      }
      if (pos[i][1] > canvas.height) {
        vel[i] = reflect([vel[i]], normals.top)[0];
      } else if (pos[i][1] < 0) {
        vel[i] = reflect([vel[i]], normals.bottom)[0];
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