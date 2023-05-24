import Mat from "../objectVersion/Mat.js";

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

  let ToC = document.createElement("button");
  ToC.style.display = "block";
  ToC.innerText = "Table of Contents";
  let ToCContainer = document.createElement("div");
  ToCContainer.style.display = "none";

  for (let prop in Mat) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#" + prop;
    a.innerHTML = "Mat." + prop + "()";
    li.appendChild(a)
    ToCContainer.appendChild(li);
  }

  ToC.appendChild(ToCContainer);

  document.body.appendChild(ToC);
  document.body.appendChild(ToCContainer);

  ToC.onclick = () => {
    ToCContainer.style.display == "none" ? ToCContainer.style.display = "block" : ToCContainer.style.display = "none";
  }

  let notFound = "To do...";

  for (let prop in Mat) {
    let main = document.createElement("div");
    main.id = prop;
    let title = document.createElement("h2");
    title.innerText = `Mat.${prop}(${documentations[prop]?.args || notFound})`;
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