import api from "./axios";

export const scheduleSession = (data) => api.post("/sessions", data);
export const getMySessions = () => api.get("/sessions/me");
export const updateSessionNotes = (id, data) => api.put(`/sessions/${id}/notes`, data);
export const completeSession = (id) => api.put(`/sessions/${id}/complete`);
