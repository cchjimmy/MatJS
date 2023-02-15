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
  zeros(n, m) {
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
    let result = [];
    if (mat1[0].length != mat2.length) return result;
    for (let i = 0; i < mat1.length; i++) {
      result.push([]);
      for (let j = 0; j < mat2[0].length; j++) {
        result[i].push(Mat.dot(mat1, mat2, i, j));
      }
    }
    return result;
  },
  /**
   * 
   * @param {*} mat1 
   * @param {*} mat2 
   * @param {*} rowIndex 
   * @param {*} colIndex 
   * @returns 
   */
  dot(mat1, mat2, rowIndex = 0, colIndex = 0) {
    let result = 0;
    if (mat1[0].length != mat2.length) return result;
    for (let i = 0; i < mat1[0].length; i++) {
      result += mat1[rowIndex][i] * mat2[i][colIndex];
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
  }
}

export default Mat;