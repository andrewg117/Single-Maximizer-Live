const e = require("express");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.SK_TEST);
const User = require("../models/userModel");
const Purchase = require("../models/purchaseModel");

const YOUR_DOMAIN = "http://localhost:3000/";

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.SK_ENDPOINT;

// @desc    Post purchase
// @route   POST /api/purchase
// @access  Private
const postPayment = asyncHandler(async (req, res) => {
  // Create Stripe Customer
  let userStripeID;
  let customerData;
  if (req.user.stripeID) {
    userStripeID = req.user.stripeID;
  } else {
    customerData = await stripe.customers.create({
      email: req.user.email,
      name: `${req.user.fname} ${req.user.lname}`,
      metadata: { userID: req.user._id.toString() },
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { stripeID: customerData.id },
      },
      {
        new: true,
      }
    );
  }

  // Create Stripe Session Link
  const session = await stripe.checkout.sessions.create({
    customer: userStripeID ? userStripeID : customerData.id,
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1NNh7rFOk6NyPVsVGSoBA4pY",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}profile/singles?success=true`,
    cancel_url: `${YOUR_DOMAIN}profile/checkoutpage?canceled=true`,
    client_reference_id: req.user.id.toString(),
  });

  res.json(session.url);
});

// @desc    Post demo purchase
// @route   POST /api/purchase
// @access  Private
const postDemoPayment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update User's trackAllowance after purchase is complete
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: { trackAllowance: 1 },
      },
      {
        new: true,
      }
    );

    res.status(200).json("Purchase Made");
  } else {
    res.status(401);
  }
});

// @desc    Post endpoint
// @route   POST /api/webhook
// @access  Public
// Test Card 4242 4242 4242 4242
/* 
  Run in Stripe CLI:
  stripe login
  stripe listen --forward-to localhost:5000/api/webhook
*/
const postEndpoint = asyncHandler(async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let updatedUser;

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    // Retrieve the session. If you require line items in the res, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      }
    );
    // const lineItems = sessionWithLineItems.line_items

    // Fulfill the purchase...
    // fulfillOrder(lineItems)
    // console.log(sessionWithLineItems.client_reference_id)
    if (sessionWithLineItems.client_reference_id) {
      // Update User's trackAllowance after purchase is complete
      updatedUser = await User.findByIdAndUpdate(
        sessionWithLineItems.client_reference_id,
        {
          $inc: { trackAllowance: 1 },
        },
        {
          new: true,
        }
      );

      const savePurchase = await Purchase.create({
        user: sessionWithLineItems.client_reference_id,
        session: sessionWithLineItems,
      });
    }
  }

  res.status(200).end();
});

module.exports = {
  postPayment,
  postDemoPayment,
  postEndpoint,
};
