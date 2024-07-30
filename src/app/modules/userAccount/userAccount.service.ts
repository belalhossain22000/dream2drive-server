import stripe from "../../../helpars/stripe";

// const createSetupIntent = async () => {
//   return await stripe.setupIntents.create({
//     payment_method_types: ["card"],
//   });
// };

// const validateCard = async (paymentMethodId: string) => {
//   const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

//   if (!paymentMethod || paymentMethod.type !== "card") {
//     throw new Error("Invalid card");
//   }

//   return paymentMethod;
// };



// validateCard card
const validateCard = async (cardDetails: any) => {
  try {
    // Create a PaymentMethod with card details
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: cardDetails,
    });
    return {
      valid: true,
      paymentMethod,
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

export const paymentService = {
  // createSetupIntent,
  validateCard,
};
