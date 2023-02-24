export class Ui {
	constructor() {
		this.loginForm = document.getElementById("login");
	}

	showError = (message) => {
		document.getElementById("root").classList.add("disabled");
		this.loginForm.innerHTML = message;
	};
}
