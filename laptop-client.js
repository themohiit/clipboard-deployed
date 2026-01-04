import{io} from "socket.io-client";
import clipboard from "clipboardy";
import notifier from "node-notifier";
const SERVER_URL = "https://clipboard-deployed-1.onrender.com";

const socket = io(SERVER_URL);

let sessionId = null;
let lastClipboard = "";


socket.on("connect",()=>{
    console.log("connected to server");
    socket.emit("create-session");
});

socket.on("session-created",(id)=>{
    sessionId=id;
    notifier.notify(
      {
        title: "Enter this in ur phone",
        message: sessionId,
        wait: true,
        },() => {
    console.log("Notification clicked");
  });
});

setInterval(async()=>{
    if(!sessionId)return;
    const current = await clipboard.read();
    // console.log(current);
    if(current && current!== lastClipboard){
        lastClipboard=current;
        socket.emit("clipboard", { sessionId,content:current });
    
    console.log("sent clipboard:",current);

    }
},1000)