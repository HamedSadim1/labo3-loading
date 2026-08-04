import React, { useState, useRef, useEffect } from "react";
import DialogPanel from "./DialogPanel";
import IconButton from "./IconButton";
import { useApp } from "../context/useApp";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const BOT_RESPONSES = [
  "Hoi! Hoe kan ik je helpen? 👋",
  "Dat is een interessante vraag!",
  "Laat me even denken... 🤔",
  "Goed punt! Ik begrijp het.",
  "Kun je dat uitleggen?",
  "Bedankt voor je bericht! 🙏",
  "Dat klopt helemaal!",
  "Ik snap wat je bedoelt.",
  "Laten we dat samen oplossen!",
  "Geweldig idee! 💡",
];

const Chat: React.FC = () => {
  const { addToast, activePanel, openPanel, closePanel } = useApp();
  const isOpen = activePanel === "chat";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hoi! Welkom bij de chat. Hoe kan ik je helpen?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const responseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current !== null) {
        window.clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;

    if (responseTimerRef.current !== null) {
      window.clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInputValue("");
    setIsTyping(true);

    responseTimerRef.current = window.setTimeout(
      () => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((previous) => [...previous, botResponse]);
        setIsTyping(false);
        responseTimerRef.current = null;
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleOpen = () => {
    if (isOpen) {
      closePanel();
      return;
    }

    openPanel("chat");
    if (messages.length <= 1) addToast("Chat geopend", "info");
  };

  return (
    <div className="relative">
      <IconButton
        label={messages.length > 1 ? "Chat, nieuwe berichten" : "Chat"}
        active={isOpen}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        onClick={handleOpen}
      >
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {messages.length > 1 && !isOpen && (
          <span
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-fuchsia-400 animate-pulse"
            aria-hidden="true"
          />
        )}
      </IconButton>

      <DialogPanel
        id="chat-panel"
        titleId="chat-title"
        open={isOpen}
        onClose={closePanel}
        className="flex h-[min(70dvh,30rem)] flex-col sm:h-96 sm:w-80"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/10 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 sm:h-10 sm:w-10">
              <svg
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
            <div>
              <h2 id="chat-title" className="text-sm font-semibold text-white">
                Chat Bot
              </h2>
              <p className="text-xs text-white/75">Online</p>
            </div>
          </div>
          <IconButton label="Sluiten" className="sm:p-2" onClick={closePanel}>
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <ul
          className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4"
          aria-label="Chatberichten"
        >
          {messages.map((message) => (
            <li
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 sm:max-w-[80%] sm:px-4 ${
                  message.sender === "user"
                    ? "bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-white"
                    : "border border-white/10 bg-white/10 text-white"
                }`}
              >
                <p className="text-xs sm:text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    message.sender === "user"
                      ? "text-white/75"
                      : "text-white/75"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          ))}

          {isTyping && (
            <li className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <div className="flex gap-1" role="status">
                  <span className="sr-only">Chatbot typt</span>
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="h-2 w-2 animate-bounce rounded-full bg-white/60"
                      style={{ animationDelay: `${index * 150}ms` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </li>
          )}
          <li ref={messagesEndRef} aria-hidden="true" />
        </ul>

        <form
          className="shrink-0 border-t border-white/10 p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendMessage();
          }}
        >
          <div className="flex gap-2">
            <label htmlFor="chat-message" className="sr-only">
              Bericht invoeren
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              id="chat-message"
              placeholder="Typ een bericht..."
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base text-white placeholder-white/70 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="min-h-11 min-w-11 rounded-xl bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 p-2 text-white transition hover:from-cyan-300 hover:via-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 active:scale-[0.97]"
              aria-label="Verstuur bericht"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </DialogPanel>
    </div>
  );
};

export default Chat;
