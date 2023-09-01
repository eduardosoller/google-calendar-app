import { dayEventsParams } from "../entities/";
async function getDayEvents(data: dayEventsParams): Promise<any> {
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const date = data.date;
  const start = data.start;
  const end = data.end;
  const timezone = "-03:00";
  const dateTimeStart = encodeURIComponent(`${date}T${start}:00:00${timezone}`);
  const dateTimeEnd = encodeURIComponent(`${date}T${end}:00:00${timezone}`);
  const calendar_endpoint = `https://www.googleapis.com/calendar/v3/calendars/${client_id}/events?key=${api_key}&timeMin=${dateTimeStart}&timeMax=${dateTimeEnd}&singleEvents=true&maxResults=20`;
  const response = await fetch(calendar_endpoint);
  const events = await response.json();
  console.log(events.items);
  return events.items;
}
export const calendarRepository = { getDayEvents };
