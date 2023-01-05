const express = require("express");
const app = express();
const PORT = 3000;
const hbs = require("express-handlebars");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");

const db = readDB() ?? [];

app.set("views", path.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");

app.use(express.static("static"));

app.post("/", (req, res) => {
	const form = formidable({});
	form.keepExtensions = true;
	form.uploadDir = __dirname + "/upload/";
	form.multiples = true;
	form.parse(req, (err, fields, files) => {
		if (files.upload.length) {
			for (const file of files.upload) {
				const maxId = db.length > 0 ? Math.max(...db.map(file => file.id)) : 0;
				db.push({
					id: maxId + 1,
					extension: getImageForExtension(file.name),
					...file
				});
			}
		} else {
			const maxId = db.length > 0 ? Math.max(...db.map(file => file.id)) : 0;
			db.push({
				id: maxId + 1,
				extension: getImageForExtension(files.upload.name),
				...files.upload
			});
		}
		writeDB();

		res.redirect("/filemanager");

		function getImageForExtension(fileName) {
			const extension = path.extname(fileName).slice(1).toLowerCase();
			switch (extension) {
				case "jpg":
				case "png":
				case "txt":
					return extension + ".png";
				default:
					return "unknown.png";
			}
		}
	});
});
app.get("/", (req, res) => {
	res.render("upload.hbs");
});

app.get("/filemanager", (req, res) => {
	res.render("filemanager.hbs", { db });
});

app.get("/show", (req, res) => {
	const path = db.filter(file => file.id === parseInt(req.query.id))[0].path;
	res.sendFile(path);
});

app.get("/info", (req, res) => {
	const file = db.filter(file => file.id === parseInt(req.query.id))[0];
	res.render("info.hbs", { file });
});

app.get("/delete", (req, res) => {
	const id = parseInt(req.query.id);
	const index = db.indexOf(db.filter(file => file.id === id)[0]);
	db.splice(index, 1);
	writeDB();
	res.render("filemanager.hbs", { db });
	res.redirect("/filemanager");
});

app.get("/download", (req, res) => {
	const path = db.filter(file => file.id === parseInt(req.query.id))[0].path;
	res.download(path);
});

app.get("/reset", (req, res) => {
	db.length = 0;
	writeDB();
	res.render("filemanager.hbs", { db });
	res.redirect("/filemanager");
});

app.listen(PORT, () => {
	console.log("start serwera na porcie " + PORT);
});

function writeDB() {
	fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}
function readDB() {
	if (fs.existsSync("db.json")) return JSON.parse(fs.readFileSync("db.json"));
}
