import React, { useEffect, useRef, useState } from "react";
import DialogPanel from "./DialogPanel";
import PanelTrigger from "./PanelTrigger";
import PanelHeader from "./PanelHeader";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { createId } from "../utils/createId";
import PanelBody from "./PanelBody";
import { usePanelToggle } from "../hooks/usePanelToggle";
import Icon from "./Icon";
import {
  BOT_RESPONSES,
  CHAT_RESPONSE_BASE_DELAY_MS,
  CHAT_RESPONSE_VARIANCE_MS,
  CHAT_WELCOME_MESSAGE,
} from "../constants/chat";
import { PANEL_IDS, PANEL_KEYS } from "../constants/panels";
import ChatComposer from "./ChatComposer";
import ChatMessageList, { type ChatMessage } from "./ChatMessageList";

const Chat: React.FC = () => {
  const panel = PANEL_IDS.chat;
  const { isOpen, toggle, close } = usePanelToggle(PANEL_KEYS.chat);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isOpenRef = useRef(isOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: CHAT_WELCOME_MESSAGE,
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

    const userMessage: ChatMessage = {
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
        const botResponse: ChatMessage = {
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
      CHAT_RESPONSE_BASE_DELAY_MS + Math.random() * CHAT_RESPONSE_VARIANCE_MS,
    );
  };

  return (
    <div className="relative">
      <PanelTrigger
        label={
          unreadCount
            ? `${panel.label}, ${unreadCount} nieuwe berichten`
            : panel.label
        }
        controls={panel.panel}
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
        id={panel.panel}
        titleId={panel.title}
        open={isOpen}
        onClose={close}
        className="flex h-[min(70dvh,30rem)] flex-col sm:h-96 sm:w-80"
      >
        <PanelHeader
          title={panel.heading}
          titleId={panel.title}
          subtitle={panel.subtitle}
          onClose={close}
          leading={
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-cyan-300 via-violet-400 to-fuchsia-400 sm:h-10 sm:w-10">
              <Icon name="bot" className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
          }
        />

        <PanelBody className="flex-1 p-3 sm:p-4">
          <ChatMessageList
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        </PanelBody>

        <ChatComposer
          value={inputValue}
          isTyping={isTyping}
          onChange={setInputValue}
          onSend={handleSendMessage}
        />
      </DialogPanel>
    </div>
  );
};

export default Chat;
