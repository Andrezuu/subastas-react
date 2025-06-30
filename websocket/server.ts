import { Server } from "socket.io";
import http from "http";
import fs from "fs";
import path from "path";
import { IAuction } from "../frontend/src/interfaces/IAuction";
import { auctionTypes } from "./constants/auctionTypes";

const PORT = 3001;
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

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

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  const { timers } = processAuctions();

  socket.emit("INITIAL_DATA", { timers });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Error en Socket.IO:", error);
  });
});

timerInterval = setInterval(() => {
  if (io.engine.clientsCount > 0) {
    const { timers } = processAuctions();
    io.emit("UPDATE_DATA", { timers });
  }
}, 1000);

server.listen(PORT, () => {
  console.log(`Socket.IO server escuchando en http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("Cerrando servidor...");
  clearInterval(timerInterval);
  io.close(() => {
    console.log("Servidor Socket.IO cerrado.");
    server.close(() => {
      console.log("Servidor HTTP cerrado.");
      process.exit(0);
    });
  });
});
