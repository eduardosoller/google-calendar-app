import { calendarRepository } from "../repositories";
import { calculateFreeTimeSlots } from "../utils/freeSlotsByHour";
import { type dayEventsParams } from "../entities";

const freeHours = async (data: dayEventsParams) => {
  try {
    const events: any = await calendarRepository.getDayEvents(data);
    return calculateFreeTimeSlots(data, events);
  } catch (error: any) {
    throw new Error(error.message)
  }
};
export const useCases = { freeHours };
