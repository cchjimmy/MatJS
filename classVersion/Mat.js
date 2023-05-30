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
  get(r, c) {
    return this.#values[c + r * this.#columns];
  }
  set(r, c, value) {
    this.#values[c + r * this.#columns] = value;
    return this;
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
      result[i] += mat[i];
    }
    return new Mat(this.#rows, this.#columns, result);
  }
  subtract(mat) {
    let result = this.array();
    mat = mat.array();
    for (let i = 0; i < result.length; i++) {
      result[i] -= mat[i];
    }
    return new Mat(this.#rows, this.#columns, result);
  }
  multM(mat) {
    let [r, c] = mat.shape();
    mat = mat.array();
    let result = new Array(this.#rows * c);
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < c; j++) {
        let index = j + i * c;
        result[index] = 0;
        for (let k = 0; k < r; k++) {
          result[index] += this.#values[k + i * this.#columns] * mat[j + k * c];
        }
      }
    }
    return new Mat(this.#rows, c, result);
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
      result[parseInt(i / this.#columns) + i % this.#columns * this.#rows] = this.#values[i]; 
    }
    return new Mat(this.#columns, this.#rows, result);
  }
  max() {
    let max = -Infinity;
    for (let i = 0; i < this.#values.length; i++) {
      max = max >= this.#values[i] ? max : this.#values[i];
    }
    return max;
  }
  min() {
    let min = Infinity;
    for (let i = 0; i < this.#values.length; i++) {
      min = min <= this.#values[i] ? min : this.#values[i];
    }
    return min;
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