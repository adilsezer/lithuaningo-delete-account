import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  deleteUser,
  GoogleAuthProvider,
} from "firebase/auth";
import "tailwindcss/tailwind.css";
import { auth, firestore } from "../firebase/initFirebase"; // Ensure correct path to your Firebase initialization file
import { doc, deleteDoc } from "firebase/firestore"; // Import Firestore functions

const theme = {
  tertiary: "#d5304f",
  background: "#FFFFFF",
  text: "#2E3B44",
  lightText: "#4A5963",
  border: "#B0BEC5",
  error: "#d5304f",
  card: "#F5F7FA",
  cardText: "#2E3B44",
  wordBackground: "#f0f0f0",
};

const DeleteAccount: React.FC = () => {
  const [method, setMethod] = useState<"email" | "google" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (providerId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is permanent and cannot be undone."
    );
    if (confirm) {
      setLoading(true);
      setError(null); // Reset the error message before attempting deletion
      try {
        let user;
        if (providerId === "password") {
          // Sign in the user with email and password
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          user = userCredential.user;
        } else if (providerId === "google.com") {
          // Sign in the user with Google
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          user = userCredential.user;

          // Check if the authenticated Google user matches the email provided
          if (user.email !== email) {
            throw new Error(
              "Authenticated Google account does not match the provided email."
            );
          }
        }

        if (!user) {
          throw new Error("Failed to authenticate user.");
        }

        // Delete the user document from Firestore //
        await deleteDoc(doc(firestore, "userProfiles", user.uid));

        // Delete the signed-in user
        await deleteUser(user);

        alert("Your account has been deleted successfully.");
        setEmail(""); // Clear the email input field
        setPassword(""); // Clear the password input field
      } catch (error: any) {
        switch (error.code) {
          case "auth/wrong-password":
            setError("Incorrect password. Please try again.");
            break;
          case "auth/user-not-found":
            setError("No user found with this email.");
            break;
          case "auth/invalid-email":
            setError("Invalid email format. Please check your email.");
            break;
          case "auth/missing-email":
            setError("Email is required. Please enter your email.");
            break;
          case "auth/missing-password":
            setError("Password is required. Please enter your password.");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Please try again later.");
            break;
          case "auth/invalid-credential":
            setError("Invalid credentials. Please try again.");
            break;
          case "auth/popup-closed-by-user":
            setError("Authentication popup closed by user. Please try again.");
            break;
          case "auth/popup-blocked":
            setError(
              "Popup blocked by the browser. Please allow popups and try again."
            );
            break;
          default:
            setError(`An unknown error occurred: ${error.message}`);
            break;
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMethodSwitch = (newMethod: "email" | "google" | null) => {
    setMethod(newMethod);
    setError(null); // Reset error when switching methods
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <div
        className="p-6 rounded-lg shadow-md w-full max-w-md"
        style={{ backgroundColor: theme.card }}
      >
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: theme.cardText }}
        >
          Lithuaningo
        </h1>
        <h2
          className="text-2xl font-semibold mb-4 text-center"
          style={{ color: theme.cardText }}
        >
          Delete Account
        </h2>
        <p className="mb-4" style={{ color: theme.lightText }}>
          {method
            ? "Please enter your credentials to confirm your identity."
            : "Deleting your account is irreversible. All your data will be permanently removed. To continue, select a method to confirm your identity."}
        </p>
        {error && (
          <div className="mb-4" style={{ color: theme.error }}>
            {error}
          </div>
        )}
        {!method && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleMethodSwitch("email")}
              className="w-full px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.tertiary,
                color: theme.background,
              }}
            >
              Use Email/Password
            </button>
            <button
              onClick={() => handleMethodSwitch("google")}
              className="w-full px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.tertiary,
                color: theme.background,
              }}
            >
              Use Google Account
            </button>
          </div>
        )}
        {method === "email" && (
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
              }}
              required
            />
            <button
              onClick={() => handleDelete("password")}
              className={`w-full px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: theme.tertiary,
                color: theme.background,
              }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
            <button
              onClick={() => handleMethodSwitch(null)}
              className="w-full px-4 py-2 mt-2 font-semibold rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.lightText,
                color: theme.background,
              }}
            >
              Switch Deletion Method
            </button>
          </div>
        )}
        {method === "google" && (
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
              }}
              required
            />
            <button
              onClick={() => handleDelete("google.com")}
              className={`w-full px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: theme.tertiary,
                color: theme.background,
              }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
            <button
              onClick={() => handleMethodSwitch(null)}
              className="w-full px-4 py-2 mt-2 font-semibold rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.lightText,
                color: theme.background,
              }}
            >
              Switch Deletion Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
