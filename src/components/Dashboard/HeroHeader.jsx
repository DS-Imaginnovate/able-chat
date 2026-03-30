import React from 'react';
import ableLogo from '../../assets/able-logo.png';
import { useAuth } from '../../context/AuthContext';
import { useAbleChat } from '../../context/AbleChatContext';

const HeroHeader = () => {
  const { user } = useAuth();
  const { startNewChat, currentSession } = useAbleChat();
  const displayName =
    user?.first_name + ' ' + user?.last_name || 'there';

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-8 select-none">
      {/* Brand Logo - use the full combined logo image */}
      <div className="mb-12">
        <img src={ableLogo} alt="able" className="h-12 w-auto" />
      </div>

      {/* Greeting */}
      <div className="text-center space-y-1">
        <p className="text-sm font-normal text-slate-500 tracking-wide">
          Hi {displayName}!
        </p>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Ask me anything about fleetenable
        </h2>
      </div>

    </div>
  );
};

export default HeroHeader;
