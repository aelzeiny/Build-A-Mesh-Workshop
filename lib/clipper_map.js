import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as COLORS from './utils/colors';
import * as MeshGuru from './utils/mesh_guru';
import Vector from './utils/vector';

class ClipperMap {
  constructor(paths = null) {
    this.clipper = new ClipperLib.Clipper();
    this.paths = paths || new ClipperLib.Paths();
    this.holesI = new Array();
    this.isUnion = true;
  }

  addPath(path) {
    let clipper = new ClipperLib.Clipper();
    clipper.AddPaths(this.paths, ClipperLib.PolyType.ptSubject,true);
    clipper.AddPath(path, ClipperLib.PolyType.ptClip,true);
    let answer = new ClipperLib.Paths();
    const mode = this.isUnion ? ClipperLib.ClipType.ctUnion :
      ClipperLib.ClipType.ctDifference;
    clipper.Execute(mode, answer);
    this.paths = answer;
    this._checkHoles();
  }

  _checkHoles() {
    for(let i=0; i<this.paths.length; i++) {
      const outterPoly = this.paths[i];
      for(let j=0;j<this.paths.length;j++) {
        if(i === j)
          continue;
        const innerPoly = this.paths[j];
        if(this._isHole(outterPoly, innerPoly))
          this.holesI.push(j);
      }
    }
  }

  /// return false if one point is not contained within the polygon
  /// otherwise, return true
  _isHole(outterPoly, innerPoly) {
    for(let ptI = 0; ptI < innerPoly.length; ptI++) {
      if(!MeshGuru.contains(outterPoly, ptI))
        return false;
    }
    return true;
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
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = COLORS.BORDER;
    ctx.strokeStyle = COLORS.BORDER;
    ctx.lineWidth = 1;
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      for(let j=0;j<path.length;j++) {
        ctx.beginPath();
        ctx.arc(path[j].X, path[j].Y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
}
export default ClipperMap;
