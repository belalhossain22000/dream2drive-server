import Stripe from "stripe";

const stripe = new Stripe("sk_test_51NEqyvKercfCCQ4O9aGDQa3U3DBJrEuBkJOIPGMrMbCdueFl0bBtte9BUbH80CXGDrZBkWGy2d10LKilsx0ujbsn00jvKSdMIq", {
  apiVersion: "2024-06-20",
});

export default stripe;
