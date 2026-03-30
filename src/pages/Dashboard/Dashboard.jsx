import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import HeroHeader from '../../components/Dashboard/HeroHeader';
import ChatInput from '../../components/Dashboard/ChatInput';
import ChatThread from '../../components/Dashboard/ChatThread';
import { useAbleChat } from '../../context/AbleChatContext';

const Dashboard = () => {
  const { messages, sending, pendingUserMessage } = useAbleChat();
  const hasMessages = messages.length > 0 || !!pendingUserMessage;

  return (
    <MainLayout>
      <div className="flex flex-col h-screen bg-white">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {!hasMessages && <HeroHeader />}
          <div className="max-w-4xl mx-auto w-full">
            <ChatThread messages={messages} sending={sending} />
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="w-full bg-white border-t border-slate-50 pt-4 pb-8">
          <ChatInput />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
