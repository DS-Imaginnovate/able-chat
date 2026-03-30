import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchAbleChatHistory, sendAbleChatMessage } from "../services/ableChatApi";
import { useAuth } from "./AuthContext";

const AbleChatContext = createContext(undefined);

export function AbleChatProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSessions([]);
      setCurrentSessionId(null);
      return;
    }

    loadHistory();
  }, [isAuthenticated]);

  async function loadHistory() {
    setLoadingHistory(true);

    try {
      const data = await fetchAbleChatHistory();
      const nextSessions = data?.sessions || [];
      setSessions(nextSessions);
      setCurrentSessionId((current) => {
        if (current && nextSessions.some((session) => session.session_id === current)) {
          return current;
        }
        return nextSessions[0]?.session_id || null;
      });
    } finally {
      setLoadingHistory(false);
    }
  }

  async function sendMessage(messageText) {
    if (!messageText?.trim()) {
      return null;
    }

    setPendingUserMessage(messageText.trim());
    setSending(true);
    try {
      const response = await sendAbleChatMessage({
        message: messageText.trim(),
        session_id: currentSessionId,
      });

      await loadHistory();
      if (response?.session_id) {
        setCurrentSessionId(response.session_id);
      }
      return response;
    } finally {
      setSending(false);
      setPendingUserMessage(null);
    }
  }

  function selectSession(sessionId) {
    setCurrentSessionId(sessionId);
  }

  function startNewChat() {
    setCurrentSessionId(null);
  }

  const currentSession =
    sessions.find((session) => session.session_id === currentSessionId) || null;

  const messages = currentSession?.messages || [];

  const value = useMemo(
    () => ({
      sessions,
      currentSession,
      currentSessionId,
      messages,
      loadingHistory,
      sending,
      pendingUserMessage,
      loadHistory,
      sendMessage,
      selectSession,
      startNewChat,
    }),
    [sessions, currentSession, currentSessionId, messages, loadingHistory, sending, pendingUserMessage]
  );

  return (
    <AbleChatContext.Provider value={value}>
      {children}
    </AbleChatContext.Provider>
  );
}

export function useAbleChat() {
  const context = useContext(AbleChatContext);

  if (!context) {
    throw new Error("useAbleChat must be used within AbleChatProvider");
  }

  return context;
}

