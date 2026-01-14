export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    message: password.length < 8 ? 'Password must be at least 8 characters' : ''
  };
};

export const validateCourseCode = (code) => {
  const re = /^[A-Z]{2,4}\d{3,4}$/;
  return re.test(code.toUpperCase());
};

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const sanitizeString = (str) => {
  return str.replace(/[<>]/g, '').trim();
};

export const validateScheduleData = (schedule) => {
  const requiredDays = ['M', 'T', 'W', 'Th', 'F'];
  const hasAllDays = requiredDays.every(day => Array.isArray(schedule[day]));
  
  return {
    isValid: hasAllDays,
    error: hasAllDays ? null : 'Schedule structure is missing required days'
  };
};