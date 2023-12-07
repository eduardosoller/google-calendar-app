import { Event, dayEventsParams } from "../entities/";
import { NextResponse } from "next/server";
import { google } from "googleapis";
const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

async function getDayEvents(data: dayEventsParams) {
  const date = data.date,
    start = data.start,
    end = data.end,
    timezone = "-03:00";
  const dateTimeStart = encodeURIComponent(`${date}T${start}:00:00${timezone}`);
  const dateTimeEnd = encodeURIComponent(`${date}T${end}:00:00${timezone}`);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?key=${api_key}&timeMin=${dateTimeStart}&timeMax=${dateTimeEnd}&singleEvents=true&maxResults=20&ignoreCache=1`;
  try {
    const response = await fetch(url);
    const events = await response.json();
    const slots = events.items.map(
      (item: { start: { dateTime: string }; end: { dateTime: string } }) => {
        return { start: item.start.dateTime, end: item.end.dateTime };
      }
    );
    return slots;
  } catch (e: any) {
    throw new Error("Erro no servidor do Google. Tipo: " + e.message);
  }
}
export const calendarRepository = { getDayEvents };
