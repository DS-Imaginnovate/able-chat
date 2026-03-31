import React, { useMemo, useState } from 'react';
import { Dropdown, Avatar, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  PushpinOutlined,
  DeleteOutlined,
  SettingOutlined,
  CaretDownOutlined,
  LogoutOutlined,
  HistoryOutlined,
  LayoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import sidebarLogo from '../../assets/sidebar-logo.png';
import { useAuth } from '../../context/AuthContext';
import { useAbleChat } from '../../context/AbleChatContext';

const SidebarNav = ({ collapsed, setCollapsed }) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sessions, currentSessionId, selectSession, startNewChat, loadingHistory } = useAbleChat();

  const userDisplayName = useMemo(() => {
    if (!user) {
      return 'User';
    }

    return (
      user.email ||
      'User'
    );
  }, [user]);

  const handleSettingsMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const settingsMenu = {
    items: [
      { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
    ],
    onClick: handleSettingsMenuClick,
  };

  const contextMenuItems = {
    items: [
      { key: 'rename', label: 'Rename', icon: <EditOutlined /> },
      { key: 'pin', label: 'Pin', icon: <PushpinOutlined /> },
      { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
    ]
  };

  if (collapsed) {
    return (
      <div className="h-screen w-16 flex flex-col items-center bg-[#f8f9fb] border-r border-slate-200 py-4 transition-all duration-300 select-none group/sidebar">
        {/* Top Section */}
        <div className="w-full mb-6 relative h-10 flex items-center justify-center">
          <img src={sidebarLogo} alt="Logo" className="w-7 h-7" />
          <Tooltip 
            title="Click here to expand" 
            placement="bottom"
            color="#1e293b"
            overlayInnerStyle={{ color: '#ffffff', fontSize: '12px', padding: '6px 10px' }}
          >
            <button
              onClick={() => setCollapsed(false)}
              className="absolute z-20 w-8 h-8 flex items-center justify-center bg-[#5367c3] rounded-full text-white opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 hover:bg-[#4352a5] shadow-[0_2px_8px_rgba(83,103,195,0.3)] border-2 border-white -right-4"
            >
              <div className="w-[16px] h-[14px] border-2 border-white rounded-[3px] relative">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-white opacity-80" />
              </div>
            </button>
          </Tooltip>
        </div>


        {/* Navigation Rail */}
        <div className="flex-1 flex flex-col items-center gap-5 w-full">
          <PlusOutlined
            className="text-xl text-slate-400 hover:text-slate-600 cursor-pointer"
            onClick={startNewChat}
          />

          <div className="relative group">
            <HistoryOutlined className="text-xl text-slate-400 hover:text-slate-600 cursor-pointer" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8f9fb]" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <Dropdown menu={settingsMenu} trigger={['click']} placement="topRight">
            <SettingOutlined className="text-xl text-slate-400 hover:text-slate-600 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-all" />
          </Dropdown>
          <div className="p-0.5 border-2 border-[#5367c3] rounded-full">
            <Avatar
              icon={<UserOutlined />}
              size={34}
              className="cursor-pointer bg-slate-200 text-slate-500"
              alt={userDisplayName}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-[240px] flex flex-col bg-white border-r border-slate-100 transition-all duration-300 select-none flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50 min-h-[64px]">
        <div className="flex items-center gap-2">
          <img src={sidebarLogo} alt="Logo" className="w-6 h-6" />
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="group/btn w-8 h-8 flex items-center justify-center transition-all p-1"
          title="Collapse sidebar"
        >
          <div className="w-[18px] h-[14px] border-2 border-[#5367c3] rounded-[3px] relative overflow-hidden group-hover/btn:border-[#4352a5]">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#5367c3] group-hover/btn:bg-[#4352a5]" />
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <NavItem icon={<PlusOutlined />} label="New chat" onClick={startNewChat} />

        {/* History Section */}
        <div className="pt-4">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center gap-1 px-3 py-1 w-full text-left mb-1"
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              History
            </span>
            <CaretDownOutlined
              className={`text-[9px] text-slate-400 ml-0.5 transition-transform ${historyOpen ? '' : '-rotate-90'
                }`}
            />
          </button>
          {historyOpen && (
            <>
              {loadingHistory && sessions.length === 0 ? (
                <div className="space-y-2 px-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="h-8 w-full rounded-lg animate-shimmer" />
                  ))}
                </div>
              ) : (
                sessions.map((item) => (
                  <div
                    key={item.session_id}
                    onClick={() => selectSession(item.session_id)}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${currentSessionId === item.session_id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span className="text-sm truncate pr-2 flex-1">{item.title}</span>
                    {/* <Dropdown menu={contextMenuItems} trigger={['click']}>
                      <button
                        className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 flex items-center justify-center rounded hover:bg-slate-200 transition-all flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreOutlined className="text-slate-500 text-base" />
                      </button>
                    </Dropdown> */}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-3 py-3">
        <Dropdown menu={settingsMenu} trigger={['click']} placement="topRight">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
            <SettingOutlined className="text-slate-400 text-base group-hover:text-slate-600 transition-colors" />
            <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
              Settings
            </span>
          </div>
        </Dropdown>
        <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <Avatar
            icon={<UserOutlined />}
            size={26}
            className="border border-slate-200 bg-slate-100 text-slate-500 flex-shrink-0"
            alt={userDisplayName}
          />
          <span className="text-sm text-slate-600 font-medium truncate">
            {userDisplayName}
          </span>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
  >
    <span className="text-base flex-shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors">
      {icon}
    </span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default SidebarNav;
