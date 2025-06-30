import { useEffect, useRef, useState } from "react";
import type { IAuction } from "../interfaces/IAuction";

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

export const useWebSocket = () => {
  const WEBSOCKET_URL = "ws://localhost:3001";
  const [timers, setTimers] = useState<Record<string, TimerData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connectWebSocket = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        return;
      }

      try {
        ws.current = new WebSocket(WEBSOCKET_URL);

        ws.current.onopen = () => {
          console.log("WebSocket conectado");
          setIsConnected(true);
          reconnectAttempts.current = 0;
        };

        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (
              message.type === "INITIAL_DATA" ||
              message.type === "UPDATE_DATA"
            ) {
              if (
                message.data &&
                message.data.timers &&
                Array.isArray(message.data.timers)
              ) {
                const newTimers: Record<string, TimerData> = {};
                message.data.timers.forEach((timer: TimerData) => {
                  newTimers[timer.id] = timer;
                });
                setTimers(newTimers);
              }
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.current.onclose = (event) => {
          console.log("WebSocket desconectado", event.code, event.reason);
          setIsConnected(false);

          if (
            event.code !== 1000 &&
            reconnectAttempts.current < maxReconnectAttempts
          ) {
            reconnectAttempts.current++;
            const delay = Math.min(
              1000 * Math.pow(2, reconnectAttempts.current),
              10000
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(
                `Reintentando conexión (${reconnectAttempts.current}/${maxReconnectAttempts})`
              );
              connectWebSocket();
            }, delay);
          }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Error al conectar WebSocket:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  return { timers, isConnected };
};
