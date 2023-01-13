const express = require("express");
const hbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");
app.use(express.static("static"));

app.get("/", (req, res) => {
	res.render("filemanager.hbs", { ...getFiles() });
});

app.post("/upload", (req, res) => {
	const form = formidable({
		multiples: true,
		uploadDir: __dirname + "/pliki/",
		keepExtensions: true
	});

	form.on("fileBegin", (_, file) => {
		file.filepath = path.join(__dirname + "/pliki/", file.originalFilename);
	});
	form.parse(req, () => {});

	res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});

app.get("/newFolder", (req, res) => {
	const name = req.query.name;
	fs.mkdirSync(`./pliki/${name}`, { recursive: true });

	res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});
app.get("/deleteFolder", (req, res) => {
	const name = req.query.name;
	fs.rmdirSync(`./pliki/${name}`, { recursive: true });

	res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});

app.get("/newFile", (req, res) => {
	const name = req.query.name;
	fs.writeFileSync(`./pliki/${name}.txt`, "");

	res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});
app.get("/deleteFile", (req, res) => {
	const name = req.query.name;
	fs.rmSync(`./pliki/${name}`, { force: true });

	res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});

app.listen(3000, () => console.log("Uruchomiono serwer na porcie 3000"));

function getFiles() {
	const folders = fs
		.readdirSync("./pliki", { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	const names = fs
		.readdirSync("./pliki", { withFileTypes: true })
		.filter(dirent => dirent.isFile())
		.map(dirent => dirent.name);

	const files = names.map(name => {
		return {
			name: name,
			icon: getFileIcon(path.extname(name))
		};
	});

	return { folders, files };

	function getFileIcon(name) {
		switch (name) {
			case ".txt":
				return "txt";
			case ".png":
				return "png";
			case ".jpg":
			case ".jpeg":
				return "jpg";
			case ".ico":
				return "ico";
			default:
				return "other";
		}
	}
}
