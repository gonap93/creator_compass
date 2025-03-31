import { User } from 'firebase/auth';
import { createUserProfile } from './profileUtils';

export async function handleUserSignedIn(user: User) {
  try {
    // Create or update user profile
    await createUserProfile(user.uid, {
      email: user.email || '',
      fullName: user.displayName || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error('Error handling user sign in:', error);
  }
} 