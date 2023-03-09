"use strict";

/**
 * @type {import("socket.io").Socket}
 */
const socket = io();

// Handle forms
let currentUser = "";
const loginForm = document.getElementById("login");
loginForm.onsubmit = (e) => {
	e.preventDefault();

	currentUser = loginForm.elements[0].value;
	socket.emit("userJoined", currentUser);

	loginForm.classList.add("hidden");
	document.querySelector("main").classList.remove("hidden");

	const message = "<span style='color: #aaa;'>dołączył do czatu</span>";
	addMessage(currentUser, message, "info");
	socket.emit("message", { username: currentUser, message, type: "info" });
};

const messageForm = document.getElementById("message-form");
messageForm.onsubmit = (e) => {
	e.preventDefault();

	const message = messageForm.elements[0].value;
	addMessage(currentUser, message, "message");
	socket.emit("message", { username: currentUser, message, type: "message" });
};

// Get messages from server
const messages = document.getElementById("messages");

socket.emit("getMessages");
socket.on("getMessages", (messages) => {
	messages.forEach((message) => {
		addMessage(message.username, message.message, message.type);
	});
});

// Add message to chat
socket.on("message", ({ username, message, type }) => {
	addMessage(username, message, type);
});
function addMessage(username, message, type) {
	const messageElement = document.createElement("div");

	messages.appendChild(messageElement);
	if (type === "message") {
		messageElement.classList.add("message");
		messageElement.classList.add(username === currentUser ? "right" : "left");
		messageElement.innerHTML = `<b>${username}</b>: ${message}`;
	} else if (type === "info") {
		messageElement.classList.add("info");
		messageElement.innerHTML = `<b>${username}</b> ${message}`;
	}
}
