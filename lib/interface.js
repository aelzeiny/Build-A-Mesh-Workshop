import * as ClipperLib from '../node_modules/js-clipper/clipper.js'

const EPSILON = 10;
class Interface {
  constructor(map) {
    this.map = map;
    this.currPath = new ClipperLib.Path();
  }

  update(deltaTime) {}

  mousedown(pt) {
    this.mouseDrag = true;
    let point = new ClipperLib.IntPoint(pt.x, pt.y);
    if(this.currPath.length > 2 &&
       Math.abs(this.currPath[0].X - pt.x) < EPSILON &&
       Math.abs(this.currPath[0].Y - pt.y) < EPSILON){
         this.closePath();
     }
     else
      this.currPath.push(point);

  }

  mousemove(pt) {
    if(this.mouseDrag) {
      const currPt = this.currPath[this.currPath.length-1];
      currPt.X = pt.x;
      currPt.Y = pt.y;
    }
  }

  mouseup(pt) {
    this.mouseDrag = false;
  }

  closePath() {
    this.map.addPath(this.currPath);
    this.currPath = new ClipperLib.Path();
  }

  draw(ctx) {
    for(let i=0;i<this.currPath.length;i++) {
      ctx.beginPath();
      const pt = this.currPath[i];
      ctx.arc(pt.X, pt.Y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export default Interface;
