import api from "./axios";

export const leaveReview = (data) => api.post("/reviews", data);
export const getReviewsForUser = (userId) => api.get(`/reviews/user/${userId}`);
