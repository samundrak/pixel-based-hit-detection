class EdgeDetector {
  /**
   *
   * @param {String} color
   * @param {Array} imageDataArray
   */
  constructor(imageDataArray, colorDetectFunc) {
    this.colorDetectFunc = colorDetectFunc;
    this.imageDataArray = imageDataArray;
    this.rowCount = this.imageDataArray.length;
    this.columnCount = this.imageDataArray[0].length;
  }

  detect() {
    const top = this.detectFromTop();
    const left = this.detectFromLeft();
    const right = this.detectFromRight();
    const bottom = this.detectFromBottom();
    return [].concat(top, left, right, bottom);
  }

  detectFromLeft() {
    const arr = [];
    for (let y = 0; y < this.rowCount; y++) {
      for (let x = 0; x < this.columnCount; x++) {
        const pixel = this.imageDataArray[y][x];

        const { red, green, blue, alpha } = pixel.color;
        // break point is here
        if (alpha !== 0) {
          break;
        }
        arr[y] = pixel;
      }
    }
    return arr;
  }

  detectFromTop() {
    const arr = [];
    for (let x = 0; x < this.columnCount; x++) {
      for (let y = 0; y < this.rowCount; y++) {
        const pixel = this.imageDataArray[y][x];

        const { red, green, blue, alpha } = pixel.color;
        // break point is here
        if (alpha !== 0) {
          break;
        }
        arr[x] = pixel;
      }
    }
    return arr;
  }

  detectFromBottom() {
    const arr = [];
    for (let x = 0; x < this.columnCount; x++) {
      for (let y = this.rowCount - 1; y > 0; y--) {
        const pixel = this.imageDataArray[y][x];

        const { red, green, blue, alpha } = pixel.color;
        // break point is here
        if (alpha !== 0) {
          break;
        }
        arr[x] = pixel;
      }
    }
    return arr;
  }

  detectFromRight() {
    const arr = [];
    for (let y = this.rowCount - 1; y > 0; y--) {
      for (let x = this.columnCount - 1; x > 0; x--) {
        const pixel = this.imageDataArray[y][x];
        const { red, green, blue, alpha } = pixel.color;
        // break point is here
        if (alpha !== 0) {
          break;
        }
        arr[y] = pixel;
      }
    }
    return arr;
  }
}

export default EdgeDetector;
