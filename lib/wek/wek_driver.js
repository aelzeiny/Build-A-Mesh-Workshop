import Wek from './wek';

import * as COLORS from '../utils/colors';
import Vector from '../utils/vector';
class WekDriver {
  constructor(navigator, paths, holesI) {
    this.navigator = navigator;
    this.paths = paths;
    this.holesI = holesI;
    this.wek = new Wek(this.navigator.startPoint);
  }

  update(delta) {
    this.wek.update(delta);
  }

  mousemove(pt) {
    this.navigator.setStartPoint(this.wek.pos.toClipper());
    const promise = this.navigator.promiseShortestPath(pt.toClipper());
    if(!promise)
      return;
    promise.then(data => {
      this.wek.setPath(data.map(el => new Vector(el.X, el.Y)));
      this.path = data;
    });
  }

  draw(ctx) {
    this._drawMap(ctx);
    this._drawPath(ctx);
    this.wek.draw(ctx);
  }

  _drawPath(ctx) {
    if(this.path && this.path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = COLORS.NODE_CONNECTION;
      ctx.lineWidth = 2;
      ctx.moveTo(this.path[0].X, this.path[0].Y);
      for(let i=1;i<this.path.length;i++) {
        ctx.lineTo(this.path[i].X, this.path[i].Y);
      }
      ctx.stroke();
    }
  }

  _drawMap(ctx) {
    ctx.lineWidth = 2;
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.fillStyle = COLORS.WEK_FORGROUND;
      if(this.holesI[i])
        ctx.fillStyle = COLORS.BLUEPRINT;
      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
}

export default WekDriver;