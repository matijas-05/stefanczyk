class Game {
	constructor() {
		this.checkerboard = [
			[1, 0, 1, 0, 1, 0, 1, 0],
			[0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0],
			[0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0],
			[0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0],
			[0, 1, 0, 1, 0, 1, 0, 1],
		];

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);
		this.camera.position.set(300, 600, 1050);
		this.camera.rotateX(-Math.PI / 4);

		const axesHelper = new THREE.AxesHelper(1000);
		axesHelper.position.y = 100;
		this.scene.add(axesHelper);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(0x0066ff);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("root").append(this.renderer.domElement);

		this.drawCheckerboard();
		this.render();
	}

	drawCheckerboard = () => {
		for (let y = 0; y < this.checkerboard.length; y++) {
			for (let x = 0; x < this.checkerboard[y].length; x++) {
				const white = this.checkerboard[y][x] === 1;

				const geometry = new THREE.BoxGeometry(100, 100, 100);
				const material = new THREE.MeshBasicMaterial({
					color: white ? 0xcccccc : 0x401708,
					side: THREE.DoubleSide,
					map: new THREE.TextureLoader().load("../gfx/wood.png"),
				});
				const cube = new THREE.Mesh(geometry, material);
				cube.position.set(x * 100, 0, y * 100);

				this.scene.add(cube);
			}
		}
	};

	render = () => {
		this.renderer.render(this.scene, this.camera);
		console.log("render leci");

		requestAnimationFrame(this.render);
	};
}
