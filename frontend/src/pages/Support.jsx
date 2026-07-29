import React, { useState } from "react";
import FAQAccordion from "../components/FAQAccordion";
import SupportContactForm from "../components/SupportContactForm";
import faqs from "../data/faqs";

const SUPPORT_EMAIL = "support@skillsync.app"; // adjust to your real address

export default function Support() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail silently on some browsers/permissions —
      // not worth surfacing an error for a copy-to-clipboard nicety.
    }
  };

  return (
    <div className="container">
      <h1>Help desk</h1>
      <p>
        Pinned answers to the questions people ask most, and a direct line
        to us for everything else.
      </p>

      <h2 style={{ marginTop: "40px" }}>Frequently asked</h2>
      <FAQAccordion items={faqs} />

      <h2 style={{ marginTop: "48px" }}>Still stuck?</h2>
      <p style={{ marginBottom: "16px" }}>
        Send us a note below, or{" "}
        <button type="button" className="btn-outline inline-copy-btn" onClick={handleCopyEmail}>
          {copied ? "Copied!" : SUPPORT_EMAIL}
        </button>{" "}
        directly.
      </p>

      <div className="card" style={{ maxWidth: "460px" }}>
        <SupportContactForm />
      </div>
    </div>
  );
}
