import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';
class NavMeshAnimator {
  constructor(clipperMap) {
    this.allVerts = [];
    this.allConnects = [];
    this.bounds = clipperMap.bounds;
    this._generateNodes(clipperMap);
    this._connectNodes();
  }

  _connectNodes() {
    for(let i=0;i<this.allVerts.length;i++) {
      for(let j=0;j<this.allVerts.length;j++) {
        if(i === j || !this.allVerts[i].isNode || !this.allVerts[j].isNode)
          continue;
        if(this._inLineOfSight(this.allVerts[i], this.allVerts[j]))
          this.allConnects.push([i,j]);
      }
    }
  }

  _inLineOfSight(v1, v2) {
    for(let i=0;i<this.)
  }

  _generateNodes(clipperMap) {
    for(let i=0;i<clipperMap.paths.length;i++) {
      const poly = clipperMap.paths[i];
      const isHole = clipperMap.holesI[i];
      for(let j=0;j<poly.length;j++) {
        this.allVerts.push({
          value: poly[j],
          // javascript XOR on booleans is a bit strange...
          isNode: !MeshGuru.isVertexConcave(poly, j) ^ !isHole
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
  }

}

export default NavMeshAnimator;
