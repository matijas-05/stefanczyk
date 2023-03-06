export class Pawn extends THREE.Mesh {
	constructor(scene, color, x, y) {
		super();

		this.geometry = new THREE.SphereGeometry(50, 32, 32);
		this.material = new THREE.MeshBasicMaterial({
			color: color === "white" ? 0xf8f8f8 : 0xe83f25,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("../gfx/wood.png"),
		});
		this.position.set(x * 100, 50, y * 100);
		this.name = "pawn";

		scene.add(this);
	}

	static getColorByName(name) {
		if (name === "white") return 0xf8f8f8;
		else if (name === "black") return 0xe83f25;
		else return 0x000000;
	}
}
