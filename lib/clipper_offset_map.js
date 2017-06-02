import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';

const OFFSET = 5;
class ClipperOffsetMap {
  constructor(boundary, holes) {
    // offset outter polygon inward
    let co = new ClipperLib.ClipperOffset(2, 0.25);
    co.AddPath(boundary,
       ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    const slimBoundard = new ClipperLib.Paths();
    co.Execute(slimBoundard, -OFFSET);
    // offset holes outwards
    const bigHoles = new ClipperLib.Paths();
    co.Clear();
    co.AddPaths(holes,
      ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(bigHoles, OFFSET);

    this.paths = new ClipperLib.Paths();
    let c = new ClipperLib.Clipper();
    c.AddPaths(slimBoundard, ClipperLib.PolyType.ptSubject, true);
    c.AddPaths(bigHoles, ClipperLib.PolyType.ptClip, true);
    c.Execute(ClipperLib.ClipType.ctDifference, this.paths);
  }

  inLineOfSight(ga, gb) {
    let a = ga, b = gb;
    let isCrossing;
    console.log(a);
    console.log(b);
    for(let i=0;i<this.paths.length;i++) {
      const poly = this.paths[i];
      for(let j=0;j<poly.length;j++) {
        isCrossing = MeshGuru.lineSegmentsCross(a, b,
          poly[i], poly[i + 1 === poly.length ? 0 : i + 1]);
        if(isCrossing) {
          return false;
        }
      }
    }
    return true;
  }

  /// Drawing mode for debugging purposes only
  draw(ctx) {
    // ctx.strokeStyle = COLORS.BORDER;
    // ctx.lineWidth = 2;
    // for(let i=0;i<this.paths.length;i++) {
    //   const path = this.paths[i];
    //   ctx.fillStyle = COLORS.BLUEPRINT;
    //
    //   ctx.beginPath();
    //   for(let j=0;j<path.length;j++) {
    //     ctx.lineTo(path[j].X, path[j].Y);
    //   }
    //   ctx.closePath();
    //   ctx.fill();
    //   ctx.stroke();
    // }
  }
}

export default ClipperOffsetMap;
