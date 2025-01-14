import express, { type Request, type Response } from "express";
import session from "express-session";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SK_TEST as string, {
  apiVersion: "2024-06-20",
  typescript: true,
});
// const stripe = require("stripe")(process.env.SK_TEST);
import { StatusCodes } from "http-status-codes";
import { type StripeRequest } from "../types/controllers/interfaces";
import "../types/controllers/modules";
import User from "../models/userModel";
import Purchase from "../models/purchaseModel";

const YOUR_DOMAIN: string = "http://localhost:3000/";

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = <string>process.env.SK_ENDPOINT;

// @desc    Post embeddedCheckout
// @route   POST /api/purchase/checkout
// @access  Private
// Create checkout on the same page
const embeddedCheckout = asyncHandler(
  async (req: StripeRequest, res: Response, next) => {
    try {
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

      const commands: Stripe.Checkout.SessionCreateParams = {
        ui_mode: "embedded",
        customer: userStripeID ? userStripeID : customerData?.id,
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: "price_1NNh7rFOk6NyPVsVGSoBA4pY",
            quantity: 1,
          },
        ],
        mode: "payment",
        return_url: `${YOUR_DOMAIN}profile/checkoutpage?session_id={CHECKOUT_SESSION_ID}`,
        client_reference_id: req.session.userID as string,
      };

      // Create Stripe Session Link
      const session = await stripe.checkout.sessions.create(commands);

      res.send({ clientSecret: session.client_secret });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get SessionStatus
// @route   GET /api/purchase/checkout/:session_id
// @access  Private
const checkSessionStatus = asyncHandler(
  async (req: StripeRequest, res: Response, next) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        req.params.session_id
      );

      res.send({
        status: session.status,
        customer_email: session.customer_details?.email,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Post purchase
// @route   POST /api/purchase
// @access  Private
const postPayment = asyncHandler(
  async (req: StripeRequest, res: Response, next) => {
    try {
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
        customer: userStripeID ? userStripeID : customerData?.id,
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
        client_reference_id: req.session.userID as string,
      });

      res.json(session.url);
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Post demo purchase
// @route   POST /api/purchase
// @access  Private
const postDemoPayment = asyncHandler(
  async (req: StripeRequest, res: Response, next) => {
    try {
      const user = (await User.findById(req.session.userID)) as any;

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

        res.status(StatusCodes.OK).json("Purchase Made");
      } else {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("User not found");
      }
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Post endpoint
// @route   POST /api/webhook
// @access  Public
// Test Card 4242 4242 4242 4242
/* 
  Run in Stripe CLI:
  stripe login
  stripe listen --forward-to localhost:5000/api/webhook
*/
const postEndpoint = asyncHandler(
  async (req: StripeRequest, res: any, next) => {
    try {
      const payload = req.body;
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      let updatedUser;

      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        // Retrieve the session. If you require line items in the res, you may include them by expanding line_items.

        interface stripeObject extends Stripe.Event.Data.Object {
          id?: string;
        }

        const paymentIntent: stripeObject = event.data.object;

        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          paymentIntent.id as string,
          {
            expand: ["line_items"],
          }
        );
        // const lineItems = sessionWithLineItems.line_items

        // Fulfill the purchase...
        // fulfillOrder(lineItems)
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
            session: sessionWithLineItems.id,
            isTrackCreated: false,
          });
        }
      }

      res.status(StatusCodes.OK).end();
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get Track Created Status
// @route   GET /api/purchase/trackcreated
// @access  Private
const getTrackCreatedStatus = asyncHandler(
  async (req: Request, res: Response, next) => {
    try {
      const tracksCreated = await Purchase.find({ user: req.session.userID, isTrackCreated: false });

      res.status(StatusCodes.OK).json(tracksCreated.length);
    } catch (error) {
      next(error);
    }
  }
);

// TODO: Test client update
// @desc    Update Track Created Status and add trackID
// @route   PUT /api/purchase/updatepurchase
// @access  Private
const updateTrackCreatedStatus = asyncHandler(
  async (req: Request, res: Response, next) => {
    try {
      const { id } = req.body;

      const updatedPurchase = await Purchase.findOneAndUpdate({ isTrackCreated: false }, {
        $set: { isTrackCreated: true },
        $push: { trackID: id },
      });

      res.status(StatusCodes.OK).json(updatedPurchase);
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Update Track Created Status and delete trackID
// @route   PUT /api/purchase/deletetrack
// @access  Private
const deleteTrackPurchase = asyncHandler(
  async (req: Request, res: Response, next) => {
    try {
      const { id } = req.body;

      const updatedPurchase = await Purchase.findOneAndUpdate({ trackID: id }, {
        $set: { isTrackCreated: false },
        $pull: { trackID: id },
      });

      res.status(StatusCodes.OK).json(updatedPurchase);
    } catch (error) {
      next(error);
    }
  }
);

export {
  postPayment,
  postDemoPayment,
  postEndpoint,
  embeddedCheckout,
  checkSessionStatus,
  getTrackCreatedStatus,
  updateTrackCreatedStatus,
  deleteTrackPurchase,
};
