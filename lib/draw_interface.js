import * as ClipperLib from 'js-clipper';
import Vector from './utils/vector';
import * as COLORS from './utils/colors';

const EPSILON = 10;
class DrawInterface {
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
        ctx.arc(path[j].X, path[j].Y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  /********** EVENTS *********/

  mousedown(pt) {
    this.mouseDrag = true;

    if(!this.isDrawing) {
      if(this._clickOnNode(pt))
        return;
    }

    this.isDrawing = true;
    let point = new ClipperLib.IntPoint(pt.x, pt.y);
    this.currPath.push(point);

  }

  mousemove(pt) {
    if(this.mouseDrag) {
      if(this.isDrawing) {
        if(this.mouseCalls % 8 === 0) {
          let point = new ClipperLib.IntPoint(pt.x, pt.y);
          this.currPath.push(point);
        }
        this.mouseCalls++;
      }
      else if(this.selectedPoly) {
        this.selectedPoly[this.selectedIdx].X = pt.x;
        this.selectedPoly[this.selectedIdx].Y = pt.y;
      }
    }
  }

  keyDown(key) {
    // // No deletion for now
    // if((key == 8 || key == 46)
    // && this.selectedPoly[this.selectedIdx]
    // && this.selectedPoly.length > 3) {
    //   console.log(this.selectedPoly);
    //   this.selectedPoly.splice(this.selectedIdx, 1);
    // }
  }

  mouseup(pt) {
    this.mouseDrag = false;
    if(this.isDrawing) {
      this.closePath();
      this.isDrawing = false;
    }
  }

  closePath() {
    this.map.addPath(this.currPath);
    this.currPath = new ClipperLib.Path();
  }

  /********** PRIVATE METHODS~ *********/
  _clickOnNode(pt) {
    for(let i=0;i<this.map.paths.length;i++) {
      const poly = this.map.paths[i];
      for(let j=0;j<poly.length;j++) {
        let v = new Vector(poly[j].X, poly[j].Y);
        if(pt.subtract(v).distanceSq() < EPSILON * EPSILON){
          this.selectedIdx = j;
          this.selectedPoly = poly;
          return true;
        }
      }
    }
    return false;
  }
}

export default DrawInterface;