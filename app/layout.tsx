import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/ThemeProvider";

export const metadata = {
  title: "EcoSnap AI",
  description: "Scan products, get eco scores and alternatives.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


