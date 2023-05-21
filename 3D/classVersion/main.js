import Mat from "../../classVersion/Mat.js";
import { readObjFiles } from "../helper.js";

// credit: https://stackoverflow.com/questions/724219/how-to-convert-a-3d-point-into-2d-perspective-projection

(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  ctx.strokeStyle = "white";

  let angle = 60 * Math.PI / 180;
  let fov = 1 / Math.tan(angle / 2);
  let aspectRatio = canvas.width / canvas.height;
  let clipMatrix = generateClipMatrix(fov, aspectRatio, 1, 100);
  let models = [];
  let modelPaths = [
    "../models/spoon.obj",
    "../models/teacup.obj",
    "../models/teapot.obj"
  ]

  let objects = [];

  readObjFiles(modelPaths, models);

  for (let i = 0; i < models.length; i++) {
    models[i].vertices = Mat.define(models[i].vertices);
  }

  let _x = -6;
  let _y = -6;
  for (let i = 0; i < 5; i++) {
    objects.push(
      {
        modelIndex: i % models.length,
        position: [_x, _y, 0, 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      })
    _x += 3;
    _y += 3;
  }

  let camera = [0, 2, -10, 1];

  const keys = new Map();

  window.onkeypress = (e) => {
    keys.set(e.code, true);
  }

  window.onkeydown = () => {
    if (keys.get("KeyW")) {
      camera[2] += 0.5;
    }
    if (keys.get("KeyS")) {
      camera[2] -= 0.5;
    }
    if (keys.get("KeyA")) {
      camera[0] -= 0.5;
    }
    if (keys.get("KeyD")) {
      camera[0] += 0.5;
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
      let scaleMatrix = generateScaleMatrix(...objects[i].scale);
      let rotationMatrix = generateRotationMatrix(...objects[i].rotation);
      let v_transformed = transform(model.vertices, clipMatrix, scaleMatrix, rotationMatrix, objects[i].position, camera, canvas.width, canvas.height);
      wireFrame(v_transformed, model.faces, ctx);
    }

    r += 0.01;

    requestAnimationFrame(update);
  }

  function transform(vertices, clipMatrix, scaleMatrix, rotationMatrix, position, origin, width, height) {
    let result = vertices.multM(scaleMatrix);
    result = result.multM(rotationMatrix);
    let [r, c] = result.shape();
    for (let i = 0; i < r; i++) {
      result.set(i, 0, result.get(i, 0) + position[0] - origin[0]);
      result.set(i, 1, result.get(i, 1) + position[1] - origin[1]);
      result.set(i, 2, result.get(i, 2) + position[2] - origin[2]);
    }

    result = result.multM(clipMatrix);

    // transform from homogeneous 4d vector into 2d
    for (let i = 0; i < r; i++) {
      result.set(i, 0, result.get(i, 0) * width / (2 * result.get(i, 3)) + width * 0.5);
      // invert height because y is downward positive
      result.set(i, 1, height - (result.get(i, 1) * height / (2 * result.get(i, 3)) + height * 0.5));
    }

    return result;
  }

  function generateClipMatrix(fov, aspectRatio, near, far) {
    let clipMatrix = Mat.fill(4, 4);
    clipMatrix.set(0, 0, fov / aspectRatio);
    clipMatrix.set(1, 1, fov);
    clipMatrix.set(2, 2, (far + near) / (far - near));
    clipMatrix.set(2, 3, 1);
    clipMatrix.set(3, 2, (2 * near * far) / (near - far));
    return clipMatrix;
  }
  
  function generateScaleMatrix(sx, sy, sz) {
    let matrix = Mat.identity(4);
    matrix.set(0, 0, sx);
    matrix.set(1, 1, sy);
    matrix.set(2, 2, sz);
    return matrix;
  }
  
  function generateRotationMatrix(rx = 0, ry = 0, rz = 0) {
    let cx = Math.cos(rx);
    let cy = Math.cos(ry);
    let cz = Math.cos(rz);
    let sx = Math.sin(rx);
    let sy = Math.sin(ry);
    let sz = Math.sin(rz);
  
    return Mat.define([
      [cx * cy, cx * sy * sz - sx * cz, cx * sy * cz + sx * sz, 0],
      [sx * cy, sx * sy * sz + cx * cz, sx * sy * cz - cx * sz, 0],
      [-sy, cy * sz, cy * cz, 0],
      [0, 0, 0, 1]
    ])
  }

  function wireFrame(vertices, faces, ctx) {
    ctx.beginPath();
    for (let i = 0; i < faces.length; i++) {
      let v = vertices.getRow(faces[i][0]);
      ctx.moveTo(v[0], v[1]);
      for (let j = 1; j < faces[i].length; j++) {
        let v = vertices.getRow(faces[i][j]);
        ctx.lineTo(v[0], v[1]);
      }
      ctx.lineTo(v[0], v[1]);
    }
    ctx.stroke();
  }
})();