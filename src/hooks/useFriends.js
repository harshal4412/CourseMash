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
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const friendIds = userData.friends || [];
        
        getDocs(collection(db, 'users')).then(querySnapshot => {
          const users = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setAllUsers(users);
          setFriends(users.filter(u => friendIds.includes(u.id)));
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm) return [];
    const lowerQuery = searchTerm.toLowerCase();
    return allUsers.filter(u => 
      u.id !== user?.uid && (
        u.name?.toLowerCase().includes(lowerQuery) || 
        u.email?.toLowerCase().includes(lowerQuery) ||
        u.rollNumber?.toLowerCase().includes(lowerQuery)
      )
    );
  }, [allUsers, user]);

  const addFriend = useCallback(async (friendId) => {
    if (!user) return { success: false, error: 'Must be logged in' };
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        friends: arrayUnion(friendId)
      });
      return { success: true, message: 'Added to your circle' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const removeFriend = useCallback(async (friendId) => {
    if (!user) return { success: false, error: 'Must be logged in' };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        friends: arrayRemove(friendId)
      });
      return { success: true, message: 'Removed from circle' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const getCommonCourses = useCallback((friendId, friendCourses = []) => {
    if (!user || !friendCourses) return [];
    
    const myCourses = allUsers.find(u => u.id === user.uid)?.courses || [];
    return friendCourses.filter(code => myCourses.includes(code));
  }, [allUsers, user]);

  return {
    friends,
    loading,
    addFriend,
    removeFriend,
    searchUsers,
    getCommonCourses
  };
};