export class Ui {
	constructor() {
		this.loginForm = document.getElementById("login");
		this.root = document.getElementById("root");
		this.waitForPlayer = document.getElementById("wait-for-player");
		this.waitForMove = document.getElementById("wait-for-move");
		this.timeLeft = document.getElementById("time-left");
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

	showWaitingForMove = () => {
		this.root.classList.add("disabled");
		this.waitForMove.classList.remove("removed");
	};
	removeWaitingForMove = () => {
		this.root.classList.remove("disabled");
		this.waitForMove.classList.add("removed");
	};
	updateTimeLeft = (timeLeft) => {
		this.timeLeft.innerText = timeLeft;
	};

	logMessage = (message) => {
		if (this.info.innerText === "STATUS") this.info.innerHTML = "";
		this.info.innerText += `${message}\n`;
		this.info.scrollTo({ top: this.info.scrollHeight });
	};
}
