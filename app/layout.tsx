import "./globals.css";

export const metadata = {
  title: "Campus Learning Hub",
  description: "CBT Examination Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}