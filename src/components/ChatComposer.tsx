import React from "react";
import Icon from "./Icon";
import { CHAT_CONFIG, DOM_IDS } from "../constants";

interface ChatComposerProps {
  value: string;
  isTyping: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatComposer: React.FC<ChatComposerProps> = ({
  value,
  isTyping,
  onChange,
  onSend,
}) => (
  <form
    className="shrink-0 border-t border-white/10 p-3 sm:p-4"
    onSubmit={(event) => {
      event.preventDefault();
      onSend();
    }}
  >
    <div className="flex gap-2">
      <label htmlFor={DOM_IDS.chatMessageInput} className="sr-only">
        {CHAT_CONFIG.inputLabel}
      </label>
      <input
        id={DOM_IDS.chatMessageInput}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={CHAT_CONFIG.inputPlaceholder}
        className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-base text-white placeholder-white/70 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 sm:text-sm"
      />
      <button
        type="submit"
        disabled={!value.trim() || isTyping}
        className="min-h-11 min-w-11 rounded-xl brand-gradient-interactive p-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 active:scale-[0.97]"
        aria-label={CHAT_CONFIG.sendButtonLabel}
      >
        <Icon name="send" className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  </form>
);

export default ChatComposer;
