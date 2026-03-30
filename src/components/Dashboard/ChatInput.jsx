import React, { useState } from 'react';
import { Button, message } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useAbleChat } from '../../context/AbleChatContext';

const ChatInput = () => {
  const [value, setValue] = useState('');
  const { sendMessage, sending } = useAbleChat();

  const handleSubmit = async () => {
    if (!value.trim() || sending) {
      return;
    }

    const nextValue = value;
    setValue('');

    try {
      await sendMessage(nextValue);
    } catch (error) {
      setValue(nextValue);
      const errorMessage =
        error?.response?.data?.detail?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to send message';
      message.error(String(errorMessage));
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-6 relative group">
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow group-focus-within:ring-2 ring-blue-500/20 px-4 pt-3 pb-2 pr-2">
        <textarea
          rows={1}
          placeholder="I'm FleetEnable's AI logistics copilot"
          className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none text-slate-700 min-h-[44px] pt-1 px-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="flex justify-end">
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            size="large"
            disabled={!value.trim() || sending}
            loading={sending}
            onClick={handleSubmit}
            className={`${value.trim()
              ? 'bg-blue-600 border-blue-600'
              : 'bg-slate-100 border-slate-100 text-slate-300'
              } flex items-center justify-center transition-all duration-200 shadow-sm`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
