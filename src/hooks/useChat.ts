import { useEffect, useState } from "react";

import { getChatHistory } from "../api/chatApi";

export default function useChat(
  senderId,
  receiverId
) {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    if (!senderId || !receiverId) return;

    async function loadHistory() {

      try {

        const data = await getChatHistory(
          senderId,
          receiverId
        );

        setMessages(data);

      } catch (error) {

        console.error(
          "Chat history error",
          error
        );

      }

    }

    loadHistory();

  }, [senderId, receiverId]);

  // Add this function here
  function addMessage(message) {

    setMessages((prev) => {

      const exists = prev.some(
        (m) => m.id === message.id
      );

      if (exists) return prev;

      return [...prev, message];

    });

  }

  return {

    messages,

    addMessage,

  };

}