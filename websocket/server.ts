import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";
import { IAuction } from "../frontend/src/interfaces/IAuction";
import { auctionTypes } from "./constants/auctionTypes";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

const getAuctions = () => {
  try {
    const dbPath = path.join(__dirname, "../frontend/src/db.json");
    const data = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(data);
    return db.auctions || [];
  } catch (error) {
    console.error("Error leyendo db.json:", error);
    return [];
  }
};

const getAuctionType = (startTime: string, endTime: string) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return auctionTypes.FUTURE;
  if (now >= start && now <= end) return auctionTypes.PRESENT;
  return auctionTypes.PAST;
};

const calculateTimeLeft = (endTime: string) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const difference = end - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

const broadcast = (data: Object) => {
  const message = JSON.stringify(data);
  console.log("[INFO]", message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

const processAuctions = () => {
  const auctions = getAuctions().map((auction: IAuction) => {
    const calculatedType = getAuctionType(
      auction.startTime || new Date().toISOString(),
      auction.endTime
    );

    return {
      ...auction,
      type: calculatedType,
    };
  });

  const auctionTimers = auctions.map((auction: IAuction) => ({
    id: auction.id,
    type: auction.type,
    timeLeft: calculateTimeLeft(auction.endTime),
  }));

  return { timers: auctionTimers };
};

let timerInterval: NodeJS.Timeout;

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  const { timers } = processAuctions();

  ws.send(
    JSON.stringify({
      type: "INITIAL_DATA",
      data: {
        timers,
      },
    })
  );

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });

  ws.on("error", (error) => {
    console.error("Error en WebSocket:", error);
  });
});

timerInterval = setInterval(() => {
  if (wss.clients.size > 0) {
    const { timers } = processAuctions();

    broadcast({
      type: "UPDATE_DATA",
      data: {
        timers,
      },
    });
  }
}, 1000);

console.log(`WebSocket server escuchando en ws://localhost:${PORT}`);

process.on("SIGTERM", () => {
  clearInterval(timerInterval);
  wss.close();
});
