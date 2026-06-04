import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import {AppContextProvider} from "@/context/AppContext"
import { Toaster } from "react-hot-toast";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Instructore",
  description: "DSA Instructor Full stack Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AppContextProvider>
      <html lang="en"className={`${inter.variable} ${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <Toaster toastOptions={
            {
              success:{style:{background:"black",color:"white" }},
              error:{style:{background:"black",color:"white" }}
            }
          }/>
          {children}</body>
      </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
