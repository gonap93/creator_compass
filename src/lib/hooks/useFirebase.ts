import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { firebaseService } from '../firebase/FirebaseService';
import { createUserProfile, updateUserProfile, getUserProfile } from '../firebase/profileUtils';

/**
 * Hook to access Firebase services
 * Provides access to all Firebase operations through the centralized service
 */
export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the current user
    const user = firebaseService.getCurrentUser();
    setUser(user);
    setLoading(false);

    // Set up auth state listener
    const auth = firebaseService.getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signInWithGoogle: firebaseService.signInWithGoogle.bind(firebaseService),
    signOut: firebaseService.signOut.bind(firebaseService),
    
    // Profiles
    createUserProfile,
    updateUserProfile,
    getUserProfile,
    
    // Content
    addContentIdea: firebaseService.addContentIdea.bind(firebaseService),
    updateContentIdea: firebaseService.updateContentIdea.bind(firebaseService),
    deleteContentIdea: firebaseService.deleteContentIdea.bind(firebaseService),
    getUserContentIdeas: firebaseService.getUserContentIdeas.bind(firebaseService),
    updateContentStatus: firebaseService.updateContentStatus.bind(firebaseService),
    
    // Storage
    uploadFile: firebaseService.uploadFile.bind(firebaseService),
    
    // Generic Firestore operations
    addDocument: firebaseService.addDocument.bind(firebaseService),
    getDocuments: firebaseService.getDocuments.bind(firebaseService),
    getDocument: firebaseService.getDocument.bind(firebaseService),
    updateDocument: firebaseService.updateDocument.bind(firebaseService),
    setDocument: firebaseService.setDocument.bind(firebaseService),
    deleteDocument: firebaseService.deleteDocument.bind(firebaseService),
  };
} 