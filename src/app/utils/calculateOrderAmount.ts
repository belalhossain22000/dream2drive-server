export const calculateOrderAmount = (items: any) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item: any) => {
    total += item.amount;
  });
  return total;
};
