import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { ContentIdea, ContentBoard } from '../types/content';

// Add a new content idea
export async function addContentIdea(contentIdea: Omit<ContentIdea, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'contentIdeas'), {
      ...contentIdea,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...contentIdea };
  } catch (error) {
    console.error('Error adding content idea:', error);
    throw error;
  }
}

// Update a content idea
export async function updateContentIdea(id: string, updates: Partial<ContentIdea>) {
  try {
    const docRef = doc(db, 'contentIdeas', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating content idea:', error);
    throw error;
  }
}

// Delete a content idea
export async function deleteContentIdea(id: string) {
  try {
    await deleteDoc(doc(db, 'contentIdeas', id));
    return true;
  } catch (error) {
    console.error('Error deleting content idea:', error);
    throw error;
  }
}

// Get all content ideas for a user
export async function getUserContentIdeas(userId: string): Promise<ContentBoard> {
  try {
    const q = query(
      collection(db, 'contentIdeas'),
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
    console.error('Error getting user content ideas:', error);
    throw error;
  }
}

// Update content idea status
export async function updateContentStatus(id: string, status: ContentIdea['status']) {
  try {
    const docRef = doc(db, 'contentIdeas', id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error updating content status:', error);
    throw error;
  }
} 