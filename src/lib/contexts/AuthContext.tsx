"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthContext] Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("[AuthContext] Auth state changed:", user ? "User logged in" : "No user");
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("[AuthContext] Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log("[AuthContext] Initiating Google sign in");
    const provider = new GoogleAuthProvider();
    try {
      console.log("[AuthContext] Opening Google sign in popup");
      const result = await signInWithPopup(auth, provider);
      console.log("[AuthContext] Google sign in successful:", result.user.email);
    } catch (error: any) {
      console.error("[AuthContext] Error signing in with Google:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error; // Re-throw to handle in UI
    }
  };

  const signOutUser = async () => {
    console.log("[AuthContext] Initiating sign out");
    try {
      await firebaseSignOut(auth);
      console.log("[AuthContext] Sign out successful");
    } catch (error: any) {
      console.error("[AuthContext] Error signing out:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error; // Re-throw to handle in UI
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
