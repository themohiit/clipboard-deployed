import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{origin:"*"}
});

app.use(express.static(path.join(__dirname, "public")));

const sessions = new Set();
 io.on("connection",(socket)=>{
    console.log("connected",socket.id);

    socket.on("create-session",()=>{
        const sessionId = Math.floor(100000 + Math.random()*900000)
        sessions.add(sessionId);
        console.log(sessions)
        socket.join(sessionId);
        socket.emit("session-created",sessionId);
        console.log("session created",sessionId);

    });
    socket.on("join-session",(sessionId)=>{
        if(!sessions.has(sessionId)){
            socket.emit("invalid-session");
            return;
        }
        socket.join(sessionId);
        socket.emit("session-joined",sessionId);
        console.log("Joined session",sessionId);

    });
    socket.on("clipboard",({sessionId,content})=>{
        socket.to(sessionId).emit("clipboard",content);
    });

    socket.on("disconnect",()=>{
        console.log("disconnected:",socket.id);
    })
 })

 httpServer.listen(process.env.PORT||3000,()=>{
    console.log("Server running on port:",process.env.PORT||3000);
 })