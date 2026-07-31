import api from "./axios";

export const submitSupportTicket = (formData) => {
  return api.post("/support", formData);
};
