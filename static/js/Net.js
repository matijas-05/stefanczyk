import { Ui } from "./Ui.js";

export class Net {
	/**
	 *
	 * @param {any} startGame
	 * @param {Ui} ui
	 */
	constructor(startGame, ui, client) {
		this.ui = ui;
		this.client = client;

		client.on("waitForPlayer", (lobbyFull) => {
			if (!lobbyFull && this.ui.loginForm.classList.contains("removed")) {
				ui.showLoading();
			}
			if (lobbyFull) {
				ui.removeLoading();
				startGame(this.color);
			}
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

	async canJoin() {
		const res = await fetch("http://localhost:3000/canJoin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await res.text();
	}
	async login() {
		this.ui.loginForm.onsubmit = async (e) => {
			e.preventDefault();
			const username = e.target.username.value;

			const res = await fetch("http://localhost:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username }),
			});

			if (res.ok) {
				console.log("Zalogowano");
				const root = document.getElementById("root");
				root.classList.remove("disabled");
				this.ui.loginForm.classList.add("removed");

				const { color } = await res.json();
				this.color = color;

				this.client.emit("waitForPlayer");
			} else {
				const { error } = await res.json();

				if (res.status === 400 && error === "username") {
					this.ui.showError("Nazwa użytkownika jest zajęta");
				} else {
					this.ui.showError("Nie udało się zalogować. Nieznany błąd");
				}
			}
		};
	}
}
