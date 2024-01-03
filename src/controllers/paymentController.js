import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
import Customer from "../models/customerModel.js";
import History from "../models/historyModel.js";
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc Stripe Create Checkout Session
// @route POST api/payments/create-checkout-session
// @access Privet
const stripeCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems, tableOrder } = req.body;

  // Generate  ine_items
  const items = cartItems.map((item) => {
    const unitAmount = Math.round(item.price * 100);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: unitAmount,
      },
      quantity: item.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/en/menu`,
    cancel_url: `${process.env.CLIENT_URL}/en/menu`,
    metadata: {
      userId: req.user._id.toString(),
      items: JSON.stringify(cartItems),
      tableOrder: JSON.stringify(tableOrder),
    },
  });

  res.send({ url: session.url });
});

// @desc WebHookCheckout
// @route POST api/payments/webhook
// @access Privet
const webHookCheckout = asyncHandler(async (request, response) => {
  try {
    const sig = request.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      //Get session event data
      const session = event.data.object;

      const tableOrder = JSON.parse(session.metadata.tableOrder);

      //Add new customer
      const customer = await Customer.create({
        name: tableOrder.customer.fullname,
        email: tableOrder.customer.email,
        phone: tableOrder.customer.phone,
      });

      //Add new order
      const userId = session.metadata.userId;
      const customerId = customer?._id;
      const items = JSON.parse(session.metadata.items);

      const amountPaid = session.amount_total / 100;
      const payment_status = session.payment_status;

      const order = await Order.create({
        userId,
        customerId,
        orderId: tableOrder.number,
        table_order: {
          guests: tableOrder.guests,
          tables: tableOrder.tables,
        },
        items,
        amountPaid,
        payment_status,
      });

      //History for pass new order
      await History.create({
        action: "Pass order",
        description: `Pass order #${order.orderId}`,
        user: userId,
      });

      response
        .status(201)
        .json({ message: "You're successfully paid for this order" });
    }
  } catch (err) {
    console.log("Webhook error", err.message);
  }
});

export { stripeCheckoutSession, webHookCheckout };
