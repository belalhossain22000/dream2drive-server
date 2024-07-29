import stripe from "../../../helpars/stripe";

const createSetupIntent = async () => {
  return await stripe.setupIntents.create({
    payment_method_types: ["card"],
  });
};

const validateCard = async (paymentMethodId: string) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  if (!paymentMethod || paymentMethod.type !== "card") {
    throw new Error("Invalid card");
  }

  return paymentMethod;
};

export const paymentService = {
  createSetupIntent,
  validateCard,
};
