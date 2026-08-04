import React, { useState, useRef, useEffect } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current !== null) {
        window.clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && responseTimerRef.current !== null) {
      window.clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
      setIsTyping(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (responseTimerRef.current !== null) {
      window.clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
      setIsTyping(false);
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        responseTimerRef.current = null;
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    openPanel("chat");
    if (messages.length <= 1) {
      addToast("Chat geopend", "info");
    }
  };

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <button
        onClick={handleOpen}
        className="group relative p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Chat"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {/* Notification dot */}
        {messages.length > 1 && !isOpen && (
          <span
            className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-fuchsia-400 animate-pulse"
            aria-label="Nieuwe berichten"
          >
            <span className="sr-only">Nieuwe berichten</span>
          </span>
        )}
      </button>

      {/* Chat Window - responsive */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat"
          className="fixed inset-x-3 top-20 z-50 flex h-[min(70vh,30rem)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-slide-up sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:bottom-auto sm:mt-2 sm:h-96 sm:w-80 sm:max-h-[calc(100vh-7rem)] sm:overflow-y-auto sm:bg-white/10"
        >
          {/* Header */}
          <div className="bg-white/10 border-b border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white/10" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    Chat Bot
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/50">Online</p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Sluiten"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-white"
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <p className="text-xs sm:text-sm">{message.text}</p>
                  <p
                    className={`text-[10px] sm:text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-white/40"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("nl-NL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3 sm:p-4 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Typ een bericht..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 text-white text-xs sm:text-sm placeholder-white/40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                aria-label="Bericht invoeren"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="rounded-xl bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 p-2 text-white transition-all duration-300 hover:from-cyan-300 hover:via-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                aria-label="Verstuur bericht"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
