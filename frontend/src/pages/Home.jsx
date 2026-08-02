import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const STEPS = [
  { n: "01", title: "Create your profile", desc: "Sign up and list the skills you can teach and the ones you want to learn." },
  { n: "02", title: "Get matched", desc: "Our matching engine pairs you with people whose skills complement yours." },
  { n: "03", title: "Chat & schedule", desc: "Message your match, share files or links, and lock in a session time." },
  { n: "04", title: "Teach, learn, grow", desc: "Complete sessions, leave reviews, and earn badges as you go." },
];

const FEATURES = [
  { icon: "⇄", title: "Skill matching", desc: "Add what you offer and what you want — get paired with people who complement you." },
  { icon: "💬", title: "Direct chat", desc: "Message your match, share YouTube/Drive links, or swap contact info." },
  { icon: "📎", title: "File sharing", desc: "Send images, PDFs, and documents right inside the chat." },
  { icon: "📅", title: "Session scheduling", desc: "Set up a session with a matched partner and track it through completion." },
  { icon: "★", title: "Ratings & reviews", desc: "Rate each other after a session and build a visible track record." },
  { icon: "🏅", title: "Badges", desc: "Unlock badges as you complete sessions and collect reviews." },
];

export default function Home() {
  return (
    <div className="container">
      <motion.div className="hero" variants={stagger} initial="hidden" animate="show">
        <motion.div className="hero-copy" variants={fadeUp}>
          <h1>SkillSync</h1>
          <p>Trade what you know for what you want to learn — no money involved.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Get Started
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Features
              </motion.button>
            </a>
          </div>
        </motion.div>

        <motion.div className="swap-demo" variants={fadeUp} aria-hidden="true">
          <div className="card">
            <h3>Guitar</h3>
            <span className="badge badge-offer">Teach</span>
          </div>
          <span className="swap-arrow">⇄</span>
          <div className="card">
            <h3>Spanish</h3>
            <span className="badge badge-seek">Learn</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.section
        id="how-it-works"
        className="how-it-works"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 variants={fadeUp}>How SkillSync works</motion.h2>
        <motion.p variants={fadeUp}>Four steps from sign-up to your first session.</motion.p>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <motion.div className="step-card" key={step.n} variants={fadeUp}>
              <div className="step-number">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="features"
        className="features-section"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.h2 variants={fadeUp}>Everything you need to swap skills</motion.h2>
        <motion.p variants={fadeUp}>No AI, no fees — just a straightforward way to trade what you know.</motion.p>
        <div className="match-grid">
          {FEATURES.map((f) => (
            <motion.div className="card feature-card" key={f.title} variants={fadeUp}>
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}