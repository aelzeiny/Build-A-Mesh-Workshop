import * as COLORS from './utils/colors';

const EPSILON = 5;
class Navigator {
  constructor(mesh, clipperMap, startPoint) {
    this.clipperMap = clipperMap;
    this.mesh = mesh;
    this._reconnectStartNode(startPoint);
    this.startPoint = startPoint;
  }

  setStartPoint(pt) {
    this._reconnectStartNode(pt);
  }

  promiseShortestPath(endPoint) {
    return this._reconnectEndNode(endPoint);
  }

  mousemove(pt) {
    pt = this._convertPoint(pt);
    this._reconnectEndNode(pt);
  }

  _reconnectStartNode(pt) {
    if(this.clipperMap.contains(pt)) {
      if(this.start)
        this.mesh.removeNode(this.start);
      //add node
      this.start = this.mesh.addNode(pt);
      this._connectTempNode(this.start);
    }
  }

  _reconnectEndNode(pt) {
    if(this.clipperMap.contains(pt)) {
      const promise = new Promise((resolver) => {
        if(this.goal)
          this.mesh.removeNode(this.goal);
        //add node
        this.goal = this.mesh.addNode(pt);
        this._connectTempNode(this.goal);
        resolver(this.mesh.aStar(this.start, this.goal));
      });
      promise.then(data => {this.path = data;});
      return promise;
    }
    return undefined;
  }

  _connectTempNode(node) {
    // connect node to entire map
    const cm = this.clipperMap;
    const verts = this.mesh.getVerts();
    for(let i=0;i<verts.length;i++) {
      if(cm.inLineOfSight(verts[i].value, node.value)) {
        this.mesh.connectNodes(verts[i], node);
      }
    }
    if(this.start && this.goal) {
      if(cm.inLineOfSight(this.start.value, this.goal.value)) {
        this.mesh.connectNodes(this.start, this.goal);
      }
      else
        this.mesh.disconnectNodes(this.start, this.goal);
    }
  }

  _convertPoint(pt) {
    return {X: pt.x, Y: pt.y};
  }

  update(delta) {

  }

  draw(ctx) {
    const verts = this.mesh.getVerts();
    ctx.beginPath();
    ctx.strokeStyle = COLORS.NODE_CONNECTION;
    ctx.lineWidth = .4;
    for(let i=0;i<verts.length;i++) {
      const from = verts[i];
      for(let j=0;j<from.neighbors.length;j++) {
        ctx.moveTo(from.value.X, from.value.Y);
        ctx.lineTo(from.neighbors[j].value.X, from.neighbors[j].value.Y);
      }
    }
    ctx.stroke();

    for(let i=0;i<verts.length;i++) {
      const v = verts[i];
      ctx.beginPath();
      ctx.arc(v.value.X, v.value.Y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }

    if(this.path && this.path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = COLORS.PATH;
      ctx.lineWidth = 4;
      ctx.moveTo(this.path[0].X, this.path[0].Y);
      for(let i=1;i<this.path.length;i++) {
        ctx.lineTo(this.path[i].X, this.path[i].Y);
      }
      ctx.stroke();
    }
  }
}

export default Navigator;
