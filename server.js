const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// banco
const db = new sqlite3.Database("./database.db");

// criar tabela
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

// rota cadastro
app.post("/register", (req, res) => {
    console.log("BODY:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Preencha todos os campos");
    }

    db.run(
        "INSERT INTO usuarios (username, password) VALUES (?, ?)",
        [username, password],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).send("Usuário já existe");
                }
                return res.status(500).send("Erro no servidor");
            }

            res.send("Usuário cadastrado com sucesso!");
        }
    );
});

// rota login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE username = ? AND password = ?",
        [username, password],
        (err, row) => {
            if (err) {
                return res.status(500).send("Erro no servidor");
            }

            if (row) {
                res.send("Login bem-sucedido!");
            } else {
                res.send("Usuário ou senha incorretos");
            }
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});