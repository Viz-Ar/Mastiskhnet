import { useState } from "react";

export default function ChatInput({
  onSend,
}) {

  const [text, setText] =
    useState("");

  function send() {

    if (!text.trim()) return;

    onSend(text.trim());

    setText("");

  }

  function handleKeyDown(e) {

    if (e.key === "Enter") {

      e.preventDefault();

      send();

    }

  }

  return (

    <div className="flex gap-3 border-t bg-white p-4">

      <input
        type="text"
        value={text}
        placeholder="Type your message..."
        onChange={(e) =>
          setText(e.target.value)
        }
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />

      <button
        onClick={send}
        className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >

        Send

      </button>

    </div>

  );

}