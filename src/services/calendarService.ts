import { dayEventsParams } from "@/server/entities";
export const calendarService = {
  getFreeHours: async ({ date, start, end }: dayEventsParams) => {
    const response = await fetch(
      `http://localhost:3000/api/calendar/freehours/${date}/${start}/${end}`
    );
    const json = await response.json();
    return json;
  },
  insertEvent: async () => {
    const response = await fetch(`http://localhost:3000/api/calendar/insert`, {
      method: "POST",
    });

    return response;
  },
};
