'use client';

import { useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        
        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour lastLoginAt
    await setDoc(
      doc(db, 'users', result.user.uid),
      {
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
    
    return result;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour le profil Firebase
    await updateProfile(result.user, { displayName });
    
    // Créer le document utilisateur dans Firestore
    const newUser: Omit<User, 'id'> = {
      email: result.user.email!,
      displayName,
      photoURL: result.user.photoURL || undefined,
      role: 'viewer', // Rôle par défaut
      organizations: [],
      preferences: {
        language: 'fr',
        theme: 'auto',
        emailNotifications: true,
        pushNotifications: false,
      },
      createdAt: serverTimestamp() as any,
      lastLoginAt: serverTimestamp() as any,
    };
    
    await setDoc(doc(db, 'users', result.user.uid), {
      ...newUser,
      id: result.user.uid,
    });
    
    return result;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Vérifier si l'utilisateur existe déjà
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Créer le document utilisateur
      const newUser: Omit<User, 'id'> = {
        email: result.user.email!,
        displayName: result.user.displayName || 'Utilisateur',
        photoURL: result.user.photoURL || undefined,
        role: 'viewer',
        organizations: [],
        preferences: {
          language: 'fr',
          theme: 'auto',
          emailNotifications: true,
          pushNotifications: false,
        },
        createdAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
      };
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...newUser,
        id: result.user.uid,
      });
    } else {
      // Mettre à jour lastLoginAt
      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    
    return result;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
}

