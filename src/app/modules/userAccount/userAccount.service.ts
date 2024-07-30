import stripe from "../../../helpars/stripe";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { UserAccountDetails } from "./userAccount.interface";

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

// crete user bank account
const createUserBankAccountIntoDb = async (payload: UserAccountDetails) => {
  // validate use is exist

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });
  console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(
      404,
      "User not found wit the user userr Id: " + payload.userId
    );
  }

  // Create a new user account details record in the database
  const result = await prisma.userAccountDetails.create({
    data: {
      userId: payload.userId,
      cardNumber: payload.cardNumber,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      billingAddress1: payload.billingAddress1,
      address2: payload.address2,
      townCity: payload.townCity,
      countryState: payload.countryState,
      postcodeZipcode: payload.postcodeZipcode,
      country: payload.country,
    },
  });

  return result;
};

// reterive all user bank account details

const getAllUserAccountDetailsFromDB = async () => {
  const result = await prisma.userAccountDetails.findMany({
    include: {
      user: true,
    },
  });
  if (result.length === 0 && !result) {
    throw new ApiError(404, "User bank account details not found");
  }
  return result;
};

export const paymentService = {
  validateCard,
  createUserBankAccountIntoDb,
  getAllUserAccountDetailsFromDB,
};
