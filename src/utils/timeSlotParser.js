export const parseTimeSlot = (slotString) => {
  if (!slotString || !slotString.includes('-')) return { start: 0, end: 0, label: slotString };

  const [startStr, endStr] = slotString.split('-');
  
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return {
    start: toMinutes(startStr),
    end: toMinutes(endStr),
    label: slotString,
    isMorning: toMinutes(startStr) < 720,
    formattedLabel: `${startStr} — ${endStr}`
  };
};

export const sortTimeSlots = (slots) => {
  return [...slots].sort((a, b) => {
    const timeA = parseTimeSlot(a).start;
    const timeB = parseTimeSlot(b).start;
    return timeA - timeB;
  });
};

export const isCurrentTimeInSlot = (slotString) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const { start, end } = parseTimeSlot(slotString);
  
  return currentMinutes >= start && currentMinutes <= end;
};

export const getNextSlot = (slots, currentSlot) => {
  const sorted = sortTimeSlots(slots);
  const currentIndex = sorted.indexOf(currentSlot);
  return sorted[currentIndex + 1] || null;
};