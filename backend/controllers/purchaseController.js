require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.SECRET_KEY);

module.exports = {

    async buyCourse(req, res) {
        const { courseId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "brl",
                    product_data: { name: `Curso ${courseId}` },
                    unit_amount: 2900 // R$ 29,00
                },
                quantity: 1
            }],
            success_url: "http://localhost:5500/sucesso.html",
            cancel_url: "http://localhost:5500/cancelado.html",
        });

        res.json({ url: session.url });
    }
};
