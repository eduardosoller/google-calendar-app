import { NextResponse } from "next/server";
import { calendarRepository } from "@/server/repositories";
import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
let events = {
  summary: "This is the summary.",
  description: "This is the description.",
  location: "Brasil",
  start: {
    dateTime: "2023-09-26T16:00:00-03:00",
    //  timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: "2023-09-26T18:00:00-03:00",
    // timeZone: "Asia/Kolkata",
  },
};
const calendar_id = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
// const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
// const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
// const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
// const redirect_url = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;

// let oauth2Client = new google.auth.OAuth2(
//   client_id,
//   client_secret,
//   redirect_url
// );
// const scopes = [
//   "https://www.googleapis.com/auth/calendar",
//   "https://www.googleapis.com/auth/plus.login",
// ];

// export async function GET(request: Request) {
//   const authUrl = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: "offline",
//     scope: scopes,
//     include_granted_scopes: true,
//   });
//   console.log(authUrl);
//   return NextResponse.redirect(authUrl);
// }
export async function handler(req: Request) {
  const jwt = await getToken({ req, raw: true });
  console.log(jwt);
  //const {summary, description, start, end} = request.body
  return;
  let calendar = google.calendar("v3");
  try {
    const response = await calendar.events.insert({
      auth: accessToken,
      calendarId: calendar_id,
      requestBody: events,
    });
    console.log("insertResponse", response);
  } catch (error) {
    console.log(error);
  }
}
export { handler as POST };
