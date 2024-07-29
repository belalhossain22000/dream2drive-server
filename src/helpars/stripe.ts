import Stripe from "stripe";

const stripe = new Stripe("your_stripe_secret_key", {
  apiVersion: "2024-06-20",
});

export default stripe;
