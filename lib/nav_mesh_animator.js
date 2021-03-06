import * as ClipperLib from 'js-clipper';
import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';
import NavMesh from './utils/nav_mesh';
const TICK = 20;
const TICK_AFTER = 20;
class NavMeshAnimator {
  constructor(clipperMap, doneFunction) {
    this.clipperMap = clipperMap;
    this.doneFunction = doneFunction;
    this.allVerts = [];
    this.allConnects = [];
    this.bounds = clipperMap.bounds;
    this._generateNodes();
    this._connectNodes();

    // Visual timer stuff
    this.tickCountdown = TICK;
    this.tickAfter = 0;
    this.visibleVerts = [];
    this.visibleConnections = [];
  }

  _connectNodes() {
    for(let i=0;i<this.allVerts.length;i++) {
      for(let j=0;j<this.allVerts.length;j++) {
        if(i === j || !this.allVerts[i].isNode || !this.allVerts[j].isNode)
          continue;
        const inSight = this.clipperMap.inLineOfSight(this.allVerts[i].value, this.allVerts[j].value);
        if(inSight)
          this.allConnects.push([i,j]);
      }
    }
  }

  _generateNodes() {
    const clipperMap = this.clipperMap;
    for(let i=0;i<clipperMap.paths.length;i++) {
      const poly = clipperMap.paths[i];
      for(let j=0;j<poly.length;j++) {
        this.allVerts.push({
          value: poly[j],
          // javascript XOR on booleans is a bit strange...
          isNode: MeshGuru.isVertexConcave(poly, j)
        });
      }
    }
  }

  update(delta) {
    this.tickCountdown -= delta;
    if(this.tickCountdown < 0) {
      this._update();
      this.tickCountdown = TICK;
    }
  }

  _update() {
    if(this.visibleVerts.length < this.allVerts.length) {
      this.visibleVerts.push(
        this.allVerts[this.visibleVerts.length]
      );
    }
    else if(this.visibleConnections.length < this.allConnects.length) {
      const toPush = [];
      for(let i=this.visibleConnections.length;i < this.allConnects.length;i++ ){
        if(toPush.length === 0)
          toPush.push(this.allConnects[i]);
        else {
          if(toPush[toPush.length-1][0] !== this.allConnects[i][0])
            break;
          toPush.push(this.allConnects[i]);
        }
      }
      this.visibleConnections = this.visibleConnections.concat(toPush);
    } else {
      if(this.tickAfter > TICK_AFTER)
        this.doneFunction();
      this.tickAfter ++;
    }
  }

  draw(ctx) {
    for(let i=0;i<this.visibleVerts.length;i++) {
      const v = this.visibleVerts[i];
      ctx.fillStyle = v.isNode ? COLORS.NODE_CORRECT : COLORS.NODE_INCORRECT;
      ctx.beginPath();
      ctx.arc(v.value.X, v.value.Y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = COLORS.NODE_CONNECTION;
    ctx.lineWidth = .4;
    for(let i=0;i<this.visibleConnections.length;i++) {
      const from = this.allVerts[this.visibleConnections[i][0]].value;
      const to = this.allVerts[this.visibleConnections[i][1]].value;
      ctx.moveTo(from.X, from.Y);
      ctx.lineTo(to.X, to.Y);
    }
    ctx.stroke();
  }

  generateMesh() {
    const verts = [];
    // get all verts
    for(let i=0;i<this.allVerts.length;i++) {
      const curr = this.allVerts[i];
      if(curr.isNode)
        verts.push(curr.value);
    }
    return new NavMesh(verts, this.allConnects.map(c => {
      return [this.allVerts[c[0]].value, this.allVerts[c[1]].value];
    }));
  }
}

export default NavMeshAnimator;
