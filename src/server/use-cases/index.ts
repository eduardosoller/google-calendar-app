import { calendarRepository } from "../repositories";
import { calculateFreeTimeSlots } from "../utils/freeSlotsByHour";
import { dayEventsParams } from "../entities";
import { NextResponse } from "next/server";
const freeHours = async (data: dayEventsParams) => {
  try {
    const events: [{ start: string; end: string }] =
      await calendarRepository.getDayEvents(data);
    const freeHours = calculateFreeTimeSlots(data, events);
    console.log(freeHours);
    return freeHours;
  } catch (error: any) {
    //console.log(error.message);
    throw new Error(error.message);
  }
};
export const useCases = { freeHours };
