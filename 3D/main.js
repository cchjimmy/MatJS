import Mat from "../Mat.js";

// credit: https://stackoverflow.com/questions/724219/how-to-convert-a-3d-point-into-2d-perspective-projection

(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  ctx.strokeStyle = "white";

  let angle = 100;
  let fov = 1 / Math.tan(angle / 2);
  let aspectRatio = canvas.width / canvas.height;
  let clipMatrix = generateClipMatrix(fov, aspectRatio, 1, 100);
  let models = [];
  let modelPaths = [
    "./models/spoon.obj",
    "./models/teacup.obj",
    "./models/teapot.obj"
  ]

  let objects = [];

  readObjFiles(modelPaths, models)

  let _x = -6;
  let _y = -6;
  for (let i = 0; i < 5; i++) {
    objects.push(
      {
        modelIndex: i % models.length,
        position: [_x, _y, 0, 1],
        rotation: [0, 0, 0]
      })
    _x += 3;
    _y += 3;
  }

  let camera = [0, 0, -30, 1];

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
      let rotationMatrix = generateRotationMatrix(...objects[i].rotation);
      let v_transformed = transform(model.vertices, clipMatrix, rotationMatrix, objects[i].position, camera, canvas.width, canvas.height);
      wireFrame(v_transformed, model.faces, ctx);
    }

    r += 0.01;

    requestAnimationFrame(update);
  }

  function readObjFiles(paths, container = []) {
    for (let i = 0; i < paths.length; i++) {
      let req = new XMLHttpRequest;
      req.onload = (e) => {
        container.push(processObj(req.response));
      }
      req.open("GET", paths[i], false);
      req.send();
    }
    return container;
  }

  function processObj(obj) {
    let vertices = [];
    let faces = [];
    obj = obj.split("\n");
    let name = obj[0].split(" ")[1].split(".")[0];
    for (let i = 0; i < obj.length; i++) {
      let line = obj[i].split(" ");
      if (line[0] == "v") {
        let vertex = line.slice(1);
        for (let i = 0; i < vertex.length; i++) {
          vertex[i] = parseFloat(vertex[i]);
        }
        vertex[3] = 1;
        vertices.push(vertex);
      } else if (line[0] == "f") {
        let face = line.slice(1);
        for (let i = 0; i < face.length; i++) {
          face[i] = parseInt(face[i]);
          if (isNaN(face[i])) face.splice(i, 1);
        }
        faces.push(face);
      }
    }
    return { name, vertices, faces };
  }

  function wireFrame(vertices, faces, ctx) {
    ctx.beginPath();
    for (let i = 0; i < faces.length; i++) {
      ctx.moveTo(ctx.canvas.width - vertices[faces[i][0]][0], vertices[faces[i][0]][1]);
      for (let j = 1; j < faces[i].length; j++) {
        if (!vertices[faces[i][j]]) continue;
        ctx.lineTo(ctx.canvas.width - vertices[faces[i][j]][0], vertices[faces[i][j]][1]);
      }
    }
    ctx.stroke();
  }

  function transform(vertices, clipMatrix, rotationMatrix, position, origin, width, height) {
    let result = Mat.multM(vertices, rotationMatrix);

    for (let i = 0; i < result.length; i++) {
      result[i][0] += position[0] - origin[0];
      result[i][1] += position[1] - origin[1];
      result[i][2] += position[2] - origin[2];
    }

    result = Mat.multM(result, clipMatrix);

    for (let i = 0; i < result.length; i++) {
      result[i][0] = result[i][0] * width / (2 * result[i][3]) + width * 0.5;
      result[i][1] = result[i][1] * height / (2 * result[i][3]) + height * 0.5;
    }

    return result;
  }

  function generateClipMatrix(fov, aspectRatio, near, far) {
    let clipMatrix = Mat.fill(4, 4);
    clipMatrix[0][0] = fov / aspectRatio;
    clipMatrix[1][1] = fov;
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
})();