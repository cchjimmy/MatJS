const Mat = {
  shape(mat) {
    let rows = mat.length;
    let columns = 0;
    for (let i = 0; i < rows; i++) {
      columns = columns >= mat[i].length ? columns : mat[i].length;
    }
    return [rows, columns];
  },
  matrix(...values) {
    let shape = Mat.shape(values);
    let matrix = [];
    for (let j = 0; j < shape[0]; j++) {
      matrix.push(values[j].length ? [...values[j]] : [values[j]]);
      let l = values[j].length || 1;
      for (let i = 0; i < shape[1] - l; i++) {
        matrix[j].push(0);
      }
    }
    return matrix;
  },
  zeros(m, n) {
    let matrix = [];
    for (let j = 0; j < m; j++) {
      matrix.push([]);
      for (let i = 0; i < n; i++) {
        matrix[j].push(0);
      }
    }
    return matrix;
  },
  add(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    if (JSON.stringify(shape1) != JSON.stringify(shape2)) return;
    for (let j = 0; j < shape1[0]; j++) {
      for (let i = 0; i < shape1[1]; i++) {
        mat1[j][i] += mat2[j][i];
      }
    }
    return mat1;
  },
  subtract(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    if (JSON.stringify(shape1) != JSON.stringify(shape2)) return;
    for (let j = 0; j < shape1[0]; j++) {
      for (let i = 0; i < shape1[1]; i++) {
        mat1[j][i] -= mat2[j][i];
      }
    }
    return mat1;
  },
  multS(mat, scalar) {
    let shape = Mat.shape(mat);
    for (let j = 0; j < shape[0]; j++) {
      for (let i = 0; i < shape[1]; i++) {
        mat[j][i] *= scalar;
      }
    }
    return mat;
  },
  transpose(mat) {
    let result = [];
    let shape = Mat.shape(mat);
    for (let j = 0; j < shape[1]; j++) {
      result.push([]);
      for (let i = 0; i < shape[0]; i++) {
        result[j].push(mat[i][j]);
      }
    }
    return result;
  },
  copy(source) {
    return Mat.matrix(...source);
  },
  multM(mat1, mat2) {
    let shape1 = Mat.shape(mat1);
    let shape2 = Mat.shape(mat2);
    if (shape1[1] != shape2[0]) return;
    let result = []
    for (let i = 0; i < shape1[1]; i++) {
      result.push([]);
      for (let j = 0; j < shape2[0]; j++) {
        result[i].push(Mat.dot(mat1, mat2, i, j));
      }
    }
    return result;
  },
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
  identity(order) {
    let matrix = [];
    for (let i = 0; i < order; i++) {
      matrix.push([])
      for (let j = 0; j < order; j++) {
        matrix[i].push(i == j ? 1 : 0);
      }
    }
    return matrix;
  },
  signs(order) {
    let matrix = [];
    for (let i = 0; i < order; i++) {
      matrix.push([]);
      for (let j = 0; j < order; j++) {
        matrix[i].push((j + i) % 2 ? -1 : 1);
      }
    }
    return matrix;
  },
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
  random(m, n) {
    let matrix = [];
    for (let i = 0; i < m; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(Math.random());
      }
    }
    return matrix;
  },
  print(mat) {
    let shape = Mat.shape(mat);
    let message = `rows: ${shape[0]}, columns: ${shape[1]}\n`;
    for (let i = 0; i < shape[0]; i++) {
      message += `${mat[i]}\n`;
    }
    return message;
  }
}

export default Mat;