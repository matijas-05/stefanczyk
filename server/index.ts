import express from "express";
import cors from "cors";
import formidable from "formidable";
import fs from "node:fs/promises";
import path from "node:path";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/image", async (_, res) => {
    const files = await fs.readdir("./uploads/", { withFileTypes: true });
    const images = files
        .filter((file) => file.name.endsWith(".jpg"))
        .map((file) => ({
            name: file.name,
        }));

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

app.listen(3000, () => console.log("Listening on port 3000..."));
