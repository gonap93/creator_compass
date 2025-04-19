'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthService, AuthError } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
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
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof AuthError ? error : new AuthError('Failed to sign in with Google'));
      throw error;
    }
  };

  return { user, loading, error, signInWithGoogle };
}