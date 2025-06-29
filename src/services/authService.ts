import jsonServerInstance from "../api/jsonInstance";

export const loginAPI = async (username: string) => {
  const response = await jsonServerInstance.get("/users", {
    params: { username },
  });
  return response.data[0];
};
