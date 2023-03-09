const loginForm = document.getElementById("login") as HTMLFormElement;
loginForm.onsubmit = (e) => {
	e.preventDefault();

	const username = (loginForm.elements[0] as HTMLInputElement).value;
	console.log(username);
};
