import React, { useState } from "react";
import { submitSupportTicket } from "../api/support";

const MAX_MESSAGE_LENGTH = 1000;

const emptyForm = { name: "", email: "", subject: "", message: "" };

export default function SupportContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const res = await submitSupportTicket(form);
      setStatus({
        type: "success",
        text: res.data?.message || "Your message has been sent.",
      });
      setForm(emptyForm);
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong sending your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="support-name">Name</label>
      <input
        id="support-name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="support-email">Email</label>
      <input
        id="support-email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="support-subject">Subject</label>
      <input
        id="support-subject"
        name="subject"
        type="text"
        value={form.subject}
        onChange={handleChange}
        required
      />

      <label htmlFor="support-message">
        Message
        <span className="char-counter">
          {form.message.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </label>
      <textarea
        id="support-message"
        name="message"
        value={form.message}
        onChange={handleChange}
        required
      />

      {status && (
        <p
          className={
            status.type === "success" ? "status-message" : "status-message status-error"
          }
        >
          {status.text}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
