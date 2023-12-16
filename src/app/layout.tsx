import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Google Calendar App by Soller",
  description: "Let customers make appointments in your calendar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
