import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleOAuthToken } from '../../../../lib/google'
import { getServerSession, } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route'

const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await request.json()
  console.log('API REQUEST BODY', body)
  try {
    const auth = await getGoogleOAuthToken(session!)
    const calendar = google.calendar({
      version: 'v3',
      auth: auth,
    })
    await calendar.events.insert({
      calendarId: calendar_id,
      requestBody: body,
    });
    return NextResponse.json({ message: 'Seu horário foi agendado!' });
  } catch (err: any) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message });
    }
    return NextResponse.json({ message: 'Ocorreu um erro.' });
  }
}
