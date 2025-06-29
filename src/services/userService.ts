import jsonServerInstance from "../api/jsonInstance";
import type { IUser } from "../interfaces/IUser";

export const createUser= async (user: IUser) => {
  try {
    const response = await jsonServerInstance.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
  }
};
