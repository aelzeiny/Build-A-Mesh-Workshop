import Interface from './interface';
import Map from './map';
import AutomaMap from './automa_map';
import Vector from './utils/vector';
import * as COLORS from './utils/colors';

const GRID = 20;
class Main {
  constructor(canvas) {
    this.canvas = canvas;
    this.setSize();

    this.map = new Map();
    this.interface = new Interface(this.map);
    this.automa = new AutomaMap(
      Math.floor(this.canvas.width / GRID),
      Math.floor(this.canvas.height / GRID), 40, GRID
    );
    this.automa.RandomFillMap();
    this.automa.MakeCaverns();
    this.gameObjects = [
      this.interface,
      this.map
    ];
  }

  start() {
    const ctx = this.canvas.getContext("2d");
    const animateCallback = () => {
      this.update();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw(ctx);
      requestAnimationFrame(animateCallback);
    };
    animateCallback();
  }

  update() {
    const delta = new Date().getTime() - this.currentTime;
    this._update(delta);
    this.currentTime += delta;
  }

  draw(ctx) {
    // this._drawGrid(ctx);
    // for (var i = this.gameObjects.length - 1; i >= 0; i--)
    //   this.gameObjects[i].draw(ctx);
    this.automa.draw(ctx);
  }


  _update(delta) {

  }

  _drawGrid(ctx) {
    ctx.strokeStyle = COLORS.GRID_LINES;
    ctx.lineWidth = .1;

    for(let x=0;x<this.width;x+=GRID) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for(let y=0;y<this.height;y+=GRID) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    ctx.lineWidth = .2;
    for(let x=0;x<this.width;x+=GRID*5) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for(let y=0;y<this.height;y+=GRID*5) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  /********* EVENT LISTENERS ***********/
  setSize() {
    this.width = this.canvas.getAttribute("width");
    this.height = this.canvas.getAttribute("height");
    if(this.automa)
      this.automa.setSize(this.width, this.height);
  }
  keyDown(keyCode) {
    this.interface.keyDown(keyCode);
  }

  keyUp(keyCode) {

  }

  mousemove(e) {
    this.interface.mousemove(this.getMousePos(e));
  }

  mousedown(e) {
    this.interface.mousedown(this.getMousePos(e));
  }

  mouseup(e) {
    this.interface.mouseup(this.getMousePos(e));
  }

  getMousePos(e) {
    var rect = this.canvas.getBoundingClientRect();
    return new Vector(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  }

  mousewheel(e) {
    // if you ever want to implement zoom or pan:
    //https://stackoverflow.com/questions/2916081/
  }

}

export default Main;
