import asyncHandler from "express-async-handler";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc Stripe Checkout Session
// @route GET api/history
// @access Privet
const stripeCheckoutSession = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: room.title,
        images: [
          `${
            room.photos.length >= 1
              ? room.photos[0].url
              : "https://res.cloudinary.com/abdelmonaime/image/upload/v1657917445/reservation_app/card-placeholder_grgdsv.png"
          }`,
        ],
        amount: req.query.amount * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/en/menu`,
    cancel_url: `${process.env.CLIENT_URL}/en/menu`,
  });

  res.send({ url: session.url });
});

export { stripeCheckoutSession };
