const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const nodePath = require("path");
const formidable = require("formidable");
const nocache = require("nocache");
const Path = require("./path");

const app = express();
const fmPath = new Path(__dirname);
const effects = [{ name: "grayscale" }, { name: "invert" }, { name: "sepia" }, { name: "none" }];

const jsonParser = bodyParser.json();
const octetParser = bodyParser.raw({ type: "application/octet-stream", limit: "50mb" });
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set("views", nodePath.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");
app.use(express.static("static"));
app.use(express.static("pliki"));
app.use(cookieParser());
app.use(nocache());

app.get("/login", (req, res) => {
	res.render("login.hbs", { error: req.query.error });
});
app.post("/login", urlencodedParser, (req, res) => {
	/**
	 * @type {Array<{username: string, password: string}>}
	 */
	const users = JSON.parse(fs.readFileSync("./config/users.json"));

	const user = users.find(
		(user) => user.username === req.body.username && user.password === req.body.password
	);

	if (user) {
		res.cookie("user", user.username, {
			expires: new Date(Date.now() + 60 * 1000),
			httpOnly: true,
		});
		res.redirect("/");
	} else {
		res.redirect("/login?error=" + encodeURIComponent("Niepoprawne dane!"));
	}
});

app.get("/register", (req, res) => {
	res.render("register.hbs", { error: req.query.error });
});
app.post("/register", urlencodedParser, (req, res) => {
	/**
	 * @type {Array<{username: string, password: string}>}
	 */
	const users = JSON.parse(fs.readFileSync("./config/users.json"));
	const user = users.find((user) => user.username === req.body.username);

	if (user) {
		res.redirect(
			"/register?error=" + encodeURIComponent("Użytkownik o takiej nazwie już istnieje!")
		);
	} else if (req.body.password !== req.body.repeatPassword) {
		res.redirect("/register?error=" + encodeURIComponent("Hasła nie są takie same!"));
	} else {
		users.push({ username: req.body.username, password: req.body.password });
		fs.writeFileSync("./config/users.json", JSON.stringify(users, null, 2));

		res.redirect("/login");
	}
});

app.get("/logout", (req, res) => {
	res.clearCookie("user");
	res.redirect("/login");
});

app.get("/*", (req, res, next) => {
	if (!req.cookies.user) {
		res.redirect("/login");
		return;
	}
	next();
});

app.get("/", (req, res) => {
	const folder = req.query.folder;
	if (folder) fmPath.cdInto(folder);

	res.req.query.projectPath = fmPath.getProjectPath();
	res.render("filemanager.hbs", { ...getFiles(fmPath), username: req.cookies.user });
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
		username: req.cookies.user,
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
	fs.writeFileSync(nodePath.join(fmPath.getBasePath(), req.body.path), req.body.content);
	res.sendStatus(201);
});

app.get("/imageeditor", (req, res) => {
	const file = req.query.file;

	res.render("imageeditor.hbs", {
		path: fmPath.getProjectPath() + "/" + file,
		effects,
		username: req.cookies.user,
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
