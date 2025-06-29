import jsonServerInstance from "../api/jsonInstance";
import type { IAuction } from "../interfaces/IAuction";

export const getAuctionById = async (id: string) => {
  try {
    const response = await jsonServerInstance.get(`/auctions?id=${id}`);
    return response.data[0];
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const getAuctions = async () => {
  try {
    const response = await jsonServerInstance.get("/auctions");
    return response.data as IAuction[];
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
};

export const createAuction = async (auction: IAuction) => {
  try {
    const response = await jsonServerInstance.post("/auctions", auction);
    return response.data;
  } catch (error) {
    console.error("Error creating auction:", error);
  }
};
