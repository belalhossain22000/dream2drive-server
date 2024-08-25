// src/interfaces.ts
export interface Item {
    amount: number;
  }
  
  export interface CreatePaymentInput {
    items: Item[];
  }
  