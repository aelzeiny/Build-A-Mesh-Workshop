import * as ClipperLib from '../node_modules/js-clipper/clipper.js';
import * as COLORS from './utils/colors';

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
      if(currPt) { // Ensure that mouse is not dragged after after a poly has been added to map
        currPt.X = pt.x;
        currPt.Y = pt.y;
      }
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
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.fillStyle = COLORS.BORDER;
    for(let i=0;i<this.currPath.length;i++) {
      const pt = this.currPath[i];
      ctx.lineTo(pt.X, pt.Y);
      ctx.rect(pt.X - 2.5, pt.Y - 2.5, 5, 5);
    }
    ctx.fill();
    ctx.stroke();
  }
}

export default Interface;
