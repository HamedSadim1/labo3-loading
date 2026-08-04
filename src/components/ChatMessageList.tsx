import React from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLLIElement | null>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  messagesEndRef,
}) => (
  <ul className="space-y-3 sm:space-y-4" aria-label="Chatberichten">
    {messages.map((message) => (
      <li
        key={message.id}
        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-3 py-2 sm:max-w-[80%] sm:px-4 ${
            message.sender === "user"
              ? "brand-gradient text-white"
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
);

export default ChatMessageList;
