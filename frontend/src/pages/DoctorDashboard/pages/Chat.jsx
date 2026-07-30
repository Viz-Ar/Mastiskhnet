import {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";

import useAuthStore from "../../../store/authStore";
import useMRIHistory from "../../../hooks/useMRIHistory";
import useChat from "../../../hooks/useChat";
import useWebSocket from "../../../hooks/useWebSocket";

import MessageBubble from "../../../components/chat/MessageBubble";
import ChatInput from "../../../components/chat/ChatInput";

export default function Chat() {

  const { user } = useAuthStore();

  const { history } = useMRIHistory(
    user?.id
  );

  // Remove duplicate patients
  const patients = useMemo(() => {

    const map = new Map();

    (history || []).forEach((item) => {

      if (!map.has(item.patient_id)) {

        map.set(item.patient_id, item);

      }

    });

    return [...map.values()];

  }, [history]);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const {
    messages,
    addMessage,
  } = useChat(
    user?.id,
    selectedPatient?.patient_id
  );

  // Auto scroll container
  const messagesContainerRef =
    useRef(null);

  useEffect(() => {

    if (messagesContainerRef.current) {

      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;

    }

  }, [messages]);

  const {
    sendMessage,
  } = useWebSocket(
    user?.id,
    (data) => {

      const message =
        data.data || data;

      addMessage(message);

    }
  );

  function handleSend(text) {

    if (!selectedPatient) return;

    // Show instantly
    addMessage({

      id: Date.now(),

      sender_id: user.id,

      receiver_id:
        selectedPatient.patient_id,

      message: text,

      created_at:
        new Date().toISOString(),

    });

    // Send through websocket
    sendMessage(
      selectedPatient.patient_id,
      text
    );

  }

  return (

    <div
      className="
      flex
      h-[calc(100vh-170px)]
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-sm
    "
    >

      {/* LEFT PANEL */}

      <div className="w-80 border-r">

        <div className="border-b p-4">

          <h2 className="text-xl font-bold">
            Patients
          </h2>

        </div>

        <div className="overflow-y-auto">

          {patients.length === 0 && (

            <div className="p-6 text-center text-slate-500">

              No patients found

            </div>

          )}

          {patients.map((patient) => (

            <button

              key={patient.patient_id}

              onClick={() =>
                setSelectedPatient(patient)
              }

              className={`

                w-full
                border-b
                p-4
                text-left
                transition

                ${
                  selectedPatient?.patient_id ===
                  patient.patient_id
                    ? "bg-blue-50"
                    : "hover:bg-slate-50"
                }

              `}
            >

              <p className="font-semibold">

                {patient.patient_name}

              </p>

              <p className="text-sm text-slate-500">

                {patient.patient_email}

              </p>

            </button>

          ))}

        </div>

      </div>

      {/* CHAT PANEL */}

      <div className="flex flex-1 flex-col">

        {!selectedPatient ? (

          <div className="flex flex-1 items-center justify-center text-slate-500">

            Select a patient to start chatting

          </div>

        ) : (

          <>

            {/* Header */}

            <div className="border-b p-5">

              <h2 className="text-xl font-bold">

                {selectedPatient.patient_name}

              </h2>

              <p className="text-sm text-slate-500">

                {selectedPatient.patient_email}

              </p>

            </div>

            {/* Messages */}

            <div

              ref={messagesContainerRef}

              className="
                flex-1
                overflow-y-auto
                p-5
                space-y-3
              "

            >

              {(messages || []).map((message) => (

                <MessageBubble

                  key={message.id}

                  message={message}

                  currentUser={user?.id}

                />

              ))}

            </div>

            {/* Input */}

            <ChatInput
              onSend={handleSend}
            />

          </>

        )}

      </div>

    </div>

  );

}