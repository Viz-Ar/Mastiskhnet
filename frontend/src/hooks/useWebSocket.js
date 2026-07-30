import { useEffect, useRef } from "react";

const WS_BASE_URL = "ws://127.0.0.1:8000/api/v1";

export default function useWebSocket(
  userId,
  onMessage
) {
  const socket = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(
      `${WS_BASE_URL}/chat/ws/${userId}`
    );

    socket.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Incoming:", data);

      if (onMessage) {
        onMessage(data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Closed");
    };

    return () => {
      ws.close();
    };
  }, [userId, onMessage]);

  const sendMessage = (receiverId, message) => {
    if (
      socket.current &&
      socket.current.readyState === WebSocket.OPEN
    ) {
      socket.current.send(
        JSON.stringify({
          receiver_id: receiverId,
          message,
        })
      );
    }
  };

  return {
    sendMessage,
    socket,
  };
}