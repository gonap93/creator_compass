import { 
  FirebaseApp, 
  initializeApp, 
  getApps, 
  getApp 
} from "firebase/app";
import { 
  Auth, 
  getAuth, 
  browserLocalPersistence, 
  setPersistence,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  User
} from "firebase/auth";
import { 
  Firestore, 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from "firebase/firestore";
import { 
  FirebaseStorage, 
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { 
  Analytics, 
  getAnalytics, 
  isSupported 
} from "firebase/analytics";

// Import types
import { UserProfile } from './types/profile';
import { ContentIdea, ContentBoard } from '../types/content';
import { createUserProfile, updateUserProfile, getUserProfile } from './profileUtils';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBeSO93AHyyU-ilypV4ca92n9fLRL1iug",
  authDomain: "creator-compass-4574f.firebaseapp.com",
  projectId: "creator-compass-4574f",
  storageBucket: "creator-compass-4574f.firebasestorage.app",
  messagingSenderId: "957011787700",
  appId: "1:957011787700:web:95deb1750568100784bce1",
  measurementId: "G-E7KVKS48QJ"
};

/**
 * Centralized Firebase service class
 * Handles all Firebase operations across the application
 */
class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private auth: Auth;
  private db: Firestore;
  private storage: FirebaseStorage;
  private analytics: Analytics | null = null;

  private constructor() {
    // Initialize Firebase
    try {
      if (getApps().length) {
        console.log("[FirebaseService] Using existing Firebase app");
        this.app = getApp();
      } else {
        console.log("[FirebaseService] Creating new Firebase app");
        this.app = initializeApp(firebaseConfig);
      }
    } catch (error: any) {
      console.error("[FirebaseService] Error initializing Firebase:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }

    // Initialize services
    console.log("[FirebaseService] Initializing Firebase services");
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    // Set persistence
    this.setupAuthPersistence();

    // Initialize Analytics only in browser environment
    this.setupAnalytics();

    // Check current auth state
    this.setupAuthStateListener();
  }

  /**
   * Get the singleton instance of FirebaseService
   */
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Set up auth persistence
   */
  private setupAuthPersistence(): void {
    console.log("[FirebaseService] Setting up auth persistence...");
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log("[FirebaseService] Auth persistence set to local successfully");
      })
      .catch((error) => {
        console.error("[FirebaseService] Error setting persistence:", error);
      });
  }

  /**
   * Set up analytics
   */
  private setupAnalytics(): void {
    if (typeof window !== 'undefined') {
      console.log("[FirebaseService] Checking analytics support");
      isSupported().then(yes => {
        if (yes) {
          console.log("[FirebaseService] Analytics supported, initializing");
          this.analytics = getAnalytics(this.app);
        } else {
          console.log("[FirebaseService] Analytics not supported in this environment");
        }
      }).catch(error => {
        console.error("[FirebaseService] Error checking analytics support:", error);
      });
    }
  }

  /**
   * Set up auth state listener
   */
  private setupAuthStateListener(): void {
    this.auth.onAuthStateChanged((user) => {
      console.log("[FirebaseService] Auth state changed:", {
        isAuthenticated: !!user,
        userId: user?.uid
      });
    });
  }

  /**
   * Get the current user
   */
  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Get the auth instance
   */
  public getAuth() {
    return this.auth;
  }

  /**
   * Auth Methods
   */
  public async signInWithGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('[FirebaseService] Error signing in with Google:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  public async handleRedirectResult(): Promise<any> {
    try {
      const result = await getRedirectResult(this.auth);
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      console.error('[FirebaseService] Error handling redirect result:', error);
      throw error;
    }
  }

  /**
   * Firestore Methods
   */
  public async addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<T & { id: string }> {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...data } as T & { id: string };
    } catch (error) {
      console.error(`[FirebaseService] Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  public async getDocuments<T>(collectionName: string): Promise<(T & { id: string })[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
    } catch (error) {
      console.error(`[FirebaseService] Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  public async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(this.db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      
      return null;
    } catch (error) {
      console.error(`[FirebaseService] Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  public async updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[FirebaseService] Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  public async setDocument<T>(collectionName: string, id: string, data: T): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error(`[FirebaseService] Error setting document in ${collectionName}:`, error);
      throw error;
    }
  }

  public async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, collectionName, id));
    } catch (error) {
      console.error(`[FirebaseService] Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Storage Methods
   */
  public async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('[FirebaseService] Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Profile Methods
   */
  public async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    return createUserProfile(userId, data);
  }

  public async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    return updateUserProfile(userId, data);
  }

  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    return getUserProfile(userId);
  }

  /**
   * Content Methods
   */
  public async addContentIdea(contentIdea: Omit<ContentIdea, 'id'>): Promise<ContentIdea> {
    console.log('[FirebaseService] Adding content idea:', contentIdea);
    return this.addDocument<ContentIdea>('contentIdeas', contentIdea);
  }

  public async updateContentIdea(id: string, updates: Partial<ContentIdea>): Promise<void> {
    return this.updateDocument('contentIdeas', id, updates);
  }

  public async deleteContentIdea(id: string): Promise<void> {
    return this.deleteDocument('contentIdeas', id);
  }

  public async getUserContentIdeas(userId: string): Promise<ContentBoard> {
    try {
      const q = query(
        collection(this.db, 'contentIdeas'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const ideas: ContentIdea[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<ContentIdea, 'id'>;
        ideas.push({ id: doc.id, ...data });
      });

      // Group ideas by status
      const board: ContentBoard = {
        idea: ideas.filter(idea => idea.status === 'idea'),
        drafting: ideas.filter(idea => idea.status === 'drafting'),
        filming: ideas.filter(idea => idea.status === 'filming'),
        scheduled: ideas.filter(idea => idea.status === 'scheduled'),
        published: ideas.filter(idea => idea.status === 'published'),
      };

      return board;
    } catch (error) {
      console.error('[FirebaseService] Error getting user content ideas:', error);
      throw error;
    }
  }

  public async updateContentStatus(id: string, status: ContentIdea['status']): Promise<void> {
    return this.updateDocument('contentIdeas', id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Export a singleton instance
export const firebaseService = FirebaseService.getInstance();

// Export the service class for testing
export default FirebaseService; 