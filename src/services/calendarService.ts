import { dayEventsParams } from "@/server/entities";
import { api } from '../lib/axios'
export const calendarService = {
  getFreeHours: async ({ date, start, end }: dayEventsParams) => {
    return await api.get(`/calendar/freehours/${date}/${start}/${end}`);
  },
  insertEvent: async () => {
    return await api.post(`/calendar/insert`);
  },
}