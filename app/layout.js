import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "ReplyJet",
  description: "AI customer reply generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
