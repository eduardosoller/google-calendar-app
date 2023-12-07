import { NextRequest, NextResponse } from "next/server";
import { calendarRepository } from "@/server/repositories";
import { google } from "googleapis";
import { getGoogleOAuthToken } from '../../../../lib/google'
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'
let events = {
  summary: "Evento de teste",
  description: "This is the description.",
  location: "Brasil",
  start: {
    dateTime: "2023-12-09T16:00:00-03:00",
  },
  end: {
    dateTime: "2023-12-09T18:00:00-03:00",
  },
};
const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

export async function handler(req: NextRequest) {
  const session = await getServerSession(authOptions)
  // const jwt = await getToken({ req, raw: true });
  //console.log('SESSION', session);
  try {
    const auth = await getGoogleOAuthToken(session)
    const calendar = google.calendar({
      version: 'v3',
      auth: auth,
    })
    const res = await calendar.events.insert({
      calendarId: calendar_id,
      requestBody: events,
    });
    return NextResponse.json('Evento inserido na agenda - ' + res);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
export { handler as POST };
