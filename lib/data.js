// Shared constants mirrored from the database's `categories` and `badges` tables.
// Kept here too so pages can render category pills/labels without an extra fetch.

export const CATEGORIES = [
  { id: "corporate", label: "Corporate" },
  { id: "banking", label: "Banking & Finance" },
  { id: "pe", label: "Private Equity" },
  { id: "capitalmarkets", label: "Capital Markets" },
  { id: "realestate", label: "Real Estate" },
  { id: "competition", label: "Competition" },
  { id: "technology", label: "Technology" },
  { id: "disputeresolution", label: "Dispute Resolution" },
];

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

export const BADGES = [
  { id: "first-step", name: "First Step", desc: "Made your first contribution" },
  { id: "guest-contributor", name: "Guest Contributor", desc: "Invited to contribute a one-off piece" },
  { id: "monthly-contributor", name: "Monthly Contributor", desc: "Publishes on a monthly cadence" },
  { id: "weekly-contributor", name: "Weekly Contributor", desc: "Publishes on a weekly cadence" },
  { id: "sharp-thinker", name: "Sharp Thinker", desc: "Submitted 3 challenge responses" },
  { id: "in-the-room", name: "In The Room", desc: "Posted 3 discussion replies" },
  { id: "well-rounded", name: "Well Rounded", desc: "Contributed across 2+ categories" },
  { id: "hive-regular", name: "Hive Regular", desc: "Made 6+ contributions" },
];

// Shown only on editors' profiles — never as a locked/unearned badge for
// everyone else, unlike the badges in BADGES above.
export const EDITOR_BADGE = { id: "editor", name: "Editor", desc: "Reviews and publishes submissions" };

// Computes which badges a person has earned from their real activity counts.
// `activity` shape: { articles: [...], responses: [...], replies: [...], contributorTier: string|null, siteRole: string|null }
export function computeEarnedBadges(activity) {
  const { articles = [], responses = [], replies = [], contributorTier, siteRole } = activity;
  const totalContributions = articles.length + responses.length + replies.length;
  const categoriesTouched = new Set([...articles.map((a) => a.category_id), ...responses.map((r) => r.category_id)].filter(Boolean));

  const earned = new Set();
  if (totalContributions >= 1) earned.add("first-step");
  if (contributorTier === "Guest Contributor") earned.add("guest-contributor");
  if (contributorTier === "Monthly Contributor") earned.add("monthly-contributor");
  if (contributorTier === "Weekly Contributor") earned.add("weekly-contributor");
  if (responses.length >= 3) earned.add("sharp-thinker");
  if (replies.length >= 3) earned.add("in-the-room");
  if (categoriesTouched.size >= 2) earned.add("well-rounded");
  if (totalContributions >= 6) earned.add("hive-regular");
  if (siteRole === "editor") earned.add("editor");
  return earned;
}

export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// Ensures a user-entered URL has a protocol, so it's never treated as a
// relative path on our own site (e.g. "linkedin.com/in/x" -> 404).
export function externalUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
