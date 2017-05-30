import Interface from './interface';
import Map from './map';
import Vector from './utils/vector';

class Main {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.getAttribute("width");
    this.height = this.canvas.getAttribute("height");

    this.map = new Map();
    this.interface = new Interface(this.map);

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
    this.asteroidGenTimer -= delta;
    this._update(delta);
    this.currentTime += delta;
  }

  draw(ctx) {
    for (var i = this.gameObjects.length - 1; i >= 0; i--) {
      this.gameObjects[i].draw(ctx);
    }
  }


  _update(delta) {

  }

  /********* EVENT LISTENERS ***********/
  keyDown(keyCode) {

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
