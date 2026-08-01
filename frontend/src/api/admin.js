import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats").then((r) => r.data);

export const getAdminUsers = (params = {}) =>
  api.get("/admin/users", { params }).then((r) => r.data);

export const getUserReports = (userId) =>
  api.get(`/admin/users/${userId}/reports`).then((r) => r.data);

export const blockUser = (userId) =>
  api.put(`/admin/users/${userId}/block`).then((r) => r.data);

export const unblockUser = (userId) =>
  api.put(`/admin/users/${userId}/unblock`).then((r) => r.data);

export const verifySkill = (userId, skillId) =>
  api.put(`/admin/users/${userId}/skills/${skillId}/verify`).then((r) => r.data);

export const getAdminSessions = (params = {}) =>
  api.get("/admin/sessions", { params }).then((r) => r.data);
