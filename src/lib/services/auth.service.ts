import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { createUserProfile, getUserProfile } from '../firebase/profileUtils';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  private constructor() {
    // Initialize auth state listener
    auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      if (user) {
        await this.handleUserSignedIn(user);
      }
      this.notifyAuthStateListeners(user);
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      throw new AuthError(
        error.message || 'Failed to sign in with Google',
        error.code
      );
    }
  }

  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new AuthError(
        error.message || 'Failed to sign out',
        error.code
      );
    }
  }

  public async handleUserSignedIn(user: User): Promise<void> {
    try {
      const existingProfile = await getUserProfile(user.uid);
      
      if (!existingProfile) {
        await createUserProfile(user.uid, {
          email: user.email || '',
          fullName: user.displayName || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL,
        });
      }
    } catch (error: any) {
      throw new AuthError(
        error.message || 'Failed to handle user sign in',
        error.code
      );
    }
  }

  public subscribeToAuthState(listener: (user: User | null) => void): () => void {
    this.authStateListeners.push(listener);
    // Immediately notify with current state
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
    };
  }

  private notifyAuthStateListeners(user: User | null): void {
    this.authStateListeners.forEach(listener => listener(user));
  }
} 