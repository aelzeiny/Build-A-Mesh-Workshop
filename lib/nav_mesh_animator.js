import * as ClipperLib from '../node_modules/js-clipper/clipper';
import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';
class NavMeshAnimator {
  constructor(clipperMap) {
    this.clipperMap = clipperMap;
    this.allVerts = [];
    this.allConnects = [];
    this.bounds = clipperMap.bounds;
    this._generateNodes();
    this._connectNodes();
  }

  _connectNodes() {
    for(let i=0;i<this.allVerts.length;i++) {
      for(let j=0;j<this.allVerts.length;j++) {
        if(i === j || !this.allVerts[i].isNode || !this.allVerts[j].isNode)
          continue;
        const inSight = this.clipperMap.inLineOfSight(this.allVerts[i].value, this.allVerts[j].value);
        console.log(inSight);
        if(inSight)
          this.allConnects.push([i,j]);
      }
    }
    console.log("# CONNECTS", this.allConnects.length);
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

  draw(ctx) {
    for(let i=0;i<this.allVerts.length;i++) {
      const v = this.allVerts[i];
      ctx.fillStyle = v.isNode ? COLORS.NODE_CORRECT : COLORS.NODE_INCORRECT;
      ctx.beginPath();
      ctx.arc(v.value.X, v.value.Y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = COLORS.NODE_CONNECTION;
    ctx.lineWidth = .4;
    for(let i=0;i<this.allConnects.length;i++) {
      const from = this.allVerts[this.allConnects[i][0]].value;
      const to = this.allVerts[this.allConnects[i][1]].value;
      ctx.moveTo(from.X, from.Y);
      ctx.lineTo(to.X, to.Y);
    }
    ctx.stroke();
  }

}

export default NavMeshAnimator;
