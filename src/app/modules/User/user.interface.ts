import { CrediteCardStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  mobile: string;
  crediteCardStatus:CrediteCardStatus
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
};
