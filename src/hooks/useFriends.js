import { useState, useCallback, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const friendIds = userData.friends || [];
          
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersList = querySnapshot.docs.map(d => ({ 
            id: d.id, 
            ...d.data() 
          }));
          
          setAllUsers(usersList);
          setFriends(usersList.filter(u => friendIds.includes(u.id)));
        }
      } catch (err) {
        console.error("Internal hook error:", err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Subscription blocked by rules:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm || !allUsers.length) return [];
    const lowerQuery = searchTerm.toLowerCase();
    return allUsers.filter(u => 
      u.id !== user?.uid && (
        u.name?.toLowerCase().includes(lowerQuery) || 
        u.email?.toLowerCase().includes(lowerQuery)
      )
    );
  }, [allUsers, user?.uid]);

  const addFriend = useCallback(async (friendId) => {
    if (!user?.uid) return { success: false, error: 'Auth required' };
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion(friendId)
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user?.uid]);

  const removeFriend = useCallback(async (friendId) => {
    if (!user?.uid) return { success: false, error: 'Auth required' };
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayRemove(friendId)
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user?.uid]);

  return { friends, loading, addFriend, removeFriend, searchUsers };
};