import express from "express";
import path from "path";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cursos cadastrados (30 cursos)
const courses = [ /* seus cursos aqui */ ];

// Servir frontend da pasta "frontend"
app.use(express.static(path.join(process.cwd(), "frontend")));

// Rota principal abre cursos.html
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend/curso.html")); // confirme o nome
});

// Criar sessão de pagamento
app.post("/create-checkout-session", async (req, res) => {
  const { courseId, userEmail } = req.body;
  const course = courses.find(c => c.id === courseId);
  if (!course) return res.json({ error: "Curso não encontrado" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: course.title },
          unit_amount: course.price * 100
        },
        quantity: 1
      }
    ],
    success_url: "https://vigilant-invention-mh9t.onrender.com/sucesso.html",
    cancel_url: "https://vigilant-invention-mh9t.onrender.com/cancelado.html",
  });

  res.json({ url: session.url });
});

// Porta dinâmica do Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));