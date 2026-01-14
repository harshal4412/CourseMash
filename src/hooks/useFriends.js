import { useState, useCallback } from 'react';
import { useCourses } from './useCourses';

const MOCK_USERS = [
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@uni.edu', branch: 'Computer Science', year: 3, courses: ['CS101', 'CS202', 'MA101'] },
  { id: 'u2', name: 'Priya Rai', email: 'priya@uni.edu', branch: 'Electrical Eng.', year: 2, courses: ['EE101', 'MA101', 'PH101'] },
  { id: 'u3', name: 'Siddharth V.', email: 'sid@uni.edu', branch: 'Mechanical Eng.', year: 3, courses: ['ME101', 'MA101', 'CS101'] },
  { id: 'u4', name: 'Ishani Singh', email: 'ishani@uni.edu', branch: 'Computer Science', year: 3, courses: ['CS101', 'CS202', 'CS303'] },
  { id: 'u5', name: 'Rohan Gupta', email: 'rohan@uni.edu', branch: 'Civil Eng.', year: 1, courses: ['CE101', 'MA101'] },
];

export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const { myCourses } = useCourses();

  const searchUsers = useCallback((query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) || 
      user.email.toLowerCase().includes(lowerQuery)
    );
  }, []);

  const addFriend = useCallback((friendId) => {
    const isAlreadyFriend = friends.some(f => f.id === friendId);
    if (isAlreadyFriend) {
      return { success: false, error: 'User is already your friend' };
    }

    const userToAdd = MOCK_USERS.find(u => u.id === friendId);
    if (!userToAdd) {
      return { success: false, error: 'User not found' };
    }

    setFriends(prev => [...prev, userToAdd]);
    return { success: true, message: `${userToAdd.name} added to your circle` };
  }, [friends]);

  const removeFriend = useCallback((friendId) => {
    const friendToRemove = friends.find(f => f.id === friendId);
    setFriends(prev => prev.filter(f => f.id !== friendId));
    return { success: true, message: `${friendToRemove?.name || 'Friend'} removed` };
  }, [friends]);

  const getCommonCourses = useCallback((friendId) => {
    const friend = friends.find(f => f.id === friendId) || MOCK_USERS.find(u => u.id === friendId);
    if (!friend || !friend.courses) return [];

    const myCourseCodes = myCourses.map(c => c.code);
    return friend.courses.filter(code => myCourseCodes.includes(code));
  }, [friends, myCourses]);

  return {
    friends,
    addFriend,
    removeFriend,
    searchUsers,
    getCommonCourses
  };
};