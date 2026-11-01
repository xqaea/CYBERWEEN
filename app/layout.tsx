import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBERWEEN 2026 | The Haunted World of Computer Science",
  description: "Code your way out. Hack the darkness. Survive the night.",
  applicationName: "CYBERWEEN 2026"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
