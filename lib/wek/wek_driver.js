import Wek from './wek';

import * as COLORS from '../utils/colors';
import Vector from '../utils/vector';
class WekDriver {
  constructor(navigator, paths, holesI) {
    this.navigator = navigator;
    this.paths = paths;
    this.holesI = holesI;
    this.wek = new Wek(this.navigator.startPoint);
    this.footprintImg = document.getElementById("footprints");
    this.footprints = new Array(50);
    this.footprintsI = 0;
    window.setInterval(this._footprint.bind(this), 200);
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

  _footprint() {
    if (this.wek.velo.distanceSq() > 0) {
      this.footprints[this.footprintsI] = {
        pos: this.wek.pos,
        rot: this.wek.rotation
      };
      this.footprintsI = (this.footprintsI + 1) % this.footprints.length;
    }
  }

  draw(ctx) {
    this._drawMap(ctx);
    this._drawFootprints(ctx);
    this._drawHoles(ctx);
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

  _drawFootprints(ctx) {
    let width = 15;
    const adjHeight = width / this.footprintImg.width * this.footprintImg.height;
    for(let i=0;i<this.footprints.length;i++) {
      const foot = this.footprints[i];
      if(!foot)
        break;
      ctx.save();
      ctx.translate(foot.pos.x, foot.pos.y);
      ctx.rotate(foot.rot);
      ctx.drawImage(this.footprintImg, - width/2, - adjHeight/2, width, adjHeight);
      ctx.restore();
    }
  }

  _drawMap(ctx) {
    ctx.save();
    ctx.lineWidth = 2;
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.fillStyle = COLORS.WEK_FORGROUND;
      if(this.holesI[i])
        continue;
      ctx.shadowColor = 'cornflowerblue';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  _drawHoles(ctx) {

    ctx.save();
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.fillStyle = COLORS.BLUEPRINT;
      if(!this.holesI[i])
        continue;
      ctx.shadowColor = 'cornflowerblue';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

export default WekDriver;