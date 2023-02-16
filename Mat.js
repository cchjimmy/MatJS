const Mat = {
  matrix(...values) {
    let columns = Math.max(...(() => {
      let l = [];
      for (let i = 0; i < values.length; i++) {
        l.push(values[i].length || 1);
      }
      return l;
    })());
    let matrix = [];
    for (let j = 0; j < values.length; j++) {
      matrix.push(values[j].length ? [...values[j]] : [values[j]]);
      let l = values[j].length || 1;
      for (let i = 0; i < columns - l; i++) {
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
    if (mat1[0].length != mat2[0].length || mat1.length != mat2.length) return;
    for (let j = 0; j < mat1.length; j++) {
      for (let i = 0; i < mat1[0].length; i++) {
        mat1[j][i] += mat2[j][i];
      }
    }
    return mat1;
  },
  subtract(mat1, mat2) {
    if (mat1[0].length != mat2[0].length || mat1.length != mat2.length) return;
    for (let j = 0; j < mat1.length; j++) {
      for (let i = 0; i < mat1[0].length; i++) {
        mat1[j][i] -= mat2[j][i];
      }
    }
    return mat1;
  },
  multS(mat, scalar) {
    for (let j = 0; j < mat.length; j++) {
      for (let i = 0; i < mat[0].length; i++) {
        mat[j][i] *= scalar;
      }
    }
    return mat;
  },
  transpose(mat) {
    let result = [];
    for (let j = 0; j < mat[0].length; j++) {
      result.push([]);
      for (let i = 0; i < mat.length; i++) {
        result[j].push(mat[i][j]);
      }
    }
    return result;
  },
  copy(source) {
    let matrix = [];
    for (let j = 0; j < source.length; j++) {
      matrix.push([...source[j]]);
    }
    return matrix;
  },
  multM(mat1, mat2) {
    if (mat1[0].length != mat2.length) return;
    let result = [];
    for (let i = 0; i < mat1.length; i++) {
      result.push([]);
      for (let j = 0; j < mat2[0].length; j++) {
        result[i].push(Mat.dot(mat1, mat2, i, j));
      }
    }
    return result;
  },
  dot(mat1, mat2, rowIndex = 0, colIndex = 0) {
    if (mat1[0].length != mat2.length) return;
    let result = 0;
    mat2 = Mat.transpose(mat2);
    for (let i = 0; i < mat1[0].length; i++) {
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
    let d = 0;
    
    // if mat is not a square matrix, return
    if (mat.length !== mat[0].length) return;
    
    if (method == 'old') {
      // if mat is a order 2 square matrix, calculate the determinant
      if (mat.length == 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    
      let c = Mat.copy(mat);
      // remove first row
      c.splice(0, 1);
      for (let i = 0; i < mat[0].length; i++) {
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
    let h = 0;
    let k = 0;
    let m = c.length; // number of rows
    let n = c[0].length; // number of columns
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
    let message = `rows: ${mat.length}, columns: ${mat[0].length}\n`;
    for (let i = 0; i < mat.length; i++) {
      message += `${mat[i]}\n`;
    }
    return message;
  }
}

export default Mat;