class ClipperOffsetMap {
  constructor(boundary, holes) {

  }
}

export default ClipperOffsetMap;



// offset outter polygon inward
let co = new ClipperLib.ClipperOffset(2, 0.25);
const bigTarget = this.paths[this.biggestTargetIdx];
co.AddPath(bigTarget,
   ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
const bigBoundard = new ClipperLib.Paths();
co.Execute(bigBoundard, -5);
// offset holes outwards
co.Clear();
co.AddPaths(bigBoundard,
  ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
this.boundaries = new ClipperLib.Paths();
co.Execute(this.boundaries, 10);
