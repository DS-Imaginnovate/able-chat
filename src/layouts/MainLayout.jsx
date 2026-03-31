import React, { useState } from 'react';
import SidebarNav from '../components/Sidebar/SidebarNav';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <div className="flex h-screen sticky top-0 z-10">
        <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
