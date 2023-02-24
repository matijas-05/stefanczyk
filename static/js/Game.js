export class Game {
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
		this.pawns = [
			[0, 2, 0, 2, 0, 2, 0, 2],
			[2, 0, 2, 0, 2, 0, 2, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 0],
		];

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);
		this.camera.position.set(350, 1250, 325);
		this.camera.rotateX(-Math.PI / 2);

		const axesHelper = new THREE.AxesHelper(1000);
		axesHelper.position.y = 100;
		this.scene.add(axesHelper);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(0x0066ff);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("root").append(this.renderer.domElement);

		this.drawCheckerboard();
		this.drawCheckers();
	}

	drawCheckerboard = () => {
		for (let y = 0; y < this.checkerboard.length; y++) {
			for (let x = 0; x < this.checkerboard[y].length; x++) {
				const white = this.checkerboard[y][x] === 1;

				const geometry = new THREE.BoxGeometry(100, 100, 100);
				const material = new THREE.MeshBasicMaterial({
					color: white ? 0xeed89c : 0x492d18,
					side: THREE.DoubleSide,
					map: new THREE.TextureLoader().load("../gfx/wood.png"),
				});
				const cube = new THREE.Mesh(geometry, material);
				cube.position.set(x * 100, 0, y * 100);

				this.scene.add(cube);
			}
		}
	};
	drawCheckers = () => {
		for (let y = 0; y < this.pawns.length; y++) {
			for (let x = 0; x < this.pawns[y].length; x++) {
				const pawn = this.pawns[y][x];
				if (pawn === 0) continue;

				const geometry = new THREE.SphereGeometry(50, 32, 32);
				const material = new THREE.MeshBasicMaterial({
					color: pawn === 1 ? 0xe83f25 : 0xf8f8f8,
					side: THREE.DoubleSide,
					map: new THREE.TextureLoader().load("../gfx/wood.png"),
				});
				const sphere = new THREE.Mesh(geometry, material);
				sphere.position.set(x * 100, 50, y * 100);

				this.scene.add(sphere);
			}
		}
	};

	start = (color) => {
		if (color === "black") {
			this.camera.position.set(350, 650, 1075);
			this.camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);
			console.log("black");
		} else if (color === "white") {
			this.camera.position.set(350, 650, -375);
			this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
			this.camera.rotateX(-Math.PI / 4);
			console.log("white");
		}

		this.render();
	};

	render = () => {
		this.renderer.render(this.scene, this.camera);
		// console.log("render leci");

		requestAnimationFrame(this.render);
	};
}
