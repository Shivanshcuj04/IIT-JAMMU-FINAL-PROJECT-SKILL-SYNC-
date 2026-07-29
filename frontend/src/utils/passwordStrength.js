// Simple client-side heuristic — not a security check, just UX feedback
// to nudge people toward a stronger password before they submit.
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Too short", "Weak", "Okay", "Strong", "Very strong"];
  const clamped = Math.min(score, 4);
  return { score: clamped, label: labels[clamped] };
}