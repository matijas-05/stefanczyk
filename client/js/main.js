"use strict";
const loginForm = document.getElementById("login");
loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = loginForm.elements[0].value;
    console.log(username);
};
