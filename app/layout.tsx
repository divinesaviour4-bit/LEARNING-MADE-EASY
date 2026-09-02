import "./globals.css";

export const metadata = {
  title: "Campus Learning Hub",
  description: "UniUyo & AKSU CBT and AI Study Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}