import express from "express";
import path from "path";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// CORS (aceita requisições do frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"  // opcional: restringir para seu frontend
}));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cursos cadastrados
const courses = [
  { id: 1, title: "JavaScript Moderno", price: 129 },
  { id: 2, title: "Python Iniciante", price: 99 },
  { id: 3, title: "React Completo", price: 199 },
  { id: 4, title: "HTML + CSS Zero ao Pro", price: 89 },
  { id: 5, title: "Node.js API", price: 149 },
  { id: 6, title: "MySQL Básico", price: 79 },
  { id: 7, title: "MongoDB Completo", price: 169 },
  { id: 8, title: "Docker para Iniciantes", price: 129 },
  { id: 9, title: "Git & GitHub", price: 49 },
  { id: 10, title: "C# Essencial", price: 139 },
  { id: 11, title: "Java Completo", price: 199 },
  { id: 12, title: "PHP do Zero", price: 89 },
  { id: 13, title: "GameDev com Unity", price: 199 },
  { id: 14, title: "Flask Python", price: 149 },
  { id: 15, title: "Django Completo", price: 189 },
  { id: 16, title: "Kotlin Android", price: 199 },
  { id: 17, title: "Linux Essencial", price: 69 },
  { id: 18, title: "Redes de Computadores", price: 109 },
  { id: 19, title: "Segurança Digital", price: 149 },
  { id: 20, title: "Criação de APIs", price: 129 },
  { id: 21, title: "Machine Learning", price: 249 },
  { id: 22, title: "IA para Iniciantes", price: 159 },
  { id: 23, title: "Excel PRO", price: 139 },
  { id: 24, title: "Power BI Completo", price: 189 },
  { id: 25, title: "Figma Design", price: 99 },
  { id: 26, title: "UX/UI Completo", price: 169 },
  { id: 27, title: "Criar Sites Profissionais", price: 139 },
  { id: 28, title: "Firebase Completo", price: 159 },
  { id: 29, title: "Arquitetura de Software", price: 199 },
  { id: 30, title: "SCRUM e Agile", price: 119 }
];

// Servir frontend
app.use(express.static(path.join(process.cwd(), "frontend")));

// Rota principal abre curso.html
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/curso.html"));
});

// Criar sessão de pagamento
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;
    const course = courses.find(c => c.id === courseId);
    if (!course) return res.status(400).json({ error: "Curso não encontrado" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: "brl",
          product_data: { name: course.title },
          unit_amount: course.price * 100
        },
        quantity: 1
      }],
      success_url: "https://vigilant-invention-mh9t.onrender.com/sucesso.html",
      cancel_url: "https://vigilant-invention-mh9t.onrender.com/cancelado.html",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Erro Stripe:", err);
    res.status(500).json({ error: "Falha ao iniciar pagamento", details: err.message });
  }
});

// Porta dinâmica do Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
