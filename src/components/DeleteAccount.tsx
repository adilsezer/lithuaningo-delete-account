import React, { useState, useEffect } from "react";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [isPasswordProvider, setIsPasswordProvider] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserExists(true);
      setIsPasswordProvider(
        user.providerData.some((provider) => provider.providerId === "password")
      );
    } else {
      setUserExists(false);
    }
  }, [user]);

  const handleDelete = async () => {
    if (!user) return;
    try {
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      alert("Account deleted successfully.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="mb-4 text-xl font-bold">Delete Account - Lithuaningo</h1>
        {!userExists ? (
          <p className="text-gray-700">No user is currently signed in.</p>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              Deleting your account is a permanent action and cannot be undone.
              All your data will be lost.
            </p>
            {isPasswordProvider && (
              <>
                <p className="mb-4 text-gray-700">
                  To proceed, please enter your password below to confirm your
                  identity and delete your account.
                </p>
                <input
                  type="password"
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
