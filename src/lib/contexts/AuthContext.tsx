"use client";

import React, { createContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { AuthService, AuthError } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: AuthError | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const authService = AuthService.getInstance();

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await authService.signInWithGoogle();
    } catch (error) {
      setError(error instanceof AuthError ? error : new AuthError('Failed to sign in with Google'));
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error) {
      setError(error instanceof AuthError ? error : new AuthError('Failed to sign out'));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
