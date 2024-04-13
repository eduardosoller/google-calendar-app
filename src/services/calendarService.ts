import { dayEventsParams } from "@/server/entities";
import { api } from '../lib/axios'

export const calendarService = {
  getFreeHours: async ({ date, start, end }: dayEventsParams) => {
    return await fetch(`/calendar/freehours/${date}/${start}/${end}`);
  },
  insertEvent: async (event: calendarEvent) => {
    return await api.post(`/calendar/insert`, event);
  },
}