// Core matching algorithm: finds other users whose "teach" skills overlap
// with what the current user wants to "learn", AND who want to learn
// something the current user can teach (mutual swap potential).
//
// This is intentionally simple, rule-based logic (no ML/AI):
// 1. Build a set of skill names the current user wants to learn.
// 2. Build a set of skill names the current user can teach.
// 3. For every other user, check overlap in both directions.
// 4. Score = number of overlapping skill pairs (more overlap = better match).

const normalizeSkillName = (name) => name.trim().toLowerCase();

function findMatches(currentUser, allOtherUsers) {
  const iWantToLearn = new Set(
    currentUser.skills.filter((s) => s.type === "learn").map((s) => normalizeSkillName(s.name))
  );
  const iCanTeach = new Set(
    currentUser.skills.filter((s) => s.type === "teach").map((s) => normalizeSkillName(s.name))
  );

  const results = [];

  for (const other of allOtherUsers) {
    if (String(other._id) === String(currentUser._id)) continue;

    const theyCanTeach = other.skills.filter((s) => s.type === "teach");
    const theyWantToLearn = other.skills.filter((s) => s.type === "learn");

    // Skills they teach that I want to learn
    const theyTeachIWant = theyCanTeach.filter((s) => iWantToLearn.has(normalizeSkillName(s.name)));

    // Skills they want to learn that I can teach
    const iTeachTheyWant = theyWantToLearn.filter((s) => iCanTeach.has(normalizeSkillName(s.name)));

    // Only a real "swap" match if BOTH directions have at least one hit.
    if (theyTeachIWant.length > 0 && iTeachTheyWant.length > 0) {
      results.push({
        user: {
          id: other._id,
          name: other.name,
          city: other.city,
          averageRating: other.averageRating,
          badges: other.badges,
        },
        theyCanTeachMe: theyTeachIWant.map((s) => s.name),
        iCanTeachThem: iTeachTheyWant.map((s) => s.name),
        score: theyTeachIWant.length + iTeachTheyWant.length,
      });
    }
  }

  // Best matches first
  results.sort((a, b) => b.score - a.score);
  return results;
}

module.exports = { findMatches, normalizeSkillName };
