import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import FirebaseService from "./firebase-service";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  degree?: string;
  createdAt: Date;
  updatedAt: Date;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await FirebaseService.getInstance().createUser(userData);

      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export default AuthService;
