class Main {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.getAttribute("width");
    this.height = this.canvas.getAttribute("height");
  }

  start(canvasEl) {
    const ctx = canvasEl.getContext("2d");
    const animateCallback = () => {
      this.update();

      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
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
    for (var i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw(ctx);
    }
  }

  mousedown(pt) {

  }
}

export default Main;
