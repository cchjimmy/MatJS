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
        face[i] = parseInt(face[i]);
        if (isNaN(face[i])) face.splice(i, 1);
      }
      faces.push(face);
    }
  }
  return { name, vertices, faces };
}