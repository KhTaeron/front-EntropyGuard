// Minimum score required to accept a password
export const MIN_SCORE = 60;

// Service to estimate the strength of a password and return a score (0–100) along with improvement suggestions.
export function scorePassword(pwd, userHints = []) {
  pwd = (pwd || "").trim(); // removes whitespaces and invisible characters
  if (!pwd) return { score: 0, tips: ["Use a longer password."] };

  // Character set checks
  const len = [...pwd].length;
  const hasLower = /[a-z]/u.test(pwd);
  const hasUpper = /[A-Z]/u.test(pwd);
  const hasDigit = /\d/u.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/u.test(pwd);

  // Estimate alphabet size based on character diversity
  let alphabet = 0;
  if (hasLower) alphabet += 26;
  if (hasUpper) alphabet += 26;
  if (hasDigit) alphabet += 10;
  if (hasSymbol) alphabet += 33;

  // Approximate entropy in bits -> how hard it is to brute-force this password
  const entropyBits =
    alphabet > 0 ? len * (Math.log(alphabet) / Math.log(2)) : 0;
  // Normalize entropy into a score from 0 to 100
  const baseScore = Math.min(100, Math.round(entropyBits / 1.2));

  let penalty = 0;
  const lowerPwd = pwd.toLowerCase(); // lowercase to compare with the following sequences

  // Penalize common sequences (abcd, 1234, qwerty...)
  const sequences = [
    "abcdefghijklmnopqrstuvwxyz",
    "qwertyuiopasdfghjklzxcvbnm",
    "0123456789",
  ];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 3; i++) {
      const chunk = seq.slice(i, i + 4);
      if (
        lowerPwd.includes(chunk) ||
        lowerPwd.includes([...chunk].reverse().join(""))
      ) {
        penalty += 12;
      }
    }
  }
  // Penalize repeated characters (e.g. "aaa", "111")
  if (/(.)\1{2,}/u.test(pwd)) penalty += 10;

  // Penalize if the password contains parts of the user's info (email, username...)
  for (const hint of userHints) {
    const h = String(hint || "").toLowerCase();
    if (h && h.length >= 3 && lowerPwd.includes(h)) penalty += 15;
  }

  // Penalize very common passwords
  for (const bad of [
    "password",
    "azerty",
    "qwerty",
    "welcome",
    "admin",
    "letmein",
    "motdepasse",
  ]) {
    if (lowerPwd.includes(bad)) penalty += 25;
  }

  // Final score between 0 and 100
  const score = Math.max(0, Math.min(100, baseScore - penalty));

  // Suggestions for improvement
  const tips = [];
  if (len < 12) tips.push("Use at least 12 characters.");
  if (!(hasLower && hasUpper)) tips.push("Mix UPPER and lower case.");
  if (!hasDigit) tips.push("Add some digits.");
  if (!hasSymbol) tips.push("Add special characters.");
  if (penalty >= 10)
    tips.push("Avoid common patterns, sequences, or personal info.");

  return { score, tips };
}
