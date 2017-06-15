import ClipperMap from './clipper_map';
import AutomaMap from './automa_map';
import Vector from './utils/vector';
import NavMesh from './utils/nav_mesh';
import NavMeshAnimator from './nav_mesh_animator';
import Navigator from './navigator';
import AutomaToClipperConverter from './automa_to_clipper';

class WekGenerator {
  constructor(width, height, grid) {
    this.grid = grid;
    this.width = width;
    this.height = height;
    this._constructAutoma();
  }

  _constructAutoma() {
    this.automa = new AutomaMap (
      Math.floor(this.height / this.grid),
      Math.floor(this.width / this.grid), this.grid
    );
  }

  update(delta) {

  }

  draw(ctx) {
    this.automa.draw(ctx);
  }
}

export default WekGenerator;