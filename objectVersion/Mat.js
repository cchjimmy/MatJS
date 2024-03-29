const Mat = {
  /**
   * Finds the shape of a matrix.
   * @param {number[][]} mat 
   * @returns {number[]} [number of rows, number of columns]
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
   * Creates a matrix with every entry equals to the specified value.
   * @param {number} m Number of rows.
   * @param {number} n Number of columns.
   * @param {number} value Specific value to fill the matrix.
   * @returns {number[][]} A matrix with specified shape and value.
   */
  fill(m, n, value = 0) {
    let matrix = new Array(m);
    let row = new Array(n).fill(value);
    for (let i = 0; i < m; i++) {
      matrix[i] = row.slice();
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
    let [r, c] = Mat.shape(mat1);
    let result = new Array(r);
    for (let i = 0; i < r; i++) {
      result[i] = new Array(c);
      for (let j = 0; j < c; j++) {
        result[i][j] = mat1[i][j] + mat2[i][j];
      }
    }
    return result;
  },
  /**
   * Matrix subtration, modifies the matrix in the first argument. Both input matrices must have the same shape.
   * @param {number[][]} mat1 
   * @param {number[][]} mat2 
   * @returns {number[][] | undefined} mat1
   */
  subtract(mat1, mat2) {
    let [r, c] = Mat.shape(mat1);
    let result = new Array(r);
    for (let i = 0; i < r; i++) {
      result[i] = new Array(c);
      for (let j = 0; j < c; j++) {
        result[i][j] = mat1[i][j] - mat2[i][j];
      }
    }
    return result;
  },
  /**
   * Multiplies the input scalar into all entries of the input matrix.
   * @param {number[][]} mat 
   * @param {number} scalar 
   * @returns {number[][]} mat
   */
  multS(mat, scalar) {
    let [r, c] = Mat.shape(mat);
    let result = new Array(r);
    for (let i = 0; i < r; i++) {
      result[i] = new Array(c);
      for (let j = 0; j < c; j++) {
        result[i][j] = mat[i][j] * scalar;
      }
    }
    return result;
  },
  /**
   * Matrix transposition, this does not modify the input matrix.
   * @param {number[][]} mat 
   * @returns {number[][]} A new matrix of the transposed input matrix.
   */
  transpose(mat) {
    let [r, c] = Mat.shape(mat);
    let result = new Array(c);
    for (let i = 0; i < c; i++) {
      result[i] = new Array(r);
      for (let j = 0; j < r; j++) {
        result[i][j] = mat[j][i];
      }
    }
    return result;
  },
  /**
   * Copies the input matrix.
   * @param {number[][]} source source matrix.
   * @returns {number[][]} A new matrix with entries the same as the source matrix.
   */
  copy(source) {
    let matrix = new Array(source.length);
    for (let i = 0; i < source.length; i++) {
      matrix[i] = source[i].slice();
    }
    return matrix;
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
    let result = new Array(shape1[0]);
    for (let i = 0; i < shape1[0]; i++) {
      result[i] = new Array(shape2[1]);
      for (let j = 0; j < shape2[1]; j++) {
        result[i][j] = 0;
        for (let k = 0; k < shape1[1]; k++) {
          result[i][j] += mat1[i][k] * mat2[k][j];
        }
      }
    }
    return result;
  },
  /**
   * dot product between 2 nth length vectors v1 and v2
   * @param {number[]} v1
   * @param {number[]} v2
   * @returns {number} The result of the dot product.
   */
  dot(v1, v2) {
    let result = 0;
    for (let i = 0; i < v1.length; i++) {
      result += v1[i] * v2[i];
    }
    return result;
  },
  /**
   * Creates an identity matrix with specified order.
   * @param {number} order 
   * @returns {number[][]} An identity matrix.
   */
  identity(order) {
    let matrix = Mat.fill(order, order);
    for (let i = 0; i < order; i++) {
      matrix[i][i] += 1;
    }
    return matrix;
  },
  /**
   * Creates an alternating sign matrix, the entries are either 1 or -1
   * @param {number} order 
   * @returns {number[][]} A sign matrix
   */
  sign(order) {
    let matrix = new Array(order);
    let r0 = new Array(order);
    for (let i = 0; i < order; i++) {
      r0[i] = i % 2 ? -1 : 1;
    }
    let r1 = r0.slice(1);
    r1.push((r0.length - 1) % 2 ? 1 : -1);
    for (let i = 0; i < order; i++) {
      matrix[i] = i % 2 ? r1.slice() : r0.slice();
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
   * Creates a matrix with all entries being in between min and max.
   * @param {number} m Number of Rows.
   * @param {number} n Number of columns.
   * @param {number} min Random minimum.
   * @param {number} max Random maximum.
   * @returns {number[][]} The random matrix.
   */
  random(m, n, min = 0, max = 1) {
    let matrix = new Array(m);
    for (let i = 0; i < m; i++) {
      matrix[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        matrix[i][j] = Math.random() * (max - min) + min;
      }
    }
    return matrix;
  },
  /**
   * Creates a string representation of the matrix with shape information.
   * @param {number[][]} mat 
   * @returns {string} The string representing the input matrix.
   */
  pretty(mat) {
    let shape = Mat.shape(mat);
    let s = `rows: ${shape[0]}, columns: ${shape[1]}\n`;
    for (let i = 0; i < shape[0]; i++) {
      for (let j = 0; j < shape[1]; j++) {
        s += ` -------`;
      }
      s += '\n|';
      for (let j = 0; j < shape[1]; j++) {
        s += ` ${mat[i][j].toFixed(3)} |`;
      }
      s += '\n';
    }
    for (let j = 0; j < shape[1]; j++) {
      s += ` -------`;
    }
    return s;
  },

  // credit: https://www.geeksforgeeks.org/finding-inverse-of-a-matrix-using-gauss-jordan-method/
  // Function to perform the inverse operation on the
  // matrix.
  inv(mat) {
    // Matrix Declaration.

    let temp;
    mat = Mat.copy(mat);
    let order = Mat.shape(mat)[0];

    // Create the augmented matrix
    let identity = Mat.identity(order);

    for (let i = 0; i < order; i++) {
      mat[i].push(...identity[i]);
    }

    // Interchange the row of matrix,
    // interchanging of row will start from the last row
    for (let i = order - 1; i > 0; i--) {

      if (mat[i - 1][0] < mat[i][0]) {
        let tempArr = mat[i];
        mat[i] = mat[i - 1];
        mat[i - 1] = tempArr;
      }
    }

    // Replace a row by sum of itself and a
    for (let i = 0; i < order; i++) {

      for (let j = 0; j < order; j++) {

        if (j != i) {

          temp = mat[j][i] / mat[i][i];
          for (let k = 0; k < 2 * order; k++) {

            mat[j][k] -= mat[i][k] * temp;
          }
        }
      }
    }

    for (let i = 0; i < order; i++) {

      temp = mat[i][i];
      for (let j = 0; j < 2 * order; j++) {

        mat[i][j] = mat[i][j] / temp;
      }
    }

    for (let i = 0; i < order; i++) {
      mat[i].splice(0, 3);
    }
    return mat;
  },
  max(mat) {
    let max = -Infinity;
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].length; j++) {
        max = max >= mat[i][j] ? max : mat[i][j];
      }
    }
    return max;
  },
  min(mat) {
    let min = Infinity;
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].length; j++) {
        min = min <= mat[i][j] ? min : mat[i][j];
      }
    }
    return min;
  }
}

export default Mat;