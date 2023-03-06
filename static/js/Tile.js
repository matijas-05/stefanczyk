export class Tile extends THREE.Mesh {
	constructor(x, y, white) {
		super();

		this.geometry = new THREE.BoxGeometry(100, 100, 100);
		this.material = new THREE.MeshBasicMaterial({
			color: white ? 0xeed89c : 0x492d18,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("../gfx/wood.png"),
		});
		this.position.set(x * 100, 0, y * 100);
		this.name = "tile";
	}
}
