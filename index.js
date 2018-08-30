import React from 'react';
import { render } from 'react-dom';
import { fabric } from 'fabric';
import EdgeDectector from './EdgeDetector';
import paths from './paths.json';
window.fabric = fabric;

let imageDataContext = null;
{
  const canvas = document.getElementById('imageDataOnly');
  imageDataContext = canvas.getContext('2d');
}
// const worker = new ('./worker.js')
const roundPath = paths[Math.floor(Math.random() * paths.length - 1) + 1];

const mainCanvas = new fabric.Canvas('main');
const virtualCanvas = new fabric.Canvas('virtual');

window.mainCanvas = mainCanvas;
window.virtualCanvas = virtualCanvas;
const path = new fabric.Path(roundPath, {
  fill: 'transparent',
  stroke: 'red',
  strokeWidth: 5,
  selectable: false,
});

mainCanvas.add(path);
const rect = new fabric.Rect({
  width: 100,
  height: 100,
  fill: 'black',
  left: mainCanvas.width / 2 - 100 / 2,
  top: mainCanvas.height / 2 - 100 / 2,
  selectable: true,
});
const rect1 = new fabric.Rect({
  width: 100,
  height: 100,
  fill: 'black',
  left: mainCanvas.width / 2 - 100 / 2,
  top: mainCanvas.height / 2 - 100 / 2,
  selectable: false,
});
mainCanvas.add(rect);
path.set({
  left: mainCanvas.width / 2 - path.width / 2,
  top: mainCanvas.height / 2 - path.height / 2,
});

mainCanvas.renderAll();

const path1 = new fabric.Path(roundPath, {
  fill: 'transparent',
  stroke: 'rgb(255,239,0)',
  strokeWidth: 1,
  selectable: false,
  left: path.left,
  top: path.top,
});
virtualCanvas.add(path1);
path1.bringToFront();
virtualCanvas.renderAll();

virtualCanvas.add(rect1);

const imageData = virtualCanvas.contextContainer.getImageData(
  path1.left ,
  path1.top ,
  path1.width + 50,
  path1.height + 50,
);

function to2DArray(data) {
  const imageData2D = [];

  let row = 0;
  let column = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (column >= imageData.width) {
      row++;
      column = 0;
    }

    if (!imageData2D[row]) {
      imageData2D[row] = [];
    }

    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3];
    const pixel = {
      color: {
        red,
        green,
        blue,
        alpha,
      },
      coords: {
        x: column,
        y: row,
      },
      absolute: {
        x: path1.left + column,
        y: path1.top + row,
      },
    };
    imageData2D[row].push(pixel);
    column++;
  }
  return imageData2D;
}
const data = to2DArray(imageData.data);

const edgeDetector = new EdgeDectector(data);
const leftEdge = edgeDetector.linear();
rect.on('moving', e => {
  const target = e.target;
  rect1.set(Object.assign({}, target));
  virtualCanvas.renderAll();
});

virtualCanvas.on('after:render', () => {
  console.time('one');
  const state = {};
  const imageData = virtualCanvas.contextContainer.getImageData(
    path1.left,
    path1.top ,
    path1.width + 50,
    path1.height + 50,
  );
  const pixels2D = to2DArray(imageData.data);
  const every = leftEdge.every((item, index) => {
    const pixel = pixels2D[item.coords.y][item.coords.x].color;
    const isPristine =
      pixel.red === 255 && pixel.green === 239 && pixel.blue === 0;
    if (!isPristine) {
      state.logs = [].concat(window.reactApp.state.logs, item);
    }
    return isPristine;
  });
  console.timeEnd('one');
  document.body.style.backgroundColor = every ? 'green' : 'red';
  state.isHit = !every;
  // imageDataContext.clearReact();
  imageDataContext.putImageData(imageData, 0, 0);
  window.reactApp.setState(state);
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isHit: false,
      logs: [],
    };
  }
  renderHitDetectorBoard() {
    return (
      <div
        style={{
          width: '500px',
          height: '250px',
        }}
      >
        <p>
          Status:{' '}
          <span style={{ color: this.state.isHit ? 'red' : 'green' }}>
            {this.state.isHit ? 'Outside' : 'Inside'}
          </span>
        </p>
        <hr />
        <p>Log: </p>
        <ul
          style={{
            height: '400px',
            overflow: 'scroll',
            backgroundColor: 'black',
          }}
        >
          {this.state.logs.reverse().map((item, index) => {
            return (
              <li
                key={index}
                style={{
                  borderTop: 'solid',
                  borderWidth: '1px',
                  borderColor: 'white',
                  listStyle: 'none',
                }}
              >
                <span
                  style={{
                    color: `rgba(${item.color.red}, ${item.color.green}, ${
                      item.color.blue
                    }, ${item.color.alpha})`,
                    width: '10px',
                    height: '10px',
                  }}
                >
                  {JSON.stringify(item)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  createPixelTree() {
    return (
      <table>
        <tbody>
          {imageData2D.map((row, rowIndex) => {
            return (
              <tr>
                {imageData2D[rowIndex].map((pixel, pixelIndex) => {
                  const { red, green, blue, alpha } = pixel.color;
                  return (
                    <td
                      style={{
                        width: '5px',
                        height: '5px',
                        backgroundColor:
                          leftEdge[rowIndex].coords.x === pixelIndex &&
                          leftEdge[rowIndex].coords.y === rowIndex
                            ? 'red'
                            : 'transparent',
                      }}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    return <div>{this.renderHitDetectorBoard()}</div>;
  }

  componentDidMount() {
    this.props.expose(this);
  }
}

render(
  <App
    expose={context => {
      window.reactApp = context;
    }}
  />,
  document.querySelector('#app'),
);
