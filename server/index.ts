import express from "express";
import formidable from "formidable";

const app = express();

app.post("/upload", (req, res) => {
    const form = formidable({ multiples: true, uploadDir: "./uploads/", keepExtensions: true });
    form.parse(req, (err) => {
        if (err) {
            res.sendStatus(500);
        }
        res.sendStatus(201);
    });
});

app.listen(3000, () => console.log("Listening on port 3000..."));
