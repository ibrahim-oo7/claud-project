import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import "./Chat.css";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axios.get(`http://localhost:5000/messages/${props.projectId}`);
        setMessages(res.data);
      } catch (error) {
        console.log("ERROR:", error.response || error.message);
      }
    }
    if (props.projectId) {
      fetchMessages();
    }
  }, [props.projectId]);

  useEffect(() => {
    const handleMessage = (msg) => {
      if (msg.projectId === props.projectId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    props.socket.on("receiveMessage", handleMessage);
    return () => props.socket.off("receiveMessage", handleMessage);
  }, [props.socket, props.projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (text.trim() === "" && !file) return;

    try {
      let filePath = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        filePath = res.data.path;
      }

      const msg = {
        projectId: props.projectId,
        user: props.user,
        content: text,
        file: filePath
      };

      setMessages((prev) => [...prev, msg]);
      props.socket.emit("sendMessage", msg);

      setText("");
      setFile(null);
    } catch (error) {
      console.log("ERROR:", error.response || error.message);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h3 className="chat-title">
          Chat <MessageCircle size={20} className="chat-title-icon" />
        </h3>
      </div>

      <div className="chat-messages-box">
        {messages.map((msge, index) => {
          const isMe = msge.user === props.user;
          return (
            <div
              key={index}
              className={isMe ? "chat-message-row chat-message-row-me" : "chat-message-row chat-message-row-other"}
            >
              <div className={isMe ? "chat-bubble chat-bubble-me" : "chat-bubble chat-bubble-other"}>
                <b className="chat-user-name">{msge.user}:</b>
                <br />
                <span className="chat-message-text">{msge.content}</span>

                {msge.file && (
                  <>
                    <br />
                    <a
                      className="chat-file-link"
                      href={`http://localhost:5000${msge.file}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📎 View file
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-inputs">
        <input
          className="chat-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <input
          className="chat-file-input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;