import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function SkillCard({ match, onRequestSwap, alreadyRequested }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-40, 40], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="card"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <h3>{match.user.name} {match.user.city ? `· ${match.user.city}` : ""}</h3>
      <p>⭐ {match.user.averageRating || "No ratings yet"}</p>
      {match.user.badges?.map((b) => (
        <span key={b} className="badge">{b}</span>
      ))}
      <p><strong>They can teach you:</strong> {match.theyCanTeachMe.join(", ")}</p>
      <p><strong>You can teach them:</strong> {match.iCanTeachThem.join(", ")}</p>
      {alreadyRequested ? (
        <button className="btn-outline" disabled>
          Request Sent
        </button>
      ) : (
        <button
          onClick={() =>
            onRequestSwap(match.user.id, match.iCanTeachThem[0], match.theyCanTeachMe[0])
          }
        >
          Request Swap
        </button>
      )}
    </motion.div>
  );
}