const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔥 SERVIR HTML e CSS (OPÇÃO 1)
app.use(express.static(path.join(__dirname)));

// banco de dados
const db = new sqlite3.Database("./database.db");

// criar tabela
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

// usuário de teste
db.run(`
    INSERT OR IGNORE INTO usuarios (username, password)
    VALUES ('admin', '123456')
`);

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

// iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});