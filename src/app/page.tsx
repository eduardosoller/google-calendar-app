"use client";
import Home from "./home/page";
import { AuthProvider } from "./auth/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
