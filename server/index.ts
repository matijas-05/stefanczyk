import express from "express";
import formidable from "formidable";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "node:fs/promises";
import path from "node:path";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.get("/image", async (_, res) => {
    const files = await fs.readdir("./uploads/", { withFileTypes: true });
    const images = files
        .filter((file) => file.name.endsWith(".jpg"))
        .map((file) => file.name)
        .sort((a, b) => a.localeCompare(b));

    res.send(JSON.stringify(images));
});
app.get("/image/:filename", async (req, res) => {
    res.sendFile(path.resolve(`./uploads/${req.params.filename}`));
});

app.post("/image", (req, res) => {
    const form = formidable({ multiples: true, uploadDir: "./uploads/", keepExtensions: true });
    form.parse(req, (err) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
        }
        res.sendStatus(201);
    });
});

app.delete("/image/:filename", async (req, res) => {
    await fs.rm(`./uploads/${req.params.filename}`);
    res.sendStatus(200);
});

app.patch("/image/:filename", async (req, res) => {
    if (await fs.exists(`./uploads/${req.body.newName}`)) {
        res.sendStatus(409);
        return;
    }
    await fs.rename(`./uploads/${req.params.filename}`, `./uploads/${req.body.newName}`);
    res.sendStatus(200);
});

app.listen(3000, () => console.log("Listening on port 3000..."));
