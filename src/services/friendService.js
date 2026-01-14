import friendsData from '../data/friends.json';

export const friendService = {
  getFriends: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(friendsData.friends);
      }, 600);
    });
  },

  getFriendById: (id) => {
    return friendsData.friends.find(f => f.id === id);
  },

  getCommonCourses: (userCourses, friendId) => {
    const friend = friendService.getFriendById(friendId);
    if (!friend) return [];

    return userCourses.filter(myCourse => 
      friend.courses.some(fCourseCode => fCourseCode === myCourse.code)
    );
  },

  getCompatibilityScore: (mySchedule, friendSchedule) => {
    let matches = 0;
    let totalSlots = 0;

    const days = ['M', 'T', 'W', 'Th', 'F'];
    
    days.forEach(day => {
      const myDay = mySchedule[day] || [];
      const friendDay = friendSchedule[day] || [];
      
      myDay.forEach(mySlot => {
        totalSlots++;
        if (friendDay.some(fSlot => fSlot.time === mySlot.time && fSlot.course.code === mySlot.course.code)) {
          matches++;
        }
      });
    });

    return totalSlots === 0 ? 0 : Math.round((matches / totalSlots) * 100);
  },

  searchPeople: (query) => {
    const term = query.toLowerCase();
    return friendsData.friends.filter(f => 
      f.name.toLowerCase().includes(term) || 
      f.handle.toLowerCase().includes(term)
    );
  }
};