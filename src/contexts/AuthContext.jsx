import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "../lib/firebase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserToFirestore = async (firebaseUser) => {
    if (!firebaseUser) return;

    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "New Student",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
          rollNumber: "Not Set",
          degree: "B.Tech",
          branch: "Computer Science Engineering",
          specialization: "None",
          year: "1",
          bio: "IIT Gandhinagar Student",
          location: "Palaj, Gandhinagar",
          socials: {
            github: "",
            linkedin: "",
            instagram: ""
          },
          friends: [],
          achievements: [],
          courses: [],
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Background Sync Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          ...currentUser,
          id: currentUser.uid
        });
        
        syncUserToFirestore(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async ({ email, password, name }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      syncUserToFirestore(res.user);
      return { success: true, user: res.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      syncUserToFirestore(res.user);
      return { success: true, user: res.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);