export const OWNER_EMAIL = "tobasam23@gmail.com";

const OWNER_EMAILS = new Set([
  OWNER_EMAIL,
  "istobasam23@gmail.com",
]);

export const OWNER_PERMISSIONS = {
  uploadAudio: true,
  uploadVideo: true,
  createEvents: true,
  postNews: true,
  postCommunity: true,
  reportMember: true,
  blockMember: true,
  manageNeeds: true,
  viewStats: true,
};

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isOwnerEmail(email) {
  return OWNER_EMAILS.has(normalizeEmail(email));
}
