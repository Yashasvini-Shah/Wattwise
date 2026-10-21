
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, set } from "firebase/database";
import { app, database } from "./firebase";

export async function testFirebaseConnection() {
  try {
    const auth = getAuth(app);

    await signInAnonymously(auth);

    await set(ref(database, "connectionTest"), {
      status: "connected",
      project: "Smart Hostel Energy Management",
      timestamp: Date.now(),
    });

    console.log("Firebase connection successful!");
  } catch (error) {
    console.error("Firebase connection failed:", error);
  }
}
