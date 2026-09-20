'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const LOCAL_USER_STORAGE_KEY = 'charan_chat_user_v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginAnonymously: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Charan User',
            photoURL: fbUser.photoURL,
            isAnonymous: fbUser.isAnonymous,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Fallback local session state for dev/demo mode
      const raw = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const saveLocalUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
    }
  };

  const loginWithGoogle = async () => {
    if (auth) {
      await signInWithPopup(auth, googleProvider);
    } else {
      // Demo Google Sign-In simulation
      const demoUser: UserProfile = {
        uid: 'google_' + Math.random().toString(36).substring(2, 9),
        email: 'user.google@gmail.com',
        displayName: 'Google Account User',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
        isAnonymous: false,
      };
      saveLocalUser(demoUser);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const localUser: UserProfile = {
        uid: 'email_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        isAnonymous: false,
      };
      saveLocalUser(localUser);
    }
  };

  const signupWithEmail = async (name: string, email: string, pass: string) => {
    if (auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && credential.user) {
        await updateProfile(credential.user, { displayName: name });
      }
    } else {
      const newUser: UserProfile = {
        uid: 'email_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: name || email.split('@')[0],
        photoURL: null,
        isAnonymous: false,
      };
      saveLocalUser(newUser);
    }
  };

  const loginAnonymously = async () => {
    if (auth) {
      await firebaseSignInAnonymously(auth);
    } else {
      const guestUser: UserProfile = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 9),
        email: null,
        displayName: 'Guest User',
        photoURL: null,
        isAnonymous: true,
      };
      saveLocalUser(guestUser);
    }
  };

  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    saveLocalUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAnonymously,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
