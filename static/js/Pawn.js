export class Pawn extends THREE.Mesh {
	constructor(scene, color, x, y) {
		super();

		this.geometry = new THREE.SphereGeometry(50, 32, 32);
		this.material = new THREE.MeshBasicMaterial({
			color: color === "white" ? 0xe83f25 : 0xf8f8f8,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("../gfx/wood.png"),
		});
		this.position.set(x * 100, 50, y * 100);

		scene.add(this);
	}
}
