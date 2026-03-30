import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AbleChatProvider } from './context/AbleChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b5bdb',
          colorBgBase: '#ffffff',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBgLayout: '#ffffff',
          colorBgSpotlight: '#ffffff',
          colorBgMask: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
        components: {
          Layout: {
            bodyBg: '#ffffff',
            siderBg: '#ffffff',
            headerBg: '#ffffff',
          },
          Dropdown: {
            borderRadiusLG: 12,
          },
        },
      }}
    >
      <AuthProvider>
        <AbleChatProvider>
          <App />
        </AbleChatProvider>
      </AuthProvider>
    </ConfigProvider>
  </StrictMode>,
)
