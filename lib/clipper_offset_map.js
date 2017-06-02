import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';

const OFFSET = 2;
class ClipperOffsetMap {
  constructor(boundary, holes, originalClipper) {
    // move line of sigh t
    this.originalClipper = originalClipper;
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

  contains(pt) {
    for(let i=0;i<this.paths.length;i++) {
      if(MeshGuru.contains(this.paths[i], i))
        return true;
    }
    return false;
  }

  inLineOfSight(a, b) {
    return this.originalClipper.inLineOfSight(a, b);
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
