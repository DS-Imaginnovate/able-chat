import React, { useState } from 'react';
import { Dropdown } from 'antd';
import {
  AudioOutlined,
  PlusOutlined,
  DownOutlined,
  ThunderboltOutlined,
  StarOutlined,
  ControlOutlined
} from '@ant-design/icons';

const ChatSearchBar = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const toolItems = {
    items: [
      { key: '1', label: 'AI Analyst', icon: <ThunderboltOutlined className="text-blue-500" /> },
      { key: '2', label: 'Assistant', icon: <StarOutlined className="text-purple-500" /> },
      { key: '3', label: 'Custom Tool', icon: <ControlOutlined className="text-slate-400" /> },
    ]
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-6">
      <div
        className={`bg-white border rounded-2xl px-5 py-4 flex flex-col gap-3 transition-all duration-200 ${
          focused
            ? 'border-slate-300 shadow-[0_2px_20px_rgba(0,0,0,0.09)]'
            : 'border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Input */}
        <div className="flex items-start justify-between gap-3">
          <textarea
            rows={2}
            placeholder="Create orders for me"
            className="flex-1 bg-transparent border-none resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 leading-relaxed"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <button className="flex-shrink-0 text-[#f59e0b] hover:text-[#d97706] hover:scale-110 transition-all cursor-pointer p-1 mt-0.5">
            <AudioOutlined className="text-xl" />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2.5">
          <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0">
            <PlusOutlined className="text-xs text-slate-500" />
          </button>
          <Dropdown menu={toolItems} trigger={['click']}>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium text-slate-600 cursor-pointer">
              Tools <DownOutlined className="text-[8px] text-slate-400" />
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default ChatSearchBar;
