const USER_KEY = 'coursemash_user';

export const authService = {
  getCurrentUser: () => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  },

  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const mockUser = {
            id: 'u1',
            name: 'Alex Rivera',
            email: credentials.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            department: 'Computer Science',
            enrolledDate: new Date().toISOString()
          };
          localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  },

  updateProfile: (userData) => {
    const currentUser = authService.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
};