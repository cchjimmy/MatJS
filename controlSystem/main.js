import Mat from "../objectVersion/Mat.js";

main();

function main() {
  let k = 100; // spring constant
  let m = 1; // mass
  let c = 5; // damping ratio
  let A = [
    [0, 1],
    [-(k/m), -(c/m)]
    ]
  let B = [
    [0],
    [1]
    ]
  let C = [
    [1, 0]
    ]
  let D = [
    [0]
    ];
  let initialPosition = 200;
  let initialSpeed = 0;
  let states = [
    [initialPosition],
    [initialSpeed]
    ]
  let input = [
    [0] // control signal input
    ];
    
  let dt = 0;
  let last = performance.now();
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = 600;
  canvas.height = 400;
  
  document.body.appendChild(canvas);
  
  animate();
  
  function animate() {
    let [change, output] = update(A, B, C, D, states, input);
    let radius = 70;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    // floor
    ctx.moveTo(0, canvas.height * 0.5 + radius);
    ctx.lineTo(canvas.width, canvas.height * 0.5 + radius);
    
    // equilibrium line
    ctx.moveTo(canvas.width * 0.5, canvas.height * 0.5 + radius);
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.5 - radius * 2);
    
    // spring
    let coils = 5;
    let coilRadius = 20;
    let springLength = canvas.width * 0.5 + states[0][0] - radius;
    let coilInterval = springLength / coils / 2;
    ctx.moveTo(0, canvas.height * 0.5 + coilRadius);
    for (let i = 0; i < coils * 2; i++) {
      let sign = i % 2 ? 1 : -1;
      ctx.lineTo(coilInterval * i, canvas.height * 0.5 + sign * coilRadius);
    }
    ctx.lineTo(springLength, canvas.height * 0.5);
    
    // ball
    ctx.moveTo(output[0][0] + canvas.width * 0.5, canvas.height * 0.5);
    ctx.arc(output[0][0] + canvas.width * 0.5, canvas.height * 0.5, radius, 0, Math.PI*2);
    ctx.stroke();
    
    // update states
    states = Mat.add(states, Mat.multS(change, dt / 1000));
    
    dt = performance.now() - last;
    last += dt;
    
    requestAnimationFrame(animate);
  }
}

function update(A, B, C, D, x, u) {
  let change = Mat.add(Mat.multM(A, x), Mat.multM(B, u));
  
  // compute output
  let y = Mat.add(Mat.multM(C, x), Mat.multM(D, u));
  
  return [change, y];
}