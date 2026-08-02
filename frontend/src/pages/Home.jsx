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

export default function Home() {
  return (
    <div className="container">
      <motion.div className="hero" variants={stagger} initial="hidden" animate="show">
        <motion.div className="hero-copy" variants={fadeUp}>
          <h1>SkillSync</h1>
          <p>Trade what you know for what you want to learn — no money involved.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Get Started
            </motion.button>
          </Link>
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

      <motion.div
        className="match-grid"
        style={{ marginTop: "64px" }}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="card" variants={fadeUp}>
          <h3>Find your match</h3>
          <p>Add what you can teach and what you want to learn — SkillSync's matching finds people whose skills complement yours.</p>
        </motion.div>
        <motion.div className="card" variants={fadeUp}>
          <h3>Chat and schedule</h3>
          <p>Message your match directly, share files or a video link, and lock in a session time.</p>
        </motion.div>
        <motion.div className="card" variants={fadeUp}>
          <h3>Learn and earn badges</h3>
          <p>Complete sessions, collect reviews, and unlock badges as you teach and learn.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}