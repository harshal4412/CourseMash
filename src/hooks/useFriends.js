import { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      }));
      setAllUsers(usersList);

      const myDoc = await getDoc(doc(db, 'users', user.uid));
      if (myDoc.exists()) {
        const friendIds = myDoc.data().friends || [];
        setFriends(usersList.filter(u => friendIds.includes(u.id)));
      }
    } catch (error) {
      console.error("Firestore Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm || !allUsers.length) return [];
    const lower = searchTerm.toLowerCase();
    
    return allUsers.filter(u => 
      u.id !== user?.uid && (
        // Searching 'name' because that's what is in your Firestore screenshot
        u.name?.toLowerCase().includes(lower) || 
        u.email?.toLowerCase().includes(lower) ||
        u.rollNumber?.toLowerCase().includes(lower)
      )
    );
  }, [allUsers, user?.uid]);

  const addFriend = async (friendId) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion(friendId)
      });
      await fetchData();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayRemove(friendId)
      });
      await fetchData();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const getCommonCourses = useCallback((friendId) => {
    const friend = allUsers.find(u => u.id === friendId);
    const me = allUsers.find(u => u.id === user?.uid);
    
    if (!friend?.courses || !me?.courses) return [];

    const myCourseCodes = me.courses.map(c => c.code);
    return friend.courses.filter(c => myCourseCodes.includes(c.code));
  }, [allUsers, user?.uid]);

  return { friends, loading, addFriend, removeFriend, searchUsers, getCommonCourses };
};