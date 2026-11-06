import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";
import { isOwnerEmail, normalizeEmail, OWNER_PERMISSIONS } from "./roles";

export async function ensureOwnerRecord(user) {
  if (!user?.uid || !isOwnerEmail(user.email)) return null;

  const record = {
    email: normalizeEmail(user.email),
    displayName: user.displayName || "",
    role: "owner",
    superAdmin: true,
    permissions: OWNER_PERMISSIONS,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), record, { merge: true });
  return record;
}
