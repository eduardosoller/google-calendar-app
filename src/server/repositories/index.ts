import { dayEventsParams } from "../entities/";
import { google } from "googleapis";
import { getGoogleOAuthToken } from '../../lib/google'
import { getServerSession, } from "next-auth/next"
import { authOptions } from '../../app/api/auth/[...nextauth]/route'
const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

async function getDayEvents({ date, start, end }: dayEventsParams): Promise<{ start: any; end: any; }[] | Response> {
  const session = await getServerSession(authOptions)
  const timezone = "-03:00";
  const dateTimeStart = `${date}T${start}:00:00${timezone}`
  const dateTimeEnd = `${date}T${end}:00:00${timezone}`
  try {
    const calendar = google.calendar('v3');
    const auth = await getGoogleOAuthToken(session!)
    //console.log('AUTH', auth)
    const response = await calendar.events.list({
      auth: auth,
      calendarId: calendar_id,
      timeMax: dateTimeEnd,
      timeMin: dateTimeStart,
      timeZone: timezone,
    });
    console.log(response)
    const slots = response.data.items ?
      response.data.items.map((item: any) => {
        return { start: item.start.dateTime, end: item.end.dateTime };
      }) : []

    return slots
  } catch (error: any) {
    console.log('calendar.events.list', error.response.data.error)
    throw new Error(error.response.data.error);
  }
}
export const calendarRepository = { getDayEvents };
