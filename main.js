/**** DOCUMENT *****/
document.addEventListener("DOMContentLoaded", function() {

  const canvasEl = document.getElementsByTagName("canvas")[0];
  const main = new Main(canvasEl);
  main.start();
  window.addEventListener("keydown", (e) => main.keyDown(e.keyCode), true);
  window.addEventListener("keyup", (e) => main.keyUp(e.keyCode), true);
  window.addEventListener("mousemove", main.mousemove.bind(main));
  window.addEventListener("mousedown", main.mousedown.bind(main));
  window.addEventListener("mouseup", main.mouseup.bind(main));
  window.addEventListener("mousewheel", main.mousewheel.bind(main));
  window.addEventListener("DOMMouseScroll", main.mousewheel.bind(main));
});

class Main {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.getAttribute("width");
    this.height = this.canvas.getAttribute("height");
    this.map = new Map();
    this.interface = new Interface(this.map);
    this.gameObjects = {
      this.interface(),
      this.map()
    }
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
}

export default Main;
