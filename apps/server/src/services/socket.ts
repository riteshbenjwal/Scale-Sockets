import { Server } from "socket.io";
import Redis from "ioredis";

// const REDIS_URL =
//   "redis://default:AVNS_vSuxiGWwVIoZxlcMjpk@redis-2276e2b-riteshbenjwal12-a2dc.a.aivencloud.com:11523";

const pub = new Redis(REDIS_URL);
const sub = new Redis(REDIS_URL);

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners ...");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);

      socket.on("event:message", async ({ message }) => {
        console.log("New Message Rec. ", message);

        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
