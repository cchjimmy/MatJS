import Mat from "./Mat.js";

(function () {
  let documentations = {
    shape: {
      description: "Shows how many rows and columns a matrix has.",
    },
    matrix: {
      description: "Creates a new matrix.",
    },
    fill: {
      description: "Fill a matrix with a specific value.",
    },
    add: {
      description: "Adds the second input matrix to the first.",
    },
    subtract: {
      description: "Subtracts the second input matrix from the first.",
    },
    multS: {
      description: "Multiplies the input matrix with a scalar value.",
    },
    transpose: {
      description: "Transpose the input matrix."
    }
  };

  let notFound = "To do...";

  for (let prop in Mat) {
    let main = document.createElement("div");
    let title = document.createElement("h2");
    title.innerText = `${prop}(${documentations[prop]?.args || notFound})`;
    main.appendChild(title);
    let desc = document.createElement("div");
    desc.innerText = documentations[prop]?.description || notFound;
    main.appendChild(desc);
    let code = document.createElement("code");
    code.innerText = documentations[prop]?.example || notFound;
    main.appendChild(code);
    main.innerHTML += "<br>";
    document.body.appendChild(main);
  }
})();