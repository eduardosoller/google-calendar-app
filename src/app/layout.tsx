

import './globals.css'
import 'materialize-css/dist/css/materialize.min.css'
//import './assets/css/main.css'
import '../assets/css/responsive.css'

export const metadata = {
  title: 'Google Calendar App',
  description: 'Soller',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
