import Mat from './Mat.js';

(function () {
  let z = Mat.matrix([5,7,9],[4,3,8],[7,5,6]);
  console.log(Mat.string(z), Mat.string(Mat.inv(z)));
})()