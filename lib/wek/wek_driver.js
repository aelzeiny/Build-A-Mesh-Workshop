import Wek from './wek';

import * as COLORS from '../utils/colors';
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

  draw(ctx) {
    this._drawMap(ctx);
    this.wek.draw(ctx);
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