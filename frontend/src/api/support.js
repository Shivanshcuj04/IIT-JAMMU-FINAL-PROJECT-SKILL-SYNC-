// Adjust this import to match however your existing axios instance is
// exported from src/api/axios.js — e.g. `import api from "./axios";`
// or `import { api } from "./axios";` depending on your setup.
import api from "./axios";

export const submitSupportTicket = (formData) => {
  return api.post("/api/support", formData);
};
