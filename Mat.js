const Mat = {
  /**
   * Finds the shape of a matrix.
   * @param {number[][]} mat 
   * @returns {...number} [number of rows, number of columns]
   */
  shape(mat) {
    let rows = mat.length;
    let columns = 0;
    for (let i = 0; i < rows; i++) {
      columns = columns >= mat[i].length ? columns : mat[i].length;
    }
    return [rows, columns];
  },
  /**
   * Creates a matrix, a 2d array of numbers.
   * @param  {...number} values 
   * @returns {number[][]} A new matrix.
   */
  matrix(...values) {
    // make input values into the form, which has an array as a base container with other arrays contained within, which acts as the rows of a matrix
    for (let i = 0; i < values.length; i++) {
      values[i] = values[i].length ? values[i] : [values[i]];
    }

    let shape = Mat.shape(values);

    // initialize matrix
    let matrix = new Array(shape[0]);
    for (let i = 0; i < shape[0]; i++) {
      matrix[i] = new Array(shape[1]);
    }

    // input values into matrix
    for (let i = 0; i < shape[0] * shape[1]; i++) {
      let x = i % shape[1];
      let y = (i - x) / shape[1];
      matrix[y][x] = values[y][x] || 0;
    }

    return matrix;
  },
  /**
   * Creates a zero matrix.
   * @param {number} m Number of rows.
   * @param {number} n Number of columns.
   * @returns {number[][]} A matrix of 0s with specified shape.
   */
  zeros(m, n) {
    // credit: https://stackoverflow.com/questions/34773846/javascript-faster-way-to-create-and-initialize-two-dimensional-array-matrix
    let matrix = new Array(m);
    let row = new Array(n);
    for (let i = 0; i < n; i++) {
      row[i] = 0;
    }
    for (let i = 0; i < m; i++) {
      matrix[i] = row.slice(0);
    }
    return matrix;
  },
  /**
   * Matrix addition, modifies the matrix in the first argument. Both input matrices must have the same shape.
   * @param {number[][]} mat1 
   * @param {number[][]} mat2 
   * @returns {number[][] | undefined} mat1
   */
  add(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    for (let i = 0; i < shape1.length; i++) {
      if (shape1[i] != shape2[i]) return;
    }
    for (let i = 0; i < shape1[0] * shape1[1]; i++) {
      // we know index = x + y * width and x = index % width
      // so y = (index - x) / width

      let x = i % shape1[1];
      let y = (i - x) / shape1[1];
      mat1[y][x] += mat2[y][x];
    }
    return mat1;
  },
  /**
   * Matrix subtration, modifies the matrix in the first argument. Both input matrices must have the same shape.
   * @param {number[][]} mat1 
   * @param {number[][]} mat2 
   * @returns {number[][] | undefined} mat1
   */
  subtract(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    for (let i = 0; i < shape1.length; i++) {
      if (shape1[i] != shape2[i]) return;
    }
    for (let i = 0; i < shape1[0] * shape1[1]; i++) {
      let x = i % shape1[1];
      let y = (i - x) / shape1[1];
      mat1[y][x] -= mat2[y][x];
    }
    return mat1;
  },
  /**
   * Multiplies the input scalar into all entries of the input matrix.
   * @param {number[][]} mat 
   * @param {number} scalar 
   * @returns {number[][]} mat
   */
  multS(mat, scalar) {
    let shape = Mat.shape(mat);
    for (let i = 0; i < shape[0] * shape[1]; i++) {
      let x = i % shape[1];
      let y = (i - x) / shape[1];
      mat[y][x] *= scalar;
    }
    return mat;
  },
  /**
   * Matrix transposition, this does not modify the input matrix.
   * @param {number[][]} mat 
   * @returns {number[][]} A new matrix of the transposed input matrix.
   */
  transpose(mat) {
    let shape = Mat.shape(mat);
    let result = new Array(shape[1]);
    for (let i = 0; i < shape[1]; i++) {
      result[i] = new Array(shape[0]);
    }
    for (let i = 0; i < shape[0] * shape[1]; i++) {
      let x = i % shape[1];
      let y = (i - x) / shape[1];
      result[x][y] = mat[y][x];
    }
    return result;
  },
  /**
   * Copies the input matrix.
   * @param {number[][]} source source matrix.
   * @returns {number[][]} A new matrix with entries the same as the source matrix.
   */
  copy(source) {
    return Mat.matrix(...source);
  },
  /**
   * Matrix multiplication, the number of columns in mat1 must be the same as the number of rows in mat2.
   * @param {number[][]} mat1 
   * @param {number[][]} mat2 
   * @returns {number[][] | undefined} A new matrix storing the multiplication result, which has the shape [rows in mat1, columns in mat2].
   */
  multM(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    if (shape1[1] != shape2[0]) return;
    let result = new Array(shape1[0]);
    for (let i = 0; i < shape1[0]; i++) {
      result[i] = new Array(shape2[1]);
    }
    for (let i = 0; i < shape1[0] * shape2[1]; i++) {
      let x = i % shape2[1];
      let y = (i - x) / shape2[1];
      result[y][x] = Mat.dot(mat1, mat2, y, x);
    }
    return result;
  },
  /**
   * Multiplies a specified column in mat2 into a specified row in mat1.
   * @param {*} mat1 
   * @param {*} mat2 
   * @param {*} rowIndex Row index for mat1
   * @param {*} colIndex Column index for mat2
   * @returns {number} The result of the dot product.
   */
  dot(mat1, mat2, rowIndex = 0, colIndex = 0) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    if (shape1[1] != shape2[0]) return;
    let result = 0;
    mat2 = Mat.transpose(mat2);
    for (let i = 0; i < shape1[1]; i++) {
      result += mat1[rowIndex][i] * mat2[colIndex][i];
    }
    return result;
  },
  /**
   * Creates an identity matrix with specified order.
   * @param {number} order 
   * @returns {number[][]} An identity matrix.
   */
  identity(order) {
    let matrix = Mat.zeros(order, order);
    for (let i = 0; i < order; i++) {
      matrix[i][i] = 1;
    }
    return matrix;
  },
  /**
   * Creates an alternating sign matrix, the entries are either 1 or -1
   * @param {number} order 
   * @returns {number[][]} A sign matrix
   */
  signs(order) {
    let matrix = new Array(order);
    for (let i = 0; i < order; i++) {
      matrix[i] = new Array(order);
      for (let j = 0; j < order; j++) {
        matrix[i][j] = (j + i) % 2 ? -1 : 1;
      }
    }
    return matrix;
  },
  /**
   * Finds the determinant of the input matrix. The 'old' method calculates the determinant recursively, the 'gauss' method incorporates Gaussian elimination to reduce the amount of computation.
   * @param {number[][]} mat 
   * @param {string} method Can either be 'old' or 'gauss'. Default value is 'gauss'.
   * @returns {number} The determinant.
   */
  det(mat, method = 'gauss') {
    let shape = Mat.shape(mat);
    // if mat is not a square matrix, return
    if (shape[0] !== shape[1]) return;

    let d = 0;
    if (method == 'old') {
      // if mat is a order 2 square matrix, calculate the determinant
      if (shape[0] == 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];

      let c = Mat.copy(mat);
      // remove first row
      c.splice(0, 1);
      for (let i = 0; i < shape[0]; i++) {
        let e = Mat.copy(c);
        for (let j = 0; j < e.length; j++) {
          e[j].splice(i, 1);
        }
        d += (i % 2 ? -1 : 1) * mat[0][i] * Mat.det(Mat.transpose(e), method);
      }
    } else if (method == 'gauss') {
      let r = Mat.gauss(mat, true);
      let m = r[0];
      d = m[m.length - 2][m.length - 2] * m[m.length - 1][m.length - 1] - m[m.length - 2][m.length - 1] * m[m.length - 1][m.length - 2];
      for (let i = 0; i < m.length - 2; i++) {
        d *= m[i][i];
      }
      r[1] % 2 ? d *= -1 : d *= 1;
    }
    return d;
  },
  /**
   * Gaussian elimination, it is used to reduce a matrix into its upper-triangular form. This implimentation does not modify the input matrix.
   * @param {number[][]} mat 
   * @param {boolean} swapCount Defaults to false, if set to true, it will return the number of row swaps made during elimination.
   * @returns {number[][] | [number[][], number]} If swapCount is set to true, it will return an array with the reduced matrix and row swap count, otherwise it will only return the matrix.
   */
  gauss(mat, swapCount = false) {
    // credit: https://en.m.wikipedia.org/wiki/Gaussian_elimination
    let c = Mat.copy(mat);
    let shape = Mat.shape(c);
    let h = 0;
    let k = 0;
    let m = shape[0]; // number of rows
    let n = shape[1]; // number of columns
    let s = 0; // row swap count
    while (h < m && k < n) {
      let maxEntry = 0;
      let i_max = 0;
      for (let i = h; i < m; i++) {
        let entry = Math.abs(c[i][k]);
        if (maxEntry > entry) continue;
        maxEntry = entry;
        i_max = i;
      }
      if (c[i_max][k] == 0) {
        k++;
      } else {
        if (h != i_max) {
          c[h] = c.splice(i_max, 1, c[h])[0];
          s++;
        }
        for (let i = h + 1; i < m; i++) {
          let f = c[i][k] / c[h][k];
          c[i][k] = 0;
          for (let j = k + 1; j < n; j++) {
            c[i][j] -= c[h][j] * f;
          }
        }
        h++;
        k++;
      }
    }
    return swapCount ? [c, s] : c;
  },
  /**
   * Creates a matrix with all entries being in between 0 and 1.
   * @param {number} m Number of Rows.
   * @param {number} n Number of columns.
   * @returns {number[][]} The random matrix.
   */
  random(m, n) {
    let matrix = new Array(m);
    for (let i = 0; i < m; i++) {
      matrix[i] = new Array(n);
    }
    for (let i = 0; i < m * n; i++) {
      let x = i % n;
      let y = (i - x) / n;
      matrix[y][x] = Math.random();
    }
    return matrix;
  },
  /**
   * 
   * @param {number[][]} mat 
   * @returns 
   */
  print(mat) {
    let shape = Mat.shape(mat);
    let message = `rows: ${shape[0]}, columns: ${shape[1]}\n`;
    for (let i = 0; i < shape[0]; i++) {
      for (let j = 0; j < shape[1]; j++) {
        message += ` -------`;
      }
      message += '\n';
      message += '|'
      for (let j = 0; j < shape[1]; j++) {
        message += ` ${mat[i][j].toFixed(3)} |`;
      }
      message += '\n';
    }
    for (let j = 0; j < shape[1]; j++) {
      message += ` -------`;
    }
    return message;
  }
}

export default Mat;