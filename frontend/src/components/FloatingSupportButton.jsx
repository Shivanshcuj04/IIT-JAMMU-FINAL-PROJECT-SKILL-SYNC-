import React, { useState } from "react";
import { Link } from "react-router-dom";
import faqs from "../data/faqs";

// Only surface the two most common questions here — the fab is a
// shortcut, not a replacement for the full Support page.
const QUICK_FAQS = faqs.slice(0, 2);

export default function FloatingSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="support-panel-backdrop" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div className="support-panel" role="dialog" aria-label="Quick help">
          <div className="support-panel-header">
            <strong>Need a hand?</strong>
            <button
              type="button"
              className="support-panel-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="support-panel-body">
            {QUICK_FAQS.map((item) => (
              <div key={item.question} className="support-panel-faq">
                <p className="support-panel-question">{item.question}</p>
                <p className="support-panel-answer">{item.answer}</p>
              </div>
            ))}
          </div>

          <Link to="/support" className="support-panel-link" onClick={() => setOpen(false)}>
            Go to Help Desk →
          </Link>
        </div>
      )}

      <button
        type="button"
        className="support-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Open help"
      >
        {open ? "×" : "?"}
      </button>
    </>
  );
}
