// src/interfaces.ts
export interface Item {
  amount: number;
}

export interface CreatePaymentInput {
  price: number;
  paymentMethodId: string;
  userId: string;
  carsId: string;
}
