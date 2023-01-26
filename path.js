const nodePath = require("path");

module.exports = class Path {
	/**
	 *
	 * @param {string} currentDir
	 */
	constructor(currentDir) {
		const currentDirSplit = currentDir.split("/");
		currentDirSplit.shift();
		currentDirSplit[0] = `/${currentDirSplit[0]}`;

		/**
		 * @type {string[]}
		 */
		this.basePath = [...currentDirSplit, "pliki"];

		/**
		 * @type {string[]}
		 */
		this.path = Array.from(this.basePath);
	}

	getFullPath() {
		return nodePath.join(...this.path);
	}
	getPathSegments() {
		const root = {
			name: "root",
			path: this.basePath.join("/"),
		};
		const rest = this.path.slice(this.basePath.length).map((segment) => ({
			name: segment,
			path: this.path.slice(0, this.path.indexOf(segment) + 1).join("/"),
		}));

		return [root, ...rest];
	}

	/**
	 *
	 * @param {string} name
	 */
	cdInto(name) {
		this.path.push(name);
	}
	cdOut() {
		this.path.pop();
	}
};
