import React, { useEffect, useRef } from "react";
import { Spin } from "antd";
import ReactMarkdown from 'react-markdown';
import { useAbleChat } from "../../context/AbleChatContext";
import sidebarLogo from "../../assets/sidebar-logo.png";

const ChatThread = ({ messages, sending }) => {
  const endRef = useRef(null);
  const { pendingUserMessage } = useAbleChat();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, pendingUserMessage]);

  if (!messages.length && !sending && !pendingUserMessage) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-6 space-y-8">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#5367c3] px-5 py-3 text-[14px] font-medium leading-relaxed text-white shadow-sm">
              {message.user_message}
            </div>
          </div>

          {/* Assistant Message */}
          <div className="flex justify-start items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                <img src={sidebarLogo} alt="Able AI" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-slate-200 bg-white px-6 py-5 text-[15px] leading-relaxed text-slate-700 shadow-sm">
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                }}
              >
                {message.assistant_message}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      {/* Optimistic User Message */}
      {pendingUserMessage && (
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-3xl rounded-br-md bg-[#5367c3] px-5 py-3 text-[14px] font-medium leading-relaxed text-white shadow-sm opacity-70">
            {pendingUserMessage}
          </div>
        </div>
      )}

      {sending && (
        <div className="flex justify-start items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1 shadow-sm">
              <img src={sidebarLogo} alt="Able AI" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl rounded-bl-md border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm animate-pulse">
            <Spin size="small" />
            Able is thinking...
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default ChatThread;
