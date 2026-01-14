import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import courseData from '../data/courses.json';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const uniqueCourses = courseData.filter((course, index, self) =>
      index === self.findIndex((c) => c.code === course.code)
    );
    setAllCourses(uniqueCourses);
  }, []);

  useEffect(() => {
    if (!user) {
      setMyCourses([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, "user_schedules", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().courses || [];
        setMyCourses(data);
      } else {
        setMyCourses([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addCourse = async (course) => {
    if (!user) return { success: false, error: "Please login first" };
    
    const isDuplicate = myCourses.some(c => c.code === course.code);
    if (isDuplicate) return { success: false, error: "Course already in schedule" };

    const updatedCourses = [...myCourses, course];
    const docRef = doc(db, "user_schedules", user.uid);
    
    try {
      await setDoc(docRef, { courses: updatedCourses }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error adding course: ", error);
      return { success: false, error: "Failed to save to cloud" };
    }
  };

  const removeCourse = async (courseCode) => {
    if (!user) return { success: false, error: "User not authenticated" };
    
    const updatedCourses = myCourses.filter(c => c.code !== courseCode);
    const docRef = doc(db, "user_schedules", user.uid);
    
    try {
      await setDoc(docRef, { courses: updatedCourses }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error removing course: ", error);
      return { success: false, error: "Failed to remove course" };
    }
  };

  return (
    <CourseContext.Provider value={{ 
      allCourses, 
      myCourses, 
      addCourse, 
      removeCourse, 
      loading 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);