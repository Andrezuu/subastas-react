import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { IBid } from "../interfaces/IBid";
import { createBid } from "../services/bidService";

interface TimerData {
  id: string;
  type: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface ServerToClientEvents {
  INITIAL_DATA: (data: { timers: TimerData[] }) => void;
  UPDATE_DATA: (data: { timers: TimerData[] }) => void;
  BID_UPDATE: (data: IBid) => void;
  BID_ERROR: (error: string) => void;
  AUCTION_END: (data: { productId: string; winner: IBid }) => void;
}

export const useAppWebSocket = () => {
  const WEBSOCKET_URL = "http://localhost:3001";
  const [timers, setTimers] = useState<Record<string, TimerData>>({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting");
  const [currentBids, setCurrentBids] = useState<Record<string, IBid>>({});
  const [bidError, setBidError] = useState<string | null>(null);
  const [winners, setWinners] = useState<Record<string, IBid>>({});

  const socketRef = useRef<Socket<ServerToClientEvents> | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(WEBSOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 3000,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        setConnectionStatus("Open");
      });

      socket.on("disconnect", () => {
        setConnectionStatus("Closed");
      });

      const handleData = (data: { timers: TimerData[] }) => {
        const newTimers = data.timers.reduce(
          (acc: Record<string, TimerData>, timer) => {
            acc[timer.id] = timer;
            return acc;
          },
          {}
        );
        setTimers(newTimers);
      };

      socket.on("INITIAL_DATA", handleData);
      socket.on("UPDATE_DATA", handleData);

      socket.on("BID_UPDATE", async (bid: IBid) => {
        setCurrentBids((prev) => ({ ...prev, [bid.auctionId]: bid }));
        await createBid({
          auctionId: bid.auctionId,
          amount: bid.amount,
          userId: bid.userId,
          timestamp: new Date().toISOString(),
        });
        setBidError(null);
      });

      socket.on("BID_ERROR", (error: string) => {
        setBidError(error);
        setTimeout(() => setBidError(null), 3000);
      });

      socket.on("AUCTION_END", (data) => {
        setWinners((prev) => ({ ...prev, [data.productId]: data.winner }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const placeBid = (auctionId: string, amount: number, userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("BID_UPDATE", {
        auctionId,
        amount,
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return {
    timers,
    connectionStatus,
    currentBids,
    bidError,
    winners,
    placeBid,
  };
};
