export function readObjFiles(paths, container = []) {
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

export function processObj(obj) {
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
        face[i] = parseInt(face[i]) - 1;
        if (isNaN(face[i])) face.splice(i, 1);
      }
      faces.push(face);
    }
  }
  return { name, vertices, faces };
}

export function wireFrame(vertices, faces, ctx) {
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