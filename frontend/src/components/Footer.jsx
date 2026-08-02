import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="topbar-brand-mark">⇄</span>
          <div>
            <strong>SkillSync</strong>
            <p>Teach what you know. Learn what you don't.</p>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/support">Support</Link>
          
            href="https://github.com/Shivanshcuj04/IIT-JAMMU-FINAL-PROJECT-SKILL-SYNC-"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
      <p className="footer-copyright">© {year} SkillSync — IIT Jammu MERN Capstone Project</p>
    </footer>
  );
}