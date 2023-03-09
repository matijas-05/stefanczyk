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

	// Get messages from server
	socket.emit("getMessages");
	socket.on("getMessages", (messages) => {
		messages.forEach((message) => {
			addMessage(message.username, message.message, message.type, message.time);
		});
	});
};

const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
messageForm.onsubmit = (e) => {
	e.preventDefault();

	const message = messageForm.elements[0].value;
	socket.emit("message", {
		username: currentUser,
		message,
		type: "message",
		time: new Date().toLocaleTimeString("pl-PL"),
	});
};

// Add message to chat
socket.on("message", ({ username, message, type, time }) => {
	addMessage(username, message, type, time);
});
function addMessage(username, message, type, time) {
	const messageElement = document.createElement("div");

	messages.appendChild(messageElement);
	if (type === "message") {
		messageElement.classList.add("message");
		messageElement.classList.add(username === currentUser ? "right" : "left");
		messageElement.innerHTML = `<span style='font-size: 1.1rem;'>${time}</span><br><b>${username}</b>: ${message}`;
	} else if (type === "info") {
		messageElement.classList.add("info");
		messageElement.innerHTML = `<b>${username}</b> ${message} | ${time}`;
	}
}
