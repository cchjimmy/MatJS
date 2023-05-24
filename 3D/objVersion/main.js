import Mat from "../../objectVersion/Mat.js";
import { readObjFiles } from "../helper.js";

// credit: https://stackoverflow.com/questions/724219/how-to-convert-a-3d-point-into-2d-perspective-projection

(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  ctx.strokeStyle = "white";

  let fov = 60 * Math.PI / 180;
  let aspectRatio = canvas.width / canvas.height;
  let clipMatrix = generatePerspectiveMatrix(fov, aspectRatio, 1, 100);
  let models = [];
  let modelPaths = [
    // "../models/spoon.obj",
    // "../models/teacup.obj",
    "../models/teapot.obj"
  ]

  let objects = [];

  readObjFiles(modelPaths, models)

  for (let i = 0; i < 1; i++) {
    objects.push(
      {
        modelIndex: i % models.length,
        position: [0, 0, 0, 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      })
  }

  let camera = [0, 2, -10, 1];

  const keys = new Map();

  window.onkeypress = (e) => {
    keys.set(e.code, true);
  }

  let speed = 0.5;
  window.onkeydown = () => {
    if (keys.get("KeyW")) {
      camera[2] += speed;
    }
    if (keys.get("KeyS")) {
      camera[2] -= speed;
    }
    if (keys.get("KeyA")) {
      camera[0] -= speed;
    }
    if (keys.get("KeyD")) {
      camera[0] += speed;
    }
  }

  window.onkeyup = (e) => {
    keys.delete(e.code);
  }

  let r = 0;
  update();
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < objects.length; i++) {
      let model = models[objects[i].modelIndex];
      objects[i].rotation[0] = 0;
      objects[i].rotation[1] = r;
      objects[i].rotation[2] = 0;
      let rotationMatrix = generateRotationMatrix(...objects[i].rotation);
      let scaleMatrix = generateScaleMatrix(...objects[i].scale)
      let v_transformed = transform(model.vertices, clipMatrix, rotationMatrix, scaleMatrix, objects[i].position, camera, canvas.width, canvas.height);
      wireFrame(v_transformed, model.faces, ctx);
    }

    r += 0.01;

    requestAnimationFrame(update);
  }

  function transform(vertices, clipMatrix, rotationMatrix, scaleMatrix, position, origin, width, height) {
    let result = Mat.multM(vertices, Mat.multM(scaleMatrix, rotationMatrix));

    for (let i = 0; i < result.length; i++) {
      result[i][0] += position[0] - origin[0];
      result[i][1] += position[1] - origin[1];
      result[i][2] += position[2] - origin[2];
    }

    result = Mat.multM(result, clipMatrix);

    for (let i = 0; i < result.length; i++) {
      result[i][0] = result[i][0] * width / (2 * result[i][3]) + width * 0.5;
      result[i][1] = height - (result[i][1] * height / (2 * result[i][3]) + height * 0.5);
    }

    return result;
  }

  function generatePerspectiveMatrix(fov, aspectRatio, near, far) {
    let clipMatrix = Mat.fill(4, 4);
    clipMatrix[1][1] = 1 / Math.tan(fov / 2);
    clipMatrix[0][0] = clipMatrix[1][1] / aspectRatio;
    clipMatrix[2][2] = (far + near) / (far - near);
    clipMatrix[2][3] = 1;
    clipMatrix[3][2] = (2 * near * far) / (near - far);
    return clipMatrix;
  }
  
  function generateRotationMatrix(rx = 0, ry = 0, rz = 0) {
    let cx = Math.cos(rx);
    let cy = Math.cos(ry);
    let cz = Math.cos(rz);
    let sx = Math.sin(rx);
    let sy = Math.sin(ry);
    let sz = Math.sin(rz);
  
    return [
      [cx * cy, cx * sy * sz - sx * cz, cx * sy * cz + sx * sz, 0],
      [sx * cy, sx * sy * sz + cx * cz, sx * sy * cz - cx * sz, 0],
      [-sy, cy * sz, cy * cz, 0],
      [0, 0, 0, 1]
    ]
  }

  function generateScaleMatrix(sx, sy, sz) {
    let i = Mat.identity(4);
    i[0][0] = sx;
    i[1][1] = sy;
    i[2][2] = sz;
    return i;
  }

  function wireFrame(vertices, faces, ctx) {
    ctx.beginPath();
    for (let i = 0; i < faces.length; i++) {
      ctx.moveTo(vertices[faces[i][0]][0], vertices[faces[i][0]][1]);
      for (let j = 1; j < faces[i].length; j++) {
        if (!vertices[faces[i][j]]) continue;
        ctx.lineTo(vertices[faces[i][j]][0], vertices[faces[i][j]][1]);
      }
      ctx.lineTo(vertices[faces[i][0]][0], vertices[faces[i][0]][1]);
    }
    ctx.stroke();
  }
})();