import asyncHandler from "express-async-handler";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc Stripe Create Checkout Session
// @route POST api/payments/create-checkout-session
// @access Privet
const stripeCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems, userId } = req.body;

  const items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/en/menu`,
    cancel_url: `${process.env.CLIENT_URL}/en/menu`,
  });

  res.send({ url: session.url });
});

export { stripeCheckoutSession };
