import { Net } from "./Net.js";
import { Pawn } from "./Pawn.js";
import { Tile } from "./Tile.js";

export class Game {
	constructor() {
		/**
		 * 1 - white,
		 * 0 - black
		 */
		this.checkerboardColors = [
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
		 *
		 * top left is 0, 0;
		 * difference is 100;
		 * z increases when going down;
		 * x increases when going right
		 *
		 * @type {number[][]}
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

		this.topLeftCoords = new THREE.Vector3(0, 0, 0);
		this.tileDifference = new THREE.Vector3(100, 0, 100);

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
		this.drawPawns(this.pawns);
	}

	drawCheckerboard = () => {
		for (let y = 0; y < this.checkerboardColors.length; y++) {
			for (let x = 0; x < this.checkerboardColors[y].length; x++) {
				this.scene.add(new Tile(x, y, this.checkerboardColors[x][y] === 1));
			}
		}
	};
	drawPawns = (board) => {
		if (!board) return;
		this.pawns = board;

		// remove all pawns
		this.scene.children = this.scene.children.filter((object) => {
			if (object instanceof Pawn) {
				this.scene.remove(object);
				return false;
			}
			return true;
		});

		for (let y = 0; y < this.pawns.length; y++) {
			for (let x = 0; x < this.pawns[y].length; x++) {
				const pawn = this.pawns[y][x];
				if (pawn === 0) continue;

				new Pawn(this.scene, pawn === 2 ? "white" : "black", x, y);
			}
		}
	};

	beginRound = (color) => {
		this.canMove = this.color === color;
	};
	endRound = (color) => {
		this.net.endRound(color ?? this.color);
		this.canMove = false;
	};

	movePawn = (object) => {
		const prevPosition = this.selectedPawn.position.clone().divideScalar(100);
		this.selectedPawn.position.set(object.position.x, 50, object.position.z);
		const newPosition = this.selectedPawn.position.clone().divideScalar(100);

		const posDiff = {
			x: newPosition.x - prevPosition.x,
			z: newPosition.z - prevPosition.z,
		};
		this.pawns[prevPosition.z][prevPosition.x] = 0;
		this.pawns[prevPosition.z + posDiff.z][prevPosition.x + posDiff.x] =
			this.color === "white" ? 2 : 1;

		this.net.updateBoard(this.pawns);
	};

	start = (color) => {
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
					this.movePawn(intersects[0].object);

					this.endRound();

					this.selectedPawn.material.color.set(Pawn.getColorByName(this.color));
					this.selectedPawn = null;
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
