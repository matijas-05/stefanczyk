export class Ui {
	constructor() {
		this.loginForm = document.getElementById("login");
		this.root = document.getElementById("root");
		this.waitForPlayer = document.getElementById("wait-for-player");
		this.info = document.getElementById("info");
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

	logMessage = (message) => {
		if (this.info.innerText === "STATUS") this.info.innerHTML = "";
		this.info.innerText += `${message}\n`;
	};
}
