import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import "./Notification.css";

function Notification(props) {
  const [notifs, setNotifs] = useState([]);
  const [count, setCount] = useState(0);
  const notifsEndRef = useRef(null);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await axios.get(`http://localhost:5000/notifications/${props.projectId}`);
        setNotifs(res.data);
      } catch (error) {
        console.log("ERROR:", error.response || error.message);
      }
    }
    if (props.projectId) {
      fetchNotifs();
    }
  }, [props.projectId]);

  useEffect(() => {
    const handleNotif = (msg) => {
      if (msg.projectId === props.projectId) {
        setNotifs((prev) => [...prev, msg]);
        setCount((prev) => prev + 1);
      }
    };

    props.socket.on("notification", handleNotif);
    return () => props.socket.off("notification", handleNotif);
  }, [props.socket, props.projectId]);

  useEffect(() => {
    notifsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notifs]);

  return (
    <div className="notification-page">
      <h3
        onClick={() => setCount(0)}
        className="notification-title"
      >
        <Bell size={20} className="notification-title-icon" />
        Notifications
        {count > 0 && (
          <span className="notification-badge">
            {count}
          </span>
        )}
      </h3>

      <div className="notification-list-box">
        {notifs.map((notife, index) => (
          <p key={index} className="notification-item">
            {notife.text}
          </p>
        ))}
        <div ref={notifsEndRef} />
      </div>
    </div>
  );
}

export default Notification;