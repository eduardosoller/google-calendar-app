import { Event, dayEventsParams } from "../entities/";
import { NextResponse } from "next/server";
import { google } from "googleapis";
const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const redirect_url = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;

//oauth2Client.getAccessToken()
// export const insertEvent = async () => {
//   const oauth2Client = new google.auth.OAuth2(
//     client_id,
//     client_secret,
//     redirect_url
//   );
//   const scopes = ["https://www.googleapis.com/auth/calendar"];
//   const authUrl = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: "offline",
//     scope: scopes,
//     include_granted_scopes: true,
//   });
//   console.log(authUrl);
//   NextResponse.redirect(authUrl);

//let calendar = google.calendar({ version: "v3" });
//calendar.insert()
// try {
//   const event = {
//     attachments: [],
//     attendees: [{ email: "eduardosoller@gmail.com" }],
//     end: { dateTime: "2023-09-23T13:00:00-03:00" },
//     reminders: { useDefault: true },
//     start: { dateTime: "2023-09-23T12:00:00-03:00" },
//     summary: "Teste",
//   };
// } catch (e: any) {
//   throw new Error("Erro ao inserir. Tipo: " + e.message);
// }
// };

async function getDayEvents(data: dayEventsParams) {
  const date = data.date,
    start = data.start,
    end = data.end,
    timezone = "-03:00";
  const dateTimeStart = encodeURIComponent(`${date}T${start}:00:00${timezone}`);
  const dateTimeEnd = encodeURIComponent(`${date}T${end}:00:00${timezone}`);
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?key=${api_key}&timeMin=${dateTimeStart}&timeMax=${dateTimeEnd}&singleEvents=true&maxResults=20`;
  try {
    const response = await fetch(url);
    const events = await response.json();

    const slots = events.items.map(
      (item: { start: { dateTime: string }; end: { dateTime: string } }) => {
        return { start: item.start.dateTime, end: item.end.dateTime };
      }
    );
    // console.log("API: ", slots);
    return slots;
  } catch (e: any) {
    throw new Error("Erro no servidor do Google. Tipo: " + e.message);
  }
}
export const calendarRepository = { getDayEvents };
