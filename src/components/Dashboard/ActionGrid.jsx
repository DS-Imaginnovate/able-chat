import React from 'react';
import {
  AppstoreAddOutlined,
  FileSearchOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useAbleChat } from '../../context/AbleChatContext';

const ActionGrid = () => {
  const { sendMessage } = useAbleChat();
  const actions = [
    {
      title: 'Create orders',
      icon: <AppstoreAddOutlined className="text-blue-500" />,
      prompt: 'Help me create orders from the documents I have uploaded in FleetEnable.',
    },
    {
      title: 'Upload documents',
      icon: <FileSearchOutlined className="text-indigo-500" />,
      prompt: 'Explain how I should upload logistics documents into FleetEnable and what formats are supported.',
    },
    {
      title: 'Generate report',
      icon: <LineChartOutlined className="text-purple-500" />,
      prompt: 'Help me understand what reports I can generate for logistics operations in FleetEnable.',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => sendMessage(action.prompt)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold text-slate-700 active:scale-95 shadow-sm"
        >
          <span className="text-lg flex items-center">{action.icon}</span>
          {action.title}
        </button>
      ))}
    </div>
  );
};

export default ActionGrid;
