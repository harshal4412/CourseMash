const BASE_DELAY = 800;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  get: async (endpoint) => {
    await sleep(BASE_DELAY);
    const data = localStorage.getItem(`coursemash_${endpoint}`);
    return data ? JSON.parse(data) : null;
  },

  post: async (endpoint, payload) => {
    await sleep(BASE_DELAY);
    localStorage.setItem(`coursemash_${endpoint}`, JSON.stringify(payload));
    return { success: true, data: payload };
  },

  delete: async (endpoint) => {
    await sleep(BASE_DELAY);
    localStorage.removeItem(`coursemash_${endpoint}`);
    return { success: true };
  }
};

export const fetchDashboardData = async () => {
  try {
    const courses = await api.get('my_courses') || [];
    const user = await api.get('user');
    return { courses, user };
  } catch (error) {
    throw new Error('Failed to synchronize dashboard data');
  }
};

export default api;