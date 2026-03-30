import { authApi } from "./authApi";

export async function fetchAbleChatHistory(params = {}) {
  const response = await authApi.get("/api/able/chat/history", {
    params: {
      limit_sessions: params.limitSessions ?? 20,
      limit_messages: params.limitMessages ?? 50,
    },
  });

  return response.data;
}

export async function sendAbleChatMessage(payload) {
  const response = await authApi.post("/api/able/chat", payload);
  return response.data;
}

