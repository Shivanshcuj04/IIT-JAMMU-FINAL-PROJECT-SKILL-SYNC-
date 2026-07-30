export default function SkillCard({ match, onRequestSwap }) {
  return (
    <div className="card">
      <h3>{match.user.name} {match.user.city ? `· ${match.user.city}` : ""}</h3>
      <p>⭐ {match.user.averageRating || "No ratings yet"}</p>
      {match.user.badges?.map((b) => (
        <span key={b} className="badge">{b}</span>
      ))}
      <p><strong>They can teach you:</strong> {match.theyCanTeachMe.join(", ")}</p>
      <p><strong>You can teach them:</strong> {match.iCanTeachThem.join(", ")}</p>
      <button
        onClick={() =>
          onRequestSwap(match.user.id, match.iCanTeachThem[0], match.theyCanTeachMe[0])
        }
      >
        Request Swap
      </button>
    </div>
  );
}
