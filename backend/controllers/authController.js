const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // conexão sqlite

module.exports = {

    async register(req, res) {
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hash],
            (err) => {
                if (err) return res.json({ error: "Usuário já existe" });

                res.json({ message: "Usuário registrado" });
            }
        );
    },

    async login(req, res) {
        const { email, password } = req.body;

        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
            if (!user) return res.json({ error: "Usuário não encontrado" });

            const ok = await bcrypt.compare(password, user.password);
            if (!ok) return res.json({ error: "Senha incorreta" });

            const token = jwt.sign({ id: user.id }, "segredo123", { expiresIn: "7d" });

            res.json({ message: "Login ok", token });
        });
    }
};
