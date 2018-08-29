// const rightEdge = [];
// const topEdge = [];
// for (let i = 0; i < imageDataIn2D.length; i++) {
//   for (let j = 0; j < imageDataIn2D[i].length; j++) {
//     const { red, green, blue, alpha } = imageDataIn2D[i][j].color;
//     if (alpha !== 0) {
//       break;
//     }
//     rightEdge[i] = imageDataIn2D[i][j];
//   }
// }
// for (let i = rightEdge[0].coords.x; i < path.width; i++) {
//   for (let j = 0; j < path.height; j++) {
//     if (!imageDataIn2D[j] || !imageDataIn2D[j][i]) continue;
//     const { red, green, blue, alpha } = imageDataIn2D[j][i].color;
//     if (alpha !== 0) {
//       break;
//     }
//     topEdge[i] = imageDataIn2D[j][i];
//   }
// }
