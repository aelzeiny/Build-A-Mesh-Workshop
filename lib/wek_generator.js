import ClipperMap from './clipper_map';
import AutomaMap from './automa_map';
import Vector from './utils/vector';
import NavMesh from './utils/nav_mesh';
import NavMeshAnimator from './nav_mesh_animator';
import Navigator from './navigator';
import AutomaToClipperConverter from './automa_to_clipper';
import WekDriver from './wek/wek_driver';

class WekGenerator {
  constructor(width, height, grid) {
    this.grid = grid;
    this.width = width;
    this.height = height;
    this.regenerate();
  }

  regenerate() {
    this._constructAutoma();
    this._constructClipper();
    this._constructMesh();
    this.wek = new WekDriver(this.navigator, this.clipperMap.paths, this.clipperMap.holesI);
  }

  _constructAutoma() {
    this.automa = new AutomaMap (
      Math.floor(this.height / this.grid),
      Math.floor(this.width / this.grid), this.grid
    );
    this.automa.RandomFillMap();
    this.automa.MakeCaverns();
  }

  _constructClipper() {
    const converter = new AutomaToClipperConverter(this.automa, this.grid);
    this.clipperMap = converter.generateClipper();
  }

  _constructMesh() {
    const offsetMap = this.clipperMap.selectPrimaryBiggest();
    const navMeshAnimator = new NavMeshAnimator(offsetMap, () => {});
    this.navigator =
      new Navigator(navMeshAnimator.generateMesh(), offsetMap, this.clipperMap.startPoint);
  }
}

export default WekGenerator;