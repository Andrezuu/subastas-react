import { create } from "zustand";
import type { IAuction } from "../interfaces/IAuction";
import { persist } from "zustand/middleware";
import { createAuction, getAuctions } from "../services/auctionService";

interface IAuctionStore {
  auctions: IAuction[];
  isLoading: boolean;
  error: string | null;
  fetchAuctions: () => void;
  createAuction: (auction: IAuction) => void;
}

export const useAuctionStore = create<IAuctionStore>()(
  persist(
    (set) => ({
      auctions: [],
      isLoading: false,
      error: null,
      fetchAuctions: async () => {
        try {
          set({ isLoading: true, error: null });
          const auctions = await getAuctions();
          set({ auctions: auctions });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      createAuction: async (auction: IAuction) => {
        try {
          set({ isLoading: true });
          const newAuction = await createAuction(auction);
          if (!newAuction) {
            throw new Error("auction.createError");
          }
          set((state) => ({
            auctions: [...state.auctions, newAuction],
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "auctions" }
  )
);
