import { Game } from "./Game.js";
import { Net } from "./Net.js";
import { Ui } from "./Ui.js";

let game;
let net;
let ui;

window.onload = () => {
	ui = new Ui();
	game = new Game();
	net = new Net(game.start, ui);
};
