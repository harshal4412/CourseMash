import courseData from '../data/courses.json';

export const courseService = {
  getAllCourses: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(courseData.courses);
      }, 500);
    });
  },

  searchCourses: (query, courses) => {
    const term = query.toLowerCase().trim();
    if (!term) return courses;

    return courses.filter(course => 
      course.code.toLowerCase().includes(term) ||
      course.name.toLowerCase().includes(term) ||
      course.instructors?.some(ins => ins.toLowerCase().includes(term))
    );
  },

  getDepartmentStats: (myCourses) => {
    const stats = {};
    myCourses.forEach(course => {
      const dept = course.code.split(/[0-9]/)[0];
      stats[dept] = (stats[dept] || 0) + 1;
    });
    return stats;
  },

  validateConflict: (newCourse, existingCourses) => {
    const conflicts = [];
    
    newCourse.slots.forEach(newSlot => {
      existingCourses.forEach(existing => {
        existing.slots.forEach(existingSlot => {
          if (newSlot.day === existingSlot.day && newSlot.time === existingSlot.time) {
            conflicts.push({
              day: newSlot.day,
              time: newSlot.time,
              with: existing.code
            });
          }
        });
      });
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts
    };
  }
};