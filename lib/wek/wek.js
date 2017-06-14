import Vector from '../utils/vector';
const SCALE = 30;
const VELO = 2;
class Wek {
  constructor(startPos) {
    this.pos = new Vector(startPos.X, startPos.Y);
    this.img = document.getElementById("wek");
    this.scale = 1.0 - 75 / this.img.width;
    this.rotation = Math.PI / 2;
    this.velo = new Vector(0, 0);
  }

  setPath(path) {
    this.path = path;
    this.destination = this.path.pop();
  }

  update(deltaTime) {
    if(this.destination) {
      const delta = this.destination.subtract(this.pos);
      this.rotation = Math.atan2(delta.y, delta.x);
      this.velo = delta.normal().times(VELO);
      this.pos = this.pos.add(this.velo.times(deltaTime));
    }
  }

  draw(ctx) {
    this._drawImage(ctx);
  }

  _drawImage(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.img, 0, 0, SCALE, SCALE / this.img.width * this.img.height);
    ctx.restore();
  }
}

export default Wek;