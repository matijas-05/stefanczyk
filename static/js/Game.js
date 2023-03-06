import { Net } from "./Net.js";
import { Pawn } from "./Pawn.js";

export class Game {
	constructor() {
		/**
		 * 1 - white,
		 * 0 - black
		 */
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
		/**
		 * 2 - white pawn,
		 * 1 - black pawn,
		 * 0 - empty
		 */
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
		this.canMove = false;
		/**
		 * @type {Net} net
		 */
		this.net = null;

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

		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
		window.onpointermove = (e) => {
			this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};
		window.onpointerdown = () => (this.clicked = true);
		window.onpointerup = () => (this.clicked = false);

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
				cube.name = "tile";

				this.scene.add(cube);
			}
		}
	};
	drawCheckers = () => {
		for (let y = 0; y < this.pawns.length; y++) {
			for (let x = 0; x < this.pawns[y].length; x++) {
				const pawn = this.pawns[y][x];
				if (pawn === 0) continue;

				new Pawn(this.scene, pawn === 2 ? "white" : "black", x, y);
			}
		}
	};

	beginRound = (color) => {
		console.log("beginRound");
		this.canMove = this.color === color;
	};
	endRound = () => {
		this.net.endRound(this.color);
		this.canMove = false;
	};

	start = (color) => {
		console.log("start");
		this.color = color;

		if (color === "black") {
			this.camera.position.set(350, 650, 1075);
			this.camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4);
		} else if (color === "white") {
			this.camera.position.set(350, 650, -375);
			this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
			this.camera.rotateX(-Math.PI / 4);
		}

		this.render();
	};

	render = () => {
		if (this.canMove) {
			this.raycaster.setFromCamera(this.pointer, this.camera);
			const intersects = this.raycaster.intersectObjects(this.scene.children);

			if (this.clicked && intersects.length > 0) {
				// Move pawn
				if (this.selectedPawn && intersects[0].object.name === "tile") {
					this.selectedPawn.material.color.set(Pawn.getColorByName(this.color));
					this.endRound();
					console.log(intersects[0].object);
				} else if (this.selectedPawn && intersects[0].object.name === "pawn") {
					this.selectedPawn.material.color.set(Pawn.getColorByName(this.color));
				}

				// Select pawn
				if (
					intersects[0].object.name === "pawn" &&
					intersects[0].object.material.color.equals(
						new THREE.Color(Pawn.getColorByName(this.color))
					)
				) {
					this.selectedPawn = intersects[0].object;
					this.selectedPawn.material.color.set(0xffff00);
				}
			}
		}
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.render);
	};
}
