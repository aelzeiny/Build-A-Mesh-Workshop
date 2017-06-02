import * as MeshGuru from './utils/mesh_guru';
import * as COLORS from './utils/colors';
class NavMeshAnimator {
  constructor(clipperMap) {
    this.allVerts = [];
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

  _generateNodes() {


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
