import prisma from "../../../shared/prisma"

const createAdminIntoDB = async (payload: any) => {
    console.log(payload);
    const userData = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.admin.email,
        password: payload.password,
        role: payload.role,
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })
        const createAdminData = await transactionClient.admin.create({
            data: payload.admin
        })
    })
}

const getAllUsersFromDB = async () => {
    try {
        const result = await prisma.user.findMany();
        return result;
    } catch (error) {
        throw new Error(`Could not get users: ${error.message}`);
    }
};
export const userServices = {
    createAdminIntoDB, getAllUsersFromDB
}