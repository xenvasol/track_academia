import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import type { UserData } from "./auth-service";

export const firebaseStorage = storage;

export interface BookData {
  id?: string;
  userId: string;
  name: string;
  author: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LectureData {
  id?: string;
  userId: string;
  bookId: string;
  date: Date;
  topics: TopicData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TopicData {
  topic: string;
  definition: string;
  level: "easy" | "moderate" | "difficult";
}

class FirebaseService {
  private static instance: FirebaseService;

  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // User operations
  async createUser(userData: UserData): Promise<void> {
    try {
      await setDoc(doc(db, "users", userData.uid), {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
        updatedAt: Timestamp.fromDate(userData.updatedAt),
      });
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  }

  async getUser(uid: string): Promise<UserData | null> {
    try {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as UserData;
      }
      return null;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }

  async updateUser(uid: string, updates: Partial<UserData>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      await updateDoc(doc(db, "users", uid), updateData);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  // Book operations
  async createBook(bookData: BookData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...bookData,
        createdAt: Timestamp.fromDate(bookData.createdAt),
        updatedAt: Timestamp.fromDate(bookData.updatedAt),
      });
      return docRef.id;
    } catch (error) {
      console.error("Create book error:", error);
      throw error;
    }
  }

  async getBooks(userId: string): Promise<BookData[]> {
    try {
      const q = query(
        collection(db, "books"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as BookData[];
    } catch (error) {
      console.error("Get books error:", error);
      throw error;
    }
  }

  async getBook(bookId: string): Promise<BookData | null> {
    try {
      const docSnap = await getDoc(doc(db, "books", bookId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as BookData;
      }
      return null;
    } catch (error) {
      console.error("Get book error:", error);
      throw error;
    }
  }

  async updateBook(bookId: string, updates: Partial<BookData>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      await updateDoc(doc(db, "books", bookId), updateData);
    } catch (error) {
      console.error("Update book error:", error);
      throw error;
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "books", bookId));
    } catch (error) {
      console.error("Delete book error:", error);
      throw error;
    }
  }

  // Lecture operations
  async createLecture(lectureData: LectureData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "lectures"), {
        ...lectureData,
        date: Timestamp.fromDate(lectureData.date),
        createdAt: Timestamp.fromDate(lectureData.createdAt),
        updatedAt: Timestamp.fromDate(lectureData.updatedAt),
      });
      return docRef.id;
    } catch (error) {
      console.error("Create lecture error:", error);
      throw error;
    }
  }

  async getLectures(userId: string, bookId: string): Promise<LectureData[]> {
    try {
      const q = query(
        collection(db, "lectures"),
        where("userId", "==", userId),
        where("bookId", "==", bookId),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as LectureData[];
    } catch (error) {
      console.error("Get lectures error:", error);
      throw error;
    }
  }

  async getLecture(lectureId: string): Promise<LectureData | null> {
    try {
      const docSnap = await getDoc(doc(db, "lectures", lectureId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as LectureData;
      }
      return null;
    } catch (error) {
      console.error("Get lecture error:", error);
      throw error;
    }
  }

  async updateLecture(
    lectureId: string,
    updates: Partial<LectureData>
  ): Promise<void> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }

      await updateDoc(doc(db, "lectures", lectureId), updateData);
    } catch (error) {
      console.error("Update lecture error:", error);
      throw error;
    }
  }

  async deleteLecture(lectureId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "lectures", lectureId));
    } catch (error) {
      console.error("Delete lecture error:", error);
      throw error;
    }
  }
}

export default FirebaseService;
