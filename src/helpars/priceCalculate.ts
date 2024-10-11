export const CalculateThePrice = async (price: number): Promise<number> => {
  const newPrice = price * (5.5 / 100); // Calculate 5.5% of the price

  // Ensure the newPrice is a number (no need for parseFloat)
  if (newPrice < 1000) {
    return 1000;
  } else if (newPrice >= 1000 && newPrice < 15000) {
    return newPrice;
  } else {
    return 15000;
  }
};
