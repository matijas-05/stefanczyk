export class Ui {
	constructor() {
		this.loginForm = document.getElementById("login");
		this.root = document.getElementById("root");
		this.waitForPlayer = document.getElementById("wait-for-player");
	}

	showError = (message) => {
		this.root.classList.add("disabled");
		this.loginForm.innerHTML = message;
	};

	showLoading = () => {
		this.waitForPlayer.classList.remove("removed");
	};
	removeLoading = () => {
		this.waitForPlayer.classList.add("removed");
	};
}
