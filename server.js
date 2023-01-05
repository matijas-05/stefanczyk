const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine(
	"hbs",
	hbs({ extname: ".hbs", defaultLayout: "main.hbs", partialsDir: "views/partials" })
);
app.set("view engine", "hbs");
app.use(express.static("static"));

app.get("/", (req, res) => {
	res.render("filemanager.hbs");
});

app.listen(3000, () => console.log("Uruchomiono serwer na porcie 3000"));
