import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface TimerData {
  id: string;
  type: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  };
}

export const useAppWebSocket = () => {
  const WEBSOCKET_URL = "ws://localhost:3001";
  const [timers, setTimers] = useState<Record<string, TimerData>>({});

  const { lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const message = JSON.parse(lastMessage.data);

        if (message.type === "INITIAL_DATA" || message.type === "UPDATE_DATA") {
          const newTimers = message.data.timers.reduce(
            (acc: Record<string, TimerData>, timer: TimerData) => {
              acc[timer.id] = timer;
              return acc;
            },
            {}
          );
          setTimers(newTimers);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return { timers, connectionStatus };
};
