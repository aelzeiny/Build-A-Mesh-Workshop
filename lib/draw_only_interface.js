import * as ClipperLib from 'js-clipper';
import Vector from './utils/vector';
import * as COLORS from './utils/colors';

const EPSILON = 10;
const TICK = 8;
class DrawOnlyInterface {
  constructor(map) {
    this.map = map;
    this.currPath = new ClipperLib.Path();
    this.isDrawing = false;
    this.mouseCalls = 0;
  }

  update(deltaTime) {}

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


    ctx.fillStyle = COLORS.BORDER;
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 1;
    for(let i=0;i<this.map.paths.length;i++) {
      const path = this.map.paths[i];
      for(let j=0;j<path.length;j++) {
        ctx.beginPath();
        ctx.arc(path[j].X, path[j].Y, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  /********** EVENTS *********/

  mousedown(pt) {
    this.mouseDrag = true;

    this.isDrawing = true;
    this.currPath.push(new ClipperLib.IntPoint(pt.x, pt.y));
    this.currPath.push(new ClipperLib.IntPoint(pt.x, pt.y));
  }

  mousemove(pt) {
    if(this.mouseDrag && this.isDrawing) {
      this.currPath[this.currPath.length - 1] = new ClipperLib.IntPoint(pt.x, pt.y);
      if(this.mouseCalls % TICK === 0) {
        let point = new ClipperLib.IntPoint(pt.x, pt.y);
        this.currPath.push(point);
      }
      this.mouseCalls++;
    }
  }

  keyDown(key) {
  }

  mouseup(pt) {
    this.mouseDrag = false;
    if(this.isDrawing) {
      this.closePath();
      this.isDrawing = false;
      this.mouseCalls = 0;
    }
  }

  closePath() {
    this.map.addPath(this.currPath);
    this.currPath = new ClipperLib.Path();
  }
}

export default DrawOnlyInterface;