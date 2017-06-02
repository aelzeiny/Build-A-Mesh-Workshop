import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as COLORS from './utils/colors';

class ClipperOffsetMap {
  constructor(boundary, holes) {
    // offset outter polygon inward
    let co = new ClipperLib.ClipperOffset(2, 0.25);
    co.AddPath(boundary,
       ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    const slimBoundard = new ClipperLib.Paths();
    co.Execute(slimBoundard, -5);
    // offset holes outwards
    const bigHoles = new ClipperLib.Paths();
    co.Clear();
    co.AddPaths(holes,
      ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(bigHoles, 5);

    this.paths = new ClipperLib.Paths();
    let c = new ClipperLib.Clipper();
    c.AddPaths(slimBoundard, ClipperLib.PolyType.ptSubjectptClip, true);
    c.AddPaths(bigHoles, ClipperLib.PolyType.ptSubjectptClip, true);
    c.Execute(ClipperLib.ClipType.ctDifference, this.paths);
  }

  draw(ctx) {
    for(let i=0;i<this.paths.length;i++) {
      const path = this.paths[i];
      ctx.fillStyle = COLORS.BLUEPRINT;
      if(this.holesI[i])
        ctx.fillStyle = COLORS.AUTOMA_BORDER;

      ctx.beginPath();
      for(let j=0;j<path.length;j++) {
        ctx.lineTo(path[j].X, path[j].Y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}

export default ClipperOffsetMap;
