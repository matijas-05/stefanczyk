const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodePath = require("path");
const formidable = require("formidable");
const Path = require("./path");

const app = express();
const fmPath = new Path(__dirname);
const effects = [{ name: "grayscale" }, { name: "invert" }, { name: "sepia" }, { name: "none" }];

const jsonParser = bodyParser.json();
const octetParser = bodyParser.raw({ type: "application/octet-stream", limit: "50mb" });

app.set("views", nodePath.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");
app.use(express.static("static"));
app.use(express.static("pliki"));

app.get("/", (req, res) => {
	const folder = req.query.folder;
	if (folder) fmPath.cdInto(folder);

	res.req.query.projectPath = fmPath.getProjectPath();
	res.render("filemanager.hbs", { ...getFiles(fmPath) });
});

app.get("/open", (req, res) => {
	const file = req.query.file;
	const ext = nodePath.extname(file);

	if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
		res.redirect("/imageeditor?file=" + file);
	} else {
		res.redirect("/texteditor?file=" + file);
	}
});

app.get("/texteditor", (req, res) => {
	const file = req.query.file;

	res.render("texteditor.hbs", {
		content: fs.readFileSync(nodePath.join(fmPath.getCurrentPath(), file)),
		path: fmPath.getProjectPath() + "/" + file,
	});
});
app.get("/texteditor/settings", (req, res) => {
	const settings = JSON.parse(fs.readFileSync("./config/settings.json"));

	res.send(settings);
});
app.post("/texteditor/settings", jsonParser, (req, res) => {
	const data = {
		textEditor: {
			fontSize: req.body.fontSize,
			color: req.body.color,
		},
	};
	const json = JSON.stringify(data, null, 2);

	fs.writeFileSync("./config/settings.json", json);

	res.sendStatus(201);
});
app.post("/texteditor/saveFile", jsonParser, (req, res) => {
	fs.writeFileSync(nodePath.join(fmPath.getCurrentPath(), req.body.path), req.body.content);
	res.sendStatus(201);
});

app.get("/imageeditor", (req, res) => {
	const file = req.query.file;

	res.render("imageeditor.hbs", {
		path: fmPath.getProjectPath() + "/" + file,
		effects,
	});
});
app.post("/imageeditor/saveFile", octetParser, (req, res) => {
	const name = nodePath.basename(req.query.name).split(".")[0];
	const ext = nodePath.extname(req.query.name).split(".")[1];

	fs.writeFileSync(
		nodePath.join(__dirname, "pliki", fmPath.getProjectPath(), `${name}.${ext}`),
		req.body
	);
	res.sendStatus(201);
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
	fs.renameSync(
		`${fmPath.getFullPath()}/${nodePath.basename(name)}`,
		`${fmPath.getFullPath()}/${newName}`
	);

	if (req.query.textEditor !== "true") {
		res.render("filemanager.hbs", { ...getFiles(fmPath) });
		res.redirect("/");
	} else {
		res.redirect("/open?file=" + newName);
	}
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
