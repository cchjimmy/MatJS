export default class Mat {
  #values; #rows; #columns;
  constructor(rows, columns, values) {
    this.#rows = rows;
    this.#columns = columns;
    this.#values = values;
  }
  static define(values) {
    let rows = values.length;
    let columns = 0
    for (let i = 0; i < values.length; i++) {
      columns = columns >= values[i].length ? columns : values[i].length;
    }
    let v = new Array(rows * columns);
    for (let i = 0; i < v.length; i++) {
      v[i] = values[parseInt(i / columns)][i % columns] ?? 0;
    }
    return new Mat(rows, columns, v);
  }
  shape() {
    return [this.#rows, this.#columns];
  }
  array() {
    return this.#values.slice();
  }
  get(r = 0, c = 0) {
    return this.#values[c + r * this.#columns];
  }
  set(r = 0, c = 0, value) {
    this.#values[c + r * this.#columns] = value;
  }
  getColumn(c) {
    let result = new Array(this.#rows);
    for (let i = 0; i < this.#rows; i++) {
      result[i] = this.#values[c + i * this.#columns];
    }
    return result;
  }
  getRow(r) {
    return this.#values.slice(r * this.#columns, this.#columns * (1 + r));
  }
  add(mat) {
    let result = this.array();
    mat = mat.array();
    for (let i = 0; i < result.length; i++) {
      result[i] += mat[i]
    }
    return new Mat(this.#rows, this.#columns, result);
  }
  subtract(mat) {
    let result = this.array();
    mat = mat.array();
    for (let i = 0; i < result.length; i++) {
      result[i] -= mat[i]
    }
    return new Mat(this.#rows, this.#columns, result);
  }
  multM(mat) {
    let shape = mat.shape();
    let result = new Array(this.#rows * shape[1]);
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < shape[1]; j++) {
        result[j + i * shape[1]] = 0;
        for (let k = 0; k < shape[0]; k++) {
          result[j + i * shape[1]] += this.#values[k + i * this.#columns] * mat.get(k, j);
        }
      }
    }
    return new Mat(this.#rows, shape[1], result);
  }
  multS(s) {
    let result = this.values();
    for (let i = 0; i < result.length; i++) {
      result[i] *= s;
    }
    return new Mat(this.#rows, this.#columns, result);
  }
  transpose() {
    let result = new Array(this.#values.length);
    for (let i = 0; i < this.#values.length; i++) {
      result[parseInt(i / this.#columns) + i % this.#columns * this.#columns] = this.#values[i]; 
    }
    return new Mat(this.#columns, this.#rows, result);
  }
  static fill(m, n, value = 0) {
    let result = new Array(m * n).fill(value);
    return new Mat(m, n, result);
  }
  static random(m, n, min = 0, max = 1) {
    let result = new Array(m * n);
    for (let i = 0; i < result.length; i++) {
      result[i] = Math.random() * (max- min) + min;
    }
    return new Mat(m, n, result);
  }
  static identity(order) {
    let result = Mat.fill(order, order, 0);
    for (let i = 0; i < order; i++) {
      result.set(i, i, 1);
    }
    return result;
  }
}