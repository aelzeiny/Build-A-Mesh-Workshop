import Vector from '../utils/vector';
const SCALE = 30;
const VELO = .12;
const EPSILON = 8;
class Wek {
  constructor(startPos) {
    this.pos = new Vector(startPos.X, startPos.Y);
    this.img = document.getElementById("wek");
    this.scale = 1.0 - 75 / this.img.width;
    this.rotation = Math.PI;
    this.velo = new Vector(0, 0);
  }

  setPath(path) {
    path.pop();
    this.path = path;
    this.destination = this.path.pop();
  }

  update(deltaTime) {
    if(this.destination) {
      const delta = this.destination.subtract(this.pos);
      this.rotation = Math.atan2(delta.y, delta.x) + Math.PI / 2;
      this.velo = delta.normal().times(VELO);
      this.pos = this.pos.add(this.velo.times(deltaTime));
      if(delta.distanceSq() < EPSILON * EPSILON) {
        if(this.path.length !== 1)
          this.pos = this.destination;
        this.velo.x = this.velo.y = 0;
        this.destination = (this.path.length > 0) ? this.path.pop() : undefined;
      }
    }
  }

  draw(ctx) {
    this._drawImage(ctx);
  }

  _drawImage(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    const adjHeight = SCALE / this.img.width * this.img.height;
    ctx.drawImage(this.img, -SCALE/2, -adjHeight/2, SCALE, adjHeight);
    ctx.restore();
  }
}

export default Wek;