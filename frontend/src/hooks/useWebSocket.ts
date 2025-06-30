import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
}

export const useAppWebSocket = () => {
  const WEBSOCKET_URL = "http://localhost:3001";
  const [timers, setTimers] = useState<Record<string, TimerData>>({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting");

  useEffect(() => {
    const socket: Socket<ServerToClientEvents> = io(WEBSOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 3000,
    });

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

    return () => {
      socket.off("INITIAL_DATA", handleData);
      socket.off("UPDATE_DATA", handleData);
      socket.disconnect();
    };
  }, []);

  return { timers, connectionStatus };
};
