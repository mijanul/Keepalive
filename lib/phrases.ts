const PHRASES = [
  "The sanctum is still standing.",
  "Wong checked the wards. All clear.",
  "A portal opened, then closed. Nothing to see.",
  "Render did not fall asleep this time.",
  "The Time Stone says the API is awake.",
  "Strange pinged the health rune successfully.",
  "Kamar-Taj reports the backend is breathing.",
  "No demons in the logs today.",
  "The cloak of levitation fetched /health.",
  "Multiverse status: one universe, one warm server.",
];

export function randomNote(): { text: string; filename: string } {
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 8);
  return {
    text: `${phrase}\n\nwritten_at=${now.toISOString()}\n`,
    filename: `notes/${stamp}-${suffix}.txt`,
  };
}
