import { useEffect } from "react";
import { io } from "socket.io-client";
import { useParams, useLocation, Link } from "react-router-dom";
import Chat from "./Chat";
import Notification from "./Notification";
import "./ChatApp.css";

const socket = io("http://localhost:5000");

function ChatApp() {
  const { id } = useParams();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"))?.username || "User";

  useEffect(() => {
    if (id) {
      socket.emit("joinProject", id);
    }
  }, [id]);

  const isChatPage = location.pathname.endsWith("/chat");
  const isNotificationPage = location.pathname.endsWith("/notifications");

  return (
    <div className="chat-app-page">
    

      {isChatPage && (
        <div className="chat-app-layout">
          <Chat user={user} projectId={id} socket={socket} />
          <Notification projectId={id} socket={socket} />
        </div>
      )}

      {isNotificationPage && (
        <div className="chat-app-notification-layout">
          <Notification projectId={id} socket={socket} />
        </div>
      )}
    </div>
  );
}

export default ChatApp;