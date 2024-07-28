import prisma from "../../../shared/prisma";

// Create a new user in the database.
const createUserIntoDb = async (payload: any) => {
  console.log(payload, "from service");
  const result = await prisma.user.create({
    data: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      password: payload.password,
      role: payload.role,
      userStatus: payload.userStatus,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    },
  });
  return result;
};

const getUsersFromDb = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb
};
