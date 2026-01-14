export const getDepartmentCode = (courseCode) => {
  if (!courseCode) return 'GEN';
  return courseCode.split(/[0-9]/)[0].toUpperCase();
};

export const formatInstructorName = (name) => {
  if (!name) return 'Staff';
  const parts = name.split(',').map(p => p.trim());
  if (parts.length > 1) {
    return `${parts[1]} ${parts[0]}`;
  }
  return name;
};

export const calculateTotalCredits = (courses) => {
  return courses.reduce((total, course) => {
    const credits = parseInt(course.credits) || 0;
    return total + credits;
  }, 0);
};

export const groupCoursesByDept = (courses) => {
  return courses.reduce((acc, course) => {
    const dept = getDepartmentCode(course.code);
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(course);
    return acc;
  }, {});
};

export const getCourseLoadStatus = (totalCredits) => {
  if (totalCredits === 0) return { label: 'Empty', color: 'text-slate-400' };
  if (totalCredits < 12) return { label: 'Light', color: 'text-emerald-500' };
  if (totalCredits <= 18) return { label: 'Balanced', color: 'text-blue-500' };
  return { label: 'Heavy', color: 'text-rose-500' };
};