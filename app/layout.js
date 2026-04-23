import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "ReplyJet — AI Reply Engine",
  description: "AI-powered customer reply generator. Arabic & English. Angry, Sales, Normal modes.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
