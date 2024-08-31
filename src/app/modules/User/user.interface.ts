export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  userStatus: "ACTIVE" | "BLOCKED";
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
}