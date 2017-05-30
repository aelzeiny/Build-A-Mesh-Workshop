import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as COLORS from './colors';

class Map {
  constructor() {
    this.clipper = new ClipperLib.Clipper();
    this.paths = new ClipperLib.Paths();
  }

  addPath(path) {
      let clipper = new ClipperLib.Clipper();
      clipper.AddPaths(this.paths, ClipperLib.PolyType.ptSubject,true);
      clipper.AddPath(path, ClipperLib.PolyType.ptClip,true);
      let answer = new ClipperLib.Paths();
      clipper.Execute(ClipperLib.ClipType.ctUnion, answer);
      this.paths = answer;
  }

  draw(ctx) {
    ctx.fillStyle = COLORS.BLUEPRINT;
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 5;
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}
export default Map;
