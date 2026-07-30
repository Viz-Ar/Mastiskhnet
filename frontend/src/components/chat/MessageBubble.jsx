export default function MessageBubble({
  message,
  currentUser,
}) {

  const mine =
    message.sender_id === currentUser;

  return (

    <div
      className={`flex ${
        mine
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-md rounded-2xl px-4 py-3 shadow-sm ${
          mine
            ? "bg-blue-600 text-white"
            : "bg-slate-200 text-slate-900"
        }`}
      >

        <p className="break-words">
          {message.message}
        </p>

        <p className="mt-2 text-right text-xs opacity-70">
          {new Date(
            message.created_at
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

      </div>

    </div>

  );

}