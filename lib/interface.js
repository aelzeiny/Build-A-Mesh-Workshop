import * as ClipperLib from '../node_modules/js-clipper/clipper.js'

class Interface {
  constructor(map) {
    this.map = map;
    this.currPath = new ClipperLib.Path();
  }

  update(deltaTime) {}

  mousedown(pt) {
    this.mouseDrag = true;
    let point = new ClipperLib.IntPoint(pt.x, pt.y);
    this.currPath.push(point);
  }

  mousemove(pt) {
    if(this.mouseDrag) {
      // const currPt = this.currPath[this.currPath.length-1];
      // currPt.X = e.clientX;
      // currPt.Y = e.clientY;
    }
  }

  mouseup(pt) {
    this.mouseDrag = false;
  }

  draw(ctx) {
    for(let i=0;i<this.currPath.length;i++) {
      ctx.beginPath();
      const pt = this.currPath[i];
      ctx.arc(pt.X, pt.Y, 15, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export default Interface;
