import { calendarRepository } from "../repositories";
import { calculateFreeTimeSlots } from "../utils/freeSlotsByHour";
import { type dayEventsParams } from "../entities";
import { NextResponse } from "next/server";

const freeHours = async (data: dayEventsParams) => {
  try {
    const events: any = await calendarRepository.getDayEvents(data);
    return calculateFreeTimeSlots(data, events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
};
export const useCases = { freeHours };
