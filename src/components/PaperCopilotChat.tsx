import React, { useRef, useEffect } from 'react';
import { Paper, ChatMessage, SystemStatus } from '../api.js';
import { Sparkles, Send, X, Bot } from 'lucide-react';

interface PaperCopilotChatProps {
  paper: Paper;
  chatMessages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: (preset?: string) => void;
  isAiThinking: boolean;
  systemStatus: SystemStatus | null;
  onClose?: () => void;
  inDrawer?: boolean;
}

export const PaperCopilotChat: React.FC<PaperCopilotChatProps> = ({
  paper,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendChat,
  isAiThinking,
  systemStatus,
  onClose,
  inDrawer = false,
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  return (
    <div className={`bg-white flex flex-col overflow-hidden h-full ${
      inDrawer ? 'h-full' : 'rounded-2xl border border-[#E8E6E0] shadow-xs'
    }`}>
      {/* Header */}
      <div className="p-3.5 border-b border-[#E8E6E0] bg-[#F8F7F3] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EFF4F0] flex items-center justify-center text-[#354D43]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#252B3A] leading-tight">ResearchMate AI Copilot</h3>
            <p className="text-[10px] text-[#737B89] font-mono">
              {systemStatus?.geminiConfigured ? 'Gemini 2.5 Flash Grounded' : 'Local Academic Engine'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EFF4F0] text-[#354D43] font-semibold hidden sm:inline-block">
            Grounded Q&A
          </span>
          {inDrawer && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#737B89] hover:text-[#252B3A] hover:bg-[#E8E6E0] transition cursor-pointer"
              title="Close Copilot Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F7F3]/40 min-h-[320px]">
        {chatMessages.length === 0 && (
          <div className="p-4 bg-white rounded-2xl border border-[#E8E6E0] text-xs text-[#737B89] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#252B3A]">
              <Bot className="w-4 h-4 text-[#354D43]" />
              <span>Academic Copilot Ready</span>
            </div>
            <p className="leading-relaxed">
              I have indexed <strong className="text-[#252B3A]">"{paper.title}"</strong>. Ask me to synthesize methodology, extract benchmark statistics, flag limitations, or generate citations.
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#354D43] text-white rounded-br-none font-medium shadow-2xs'
                  : 'bg-white text-[#252B3A] border border-[#E8E6E0] rounded-bl-none shadow-2xs'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div className="whitespace-pre-wrap space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8FA998]" /> Grounded In Document
                  </div>
                  <div className="leading-relaxed text-[#252B3A]">{msg.message}</div>
                </div>
              ) : (
                <div>{msg.message}</div>
              )}
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E8E6E0] rounded-2xl p-3 text-xs text-[#737B89] flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8FA998] animate-ping"></span>
              <span>Synthesizing grounded response...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3.5 py-2.5 bg-[#F8F7F3] border-t border-[#E8E6E0] flex gap-1.5 overflow-x-auto shrink-0">
        {[
          'Explain methodology in simple terms',
          'Extract key empirical findings',
          'What are the major limitations?',
          'Generate formatted BibTeX entry',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSendChat(prompt)}
            className="text-[10px] bg-white border border-[#E8E6E0] hover:border-[#8FA998] hover:text-[#354D43] px-2.5 py-1.5 rounded-lg whitespace-nowrap text-[#737B89] transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-white border-t border-[#E8E6E0] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendChat();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onChatInputChange(e.target.value)}
            placeholder="Ask question grounded in this paper..."
            className="flex-1 bg-[#F8F7F3] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6E0] text-[#252B3A] placeholder-[#737B89] focus:bg-white focus:outline-hidden focus:border-[#8FA998] focus:ring-2 focus:ring-[#8FA998]/15 transition-all"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isAiThinking}
            className="p-2.5 bg-[#354D43] hover:bg-[#2A3E36] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
