import React, { useEffect, useRef, useState } from "react";
import DialogPanel from "./DialogPanel";
import PanelTrigger from "./PanelTrigger";
import PanelHeader from "./PanelHeader";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { createId } from "../utils/createId";
import PanelBody from "./PanelBody";
import { usePanelToggle } from "../hooks/usePanelToggle";
import Icon from "./Icon";

interface Message {
  id: string;
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
  const { isOpen, toggle, close } = usePanelToggle("chat");
  const prefersReducedMotion = usePrefersReducedMotion();
  const isOpenRef = useRef(isOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hoi! Welkom bij de chat. Hoe kan ik je helpen?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const responseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, isTyping, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current !== null) {
        window.clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: createId("message"),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInputValue("");
    setIsTyping(true);

    responseTimerRef.current = window.setTimeout(
      () => {
        const botResponse: Message = {
          id: createId("message"),
          text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((previous) => [...previous, botResponse]);
        if (!isOpenRef.current) setUnreadCount((count) => count + 1);
        setIsTyping(false);
        responseTimerRef.current = null;
      },
      1000 + Math.random() * 1000,
    );
  };

  return (
    <div className="relative">
      <PanelTrigger
        label={unreadCount ? `Chat, ${unreadCount} nieuwe berichten` : "Chat"}
        controls="chat-panel"
        isOpen={isOpen}
        onToggle={() => {
          isOpenRef.current = !isOpen;
          if (!isOpen) setUnreadCount(0);
          toggle();
        }}
      >
        <Icon name="chat" className="h-4 w-4 sm:h-5 sm:w-5" />
        {unreadCount > 0 && !isOpen && (
          <span
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-fuchsia-400 motion-safe:animate-pulse"
            aria-hidden="true"
          />
        )}
      </PanelTrigger>

      <DialogPanel
        id="chat-panel"
        titleId="chat-title"
        open={isOpen}
        onClose={close}
        className="flex h-[min(70dvh,30rem)] flex-col sm:h-96 sm:w-80"
      >
        <PanelHeader
          title="Chatbot"
          titleId="chat-title"
          subtitle="Beschikbaar"
          onClose={close}
          leading={
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 sm:h-10 sm:w-10">
              <Icon name="bot" className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
          }
        />

        <PanelBody className="flex-1 p-3 sm:p-4">
          <ul className="space-y-3 sm:space-y-4" aria-label="Chatberichten">
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
                  <p className="text-sm">{message.text}</p>
                  <time
                    className="mt-1 block text-xs text-white/75"
                    dateTime={message.timestamp.toISOString()}
                  >
                    {message.timestamp.toLocaleTimeString("nl-NL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
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
                        className="h-2 w-2 motion-safe:animate-bounce rounded-full bg-white/60"
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
        </PanelBody>

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
              id="chat-message"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Typ een bericht..."
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base text-white placeholder-white/70 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="min-h-11 min-w-11 rounded-xl bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 p-2 text-white transition hover:from-cyan-300 hover:via-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 active:scale-[0.97]"
              aria-label="Bericht versturen"
            >
              <Icon name="send" className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </form>
      </DialogPanel>
    </div>
  );
};

export default Chat;
