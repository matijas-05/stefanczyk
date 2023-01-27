const express = require("express");

const app = express();
app.use(express.static("static"));
app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/static/index.html");
});

app.listen(3000, () => console.log("Działa na porcie 3000"));
