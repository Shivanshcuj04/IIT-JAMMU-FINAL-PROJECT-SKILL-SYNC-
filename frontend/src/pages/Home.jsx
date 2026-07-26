import { Link } from "react-router-dom";

const teaches = ["PYTHON", "GUITAR", "EXCEL"];
const learns = ["SPANISH", "UI DESIGN", "PUBLIC SPEAKING"];

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero container">
        <p className="home-eyebrow">Peer-to-peer learning</p>
        <h1 className="home-title">SkillSync</h1>
        <p className="home-subhead">
          Trade what you know for what you want to learn — no money involved.
        </p>

        <div className="home-cta-row">
          <Link to="/register"><button>Get started</button></Link>
          <a href="#how-it-works" className="home-secondary-cta">See how it works ↓</a>
        </div>

        <div className="swap-ticket" aria-hidden="false">
          <div className="swap-ticket-hole swap-ticket-hole-left" />
          <div className="swap-ticket-hole swap-ticket-hole-right" />

          <div className="swap-ticket-col">
            <span className="swap-ticket-label">You teach</span>
            <div className="swap-ticket-tags">
              {teaches.map((t) => (
                <span className="badge swap-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="swap-ticket-divider">
            <span className="swap-ticket-arrow">⇄</span>
            <span className="swap-ticket-code">SWAP&nbsp;№001</span>
          </div>

          <div className="swap-ticket-col">
            <span className="swap-ticket-label">You learn</span>
            <div className="swap-ticket-tags">
              {learns.map((t) => (
                <span className="badge swap-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-process container" id="how-it-works">
        <ol className="process-list">
          <li className="process-row">
            <span className="process-num">01</span>
            <div>
              <h3 className="process-title">List your skills</h3>
              <p className="process-copy">Add what you can teach and what you're hoping to learn.</p>
            </div>
          </li>
          <li className="process-row">
            <span className="process-num">02</span>
            <div>
              <h3 className="process-title">Get matched</h3>
              <p className="process-copy">We only surface swaps where both sides' needs actually line up.</p>
            </div>
          </li>
          <li className="process-row">
            <span className="process-num">03</span>
            <div>
              <h3 className="process-title">Meet &amp; swap</h3>
              <p className="process-copy">Schedule a session, teach each other, leave a review.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}