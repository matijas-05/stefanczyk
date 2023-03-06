import { Game } from "./Game.js";
import { Ui } from "./Ui.js";

export class Net {
	/**
	 * @param {Game} game
	 * @param {Ui} ui
	 */
	constructor(game, ui, client) {
		/**
		 * @type {Game}
		 */
		this.game = game;
		/**
		 * @type {Ui}
		 */
		this.ui = ui;
		this.client = client;

		this.client.on("waitForPlayer", (data) => {
			this.ui.showLoading();

			if (data.lastJoinedUsername !== this.username) {
				this.ui.logMessage(`${data.lastJoinedUsername} dołączył do gry`);
			}
		});
		this.client.on("start", () => {
			this.ui.removeLoading();
			this.game.start(this.color);
		});
		this.client.on("beginRound", (color) => {
			this.ui.logMessage(`Runda ${color === "white" ? "białych" : "czarnych"}`);
			this.game.beginRound(color);
		});

		this.canJoin().then((canJoin) => {
			if (canJoin === "false") {
				this.ui.loginForm.classList.remove("removed");
				this.ui.showError("Gra jest pełna");
			} else {
				this.ui.loginForm.classList.remove("removed");
			}
		});
		this.login();
	}

	canJoin = async () => {
		const res = await fetch("http://localhost:3000/canJoin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await res.text();
	};
	login = async () => {
		this.ui.loginForm.onsubmit = async (e) => {
			e.preventDefault();
			this.username = e.target.username.value;

			const res = await fetch("http://localhost:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: this.username }),
			});

			if (res.ok) {
				this.ui.root.classList.remove("disabled");
				this.ui.loginForm.classList.add("removed");

				const { color } = await res.json();
				this.color = color;
				this.ui.logMessage(
					`Witaj ${this.username}, grasz ${color === "white" ? "białymi" : "czarnymi"}`
				);

				this.client.emit("waitForPlayer", this.username);
			} else {
				const { error } = await res.json();

				if (res.status === 400 && error === "username") {
					this.ui.showError("Nazwa użytkownika jest zajęta");
				} else {
					this.ui.showError("Nie udało się zalogować. Nieznany błąd");
				}
			}
		};
	};

	endRound = (color) => {
		console.log("endRound");
		this.client.emit("endRound", color);
		this.client.emit("beginRound", color === "white" ? "black" : "white");
	};

	/**
	 *
	 * @param {number[]} board
	 */
	updateBoard = (board) => {
		this.client.emit("updateBoard", board);
	};
}
