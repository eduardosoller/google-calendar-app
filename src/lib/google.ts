import { google } from 'googleapis'
import { Session } from "next-auth"

type GoogleOAuthProps = {
  user: any,
  access_token: string
  refresh_token: string
  expires: number | null | undefined
}
export async function getGoogleOAuthToken(session: Session) {

  const auth = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL)

  auth.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    expiry_date: session.expires ? Number(session.expires) : null,
  })
  if (!session.expires) {
    console.log('lib/google - auth', auth)
    return auth
  }

  const isTokenExpired = false//dayjs(session.expires * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    console.log('isTokenExpired', credentials.expiry_date, credentials.access_token)
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    })
  }
  console.log('session.expires', auth)
  return auth
}