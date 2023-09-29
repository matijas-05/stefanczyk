import express from "express";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

interface User {
    login: string;
    password: string;
    date: string;
}
const users: User[] = [];

app.post("/register", (req, res) => {
    const login = req.body.login as string;
    const password = req.body.password as string;

    if (!login || !password) {
        res.sendStatus(400);
    } else if (users.find((user) => user.login === login)) {
        res.sendStatus(409);
        return;
    } else {
        users.push({ login, password, date: new Date().toString() });
        res.sendStatus(201);
    }
});

app.get("/users", (_, res) => {
    res.send(users);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
