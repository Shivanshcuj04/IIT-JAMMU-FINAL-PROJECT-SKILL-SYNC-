import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <h1>SkillSync</h1>
      <p>Trade what you know for what you want to learn — no money involved.</p>
      <Link to="/register"><button>Get Started</button></Link>
    </div>
  );
}
