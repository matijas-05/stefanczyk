const express = require("express");
const hbs = require("express-handlebars");
const fs = require("fs");
const nodePath = require("path");
const formidable = require("formidable");
const Path = require("./path");

const app = express();
const fmPath = new Path(__dirname);

app.set("views", nodePath.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");
app.use(express.static("static"));

app.get("/", (req, res) => {
	const folder = req.query.folder;
	if (folder) fmPath.cdInto(folder);

	res.req.query.projectPath = fmPath.getProjectPath();
	res.render("filemanager.hbs", { ...getFiles(fmPath) });
});
app.get("/fileEditor", (req, res) => {
	const file = req.query.file;
	console.log(nodePath.join(fmPath.getCurrentPath(), file));
	res.render("fileEditor.hbs", {
		content: fs.readFileSync(nodePath.join(fmPath.getCurrentPath(), file)),
		path: "/" + fmPath.getProjectPath() + "/" + file,
	});
});

app.post("/upload", (req, res) => {
	const form = formidable({
		multiples: true,
		uploadDir: __dirname + "/pliki/",
		keepExtensions: true,
	});

	form.on("fileBegin", (_, file) => {
		file.filepath = nodePath.join(
			__dirname + "/pliki/" + fmPath.getProjectPath(),
			file.originalFilename
		);
	});
	form.parse(req);

	// res.render("filemanager.hbs", { ...getFiles() });
	res.redirect("/");
});

app.get("/newFolder", (req, res) => {
	const name = req.query.name;
	fs.mkdirSync(`${fmPath.getFullPath()}/${name}`, { recursive: true });

	res.render("filemanager.hbs", { ...getFiles(fmPath) });
	res.redirect("/");
});
app.get("/deleteFolder", (req, res) => {
	const name = req.query.name;
	fs.rmdirSync(`${fmPath.getFullPath()}/${name}`, { recursive: true });

	res.render("filemanager.hbs", { ...getFiles(fmPath) });
	res.redirect("/");
});

app.get("/newFile", (req, res) => {
	const name = req.query.name;
	const ext = nodePath.extname(name);
	const filename = `config/templates/${ext.replace(".", "")}${ext}`;

	const data = fs.readFileSync(nodePath.join(__dirname, filename));
	fs.writeFileSync(`${fmPath.getFullPath()}/${name}`, data);

	res.render("filemanager.hbs", { ...getFiles(fmPath) });
	res.redirect("/");
});
app.get("/deleteFile", (req, res) => {
	const name = req.query.name;
	fs.rmSync(`${fmPath.getFullPath()}/${name}`, { force: true });

	res.render("filemanager.hbs", { ...getFiles(fmPath) });
	res.redirect("/");
});

app.get("/rename", (req, res) => {
	const name = req.query.name;
	const newName = req.query.newName;

	console.log(name, newName);
	fs.renameSync(`${fmPath.getFullPath()}/${name}`, `${fmPath.getFullPath()}/${newName}`);
	res.render("filemanager.hbs", { ...getFiles(fmPath) });
	res.redirect("/");
});

app.get("/path", (req, res) => {
	if (req.query.folder) fmPath.cdInto(req.query.folder);
	else if (req.query.fullPath) {
		const newPath = req.query.fullPath.split("/");
		newPath.shift();
		newPath[0] = `/${newPath[0]}`;

		fmPath.path = newPath;
	}

	res.redirect("/");
});

app.listen(3000, () => console.log("Uruchomiono serwer na porcie 3000"));

/**
 *
 * @param {Path} path
 */
function getFiles(path) {
	const fullPath = path.getFullPath();

	const folders = fs
		.readdirSync(fullPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const names = fs
		.readdirSync(fullPath, { withFileTypes: true })
		.filter((dirent) => dirent.isFile())
		.map((dirent) => dirent.name);

	const files = names.map((name) => {
		return {
			name: name,
			icon: getFileIcon(nodePath.extname(name)),
		};
	});

	return { folders, files, path: path.getPathSegments() };

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
