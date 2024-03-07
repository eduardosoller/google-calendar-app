import { calendarRepository } from "../repositories";
import { calculateFreeTimeSlots } from "../utils/freeSlotsByHour";
import { type dayEventsParams } from "../entities";
const freeHours = async (data: dayEventsParams) => {
  try {
    const events = await calendarRepository.getDayEvents(data);
    const freeHours = calculateFreeTimeSlots(data, events);
    return freeHours;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const useCases = { freeHours };
