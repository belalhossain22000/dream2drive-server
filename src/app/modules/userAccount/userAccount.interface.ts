// Define the User interface if not already defined
interface User {
    id: string; // Ensure this matches the type used for `id` in your `User` model
  }
  
  // Define the UserAccountDetails interface
  export interface UserAccountDetails {
    id: string; // ObjectId type; typically string for MongoDB
    userId: string; // ObjectId type; typically string for MongoDB
    user: User; // Reference to the User model
    cardNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    billingAddress1: string;
    address2?: string; // Optional field
    townCity: string;
    countryState: string;
    postcodeZipcode: string;
    country: string;
  }
  