from flask import Flask, render_template, request

app = Flask(__name__)

usuarios = {
    "admin": "123",
    "davi": "senha123"
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    if username in usuarios and usuarios[username] == password:
        return "Login OK ✅"
    else:
        return "Usuário ou senha inválidos ❌"

app.run(host="0.0.0.0", port=5000)