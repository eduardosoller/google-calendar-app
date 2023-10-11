'use client'

import Appointments from './home/page'
import { AuthProvider } from "./auth/AuthProvider";

export default function App({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Appointments />
    </AuthProvider>
  )
}