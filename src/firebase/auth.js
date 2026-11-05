import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import "./config";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const GOOGLE_REDIRECT_FLAG = "ccc-google-redirect";

export async function handleGoogleLogin() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.warn("Popup blocked or failed, falling back to redirect:", error.code);
    try {
      sessionStorage.setItem(GOOGLE_REDIRECT_FLAG, "1");
      await signInWithRedirect(auth, provider);
    } catch (redirectError) {
      sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
      console.error("Authentication failed completely:", redirectError);
    }
  }
}
