export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0f172a", color: "#f8fafc", margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
