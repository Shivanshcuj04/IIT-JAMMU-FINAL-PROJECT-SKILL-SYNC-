import React, { useState } from "react";

export default function FAQAccordion({ items }) {
  // Multiple items can be open at once — each note is independent, the
  // way pinned cards on a real board don't force each other shut.
  const [openIndexes, setOpenIndexes] = useState(new Set());

  const toggle = (index) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        return (
          <div
            key={item.question}
            className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
          >
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <span className="faq-caret" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className="faq-answer" hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
