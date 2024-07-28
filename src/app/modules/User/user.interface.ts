export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "ADMIN" | "SELLER" | "BUYER";
  userStatus: "ACTIVE" | "BLOCKED";
  createdAt?: Date;
  updatedAt?: Date;
}
