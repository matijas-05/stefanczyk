export class Net {
	constructor(startGame) {
		this.loginForm = document.getElementById("login");

		this.canJoin().then((canJoin) => {
			if (canJoin === "false") {
				this.loginForm.classList.remove("removed");
				this.showError("Gra jest pełna");
			} else {
				this.loginForm.classList.remove("removed");
			}
		});
		this.login(startGame);
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
	async login(startGame) {
		this.loginForm.onsubmit = async (e) => {
			e.preventDefault();
			const username = document.getElementById("username").value;

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
				this.loginForm.remove();

				const { color } = await res.json();

				startGame(color);
			} else {
				const { error } = await res.json();

				if (res.status === 400 && error === "username") {
					this.showError("Nazwa użytkownika jest zajęta");
				} else {
					this.showError("Nie udało się zalogować. Nieznany błąd");
				}
			}
		};
	}

	showError(message) {
		document.getElementById("root").classList.add("disabled");
		document.getElementById("login").innerHTML = message;
	}
}
