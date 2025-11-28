"use client";
//AI Used also got it from 21st.dev
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Command, Paperclip, SendIcon, XIcon, LoaderIcon, MonitorIcon, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  placeholder?: string;
  onSend?: (text: string, command?: string) => void;
}

export default function AnimatedChatInput({ placeholder = "Ask a question...", onSend }: Props) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const commandSuggestions = [
    { icon: <MonitorIcon className="w-4 h-4" />, label: "Assistant", prefix: "/assist" },
    { icon: <BrainCircuit className="w-4 h-4" />, label: "Reasoning", prefix: "/reason" },
  ];

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const idx = commandSuggestions.findIndex((c) => c.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((p) => (p < commandSuggestions.length - 1 ? p + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((p) => (p > 0 ? p - 1 : commandSuggestions.length - 1));
      } else if (e.key === "Tab" || e.key === "Enter") {
        if (activeSuggestion >= 0) {
          e.preventDefault();
          const sel = commandSuggestions[activeSuggestion];
          setValue(sel.prefix + " ");
          setShowCommandPalette(false);
          setRecentCommand(sel.label);
          setTimeout(() => setRecentCommand(null), 2000);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) doSend();
    }
  };

  const doSend = () => {
    if (!value.trim()) return;
    const text = value.trim();
    // detect command prefix (optional)
    const firstWord = text.split(/\s+/)[0];
    const isCommand = commandSuggestions.some((c) => c.prefix === firstWord);
    const command = isCommand ? firstWord : undefined;

    // local typing UI
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 300); // small UI pulse

    // call parent
    if (onSend) onSend(text, command);

    // clear input
    setValue("");
  };

  const handleAttachFile = () => {
    const name = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((p) => [...p, name]);
  };

  const removeAttachment = (idx: number) => setAttachments((p) => p.filter((_, i) => i !== idx));

  const selectSuggestion = (i: number) => {
    const s = commandSuggestions[i];
    setValue(s.prefix + " ");
    setShowCommandPalette(false);
    setRecentCommand(s.label);
    setTimeout(() => setRecentCommand(null), 2000);
  };

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 bottom-full mb-2 backdrop-blur-xl bg-[#041228]/95 rounded-lg z-40 shadow-lg border border-white/10 overflow-hidden"
          >
            <div className="py-1">
              {commandSuggestions.map((s, i) => (
                <div
                  key={s.prefix}
                  onClick={() => selectSuggestion(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs cursor-pointer select-none",
                    activeSuggestion === i ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-white/60">{s.icon}</div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-white/40 text-xs ml-1">{s.prefix}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 py-2 resize-none bg-transparent text-white/90 text-sm min-h-[64px]",
            "border border-zinc-700 rounded-md",
            "focus:border-zinc-700 focus:ring-0 focus-visible:ring-0"
          )}
        />
      </div>

      <AnimatePresence>
        {attachments.length > 0 && (
          <div className="px-3 pb-2 flex gap-2 flex-wrap">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70">
                <span>{a}</span>
                <button onClick={() => removeAttachment(i)} className="text-white/40 hover:text-white transition-colors">
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="p-3 border-t border-white/[0.04] flex items-center justify-between gap-4 bg-transparent">
        <div className="flex items-center gap-3">
          <motion.button type="button" onClick={handleAttachFile} whileTap={{ scale: 0.94 }} className="p-2 text-white/40 hover:text-white/90 rounded-lg">
            <Paperclip className="w-4 h-4" />
          </motion.button>

          <motion.button data-command-button type="button" onClick={() => setShowCommandPalette((p) => !p)} whileTap={{ scale: 0.94 }} className="p-2 text-white/40 hover:text-white/90 rounded-lg">
            <Command className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.button type="button" onClick={doSend} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={!value.trim()} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", value.trim() ? "bg-white text-black" : "bg-white/[0.05] text-white/40")}>
          <SendIcon className="w-4 h-4" />
          <span>Send</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {recentCommand && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-3 top-0 translate-y-[-140%] bg-white/[0.03] px-3 py-1 rounded-md text-xs text-white/80">
            {recentCommand}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
