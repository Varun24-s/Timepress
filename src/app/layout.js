import "./globals.css";

export const metadata = {
  title: "TimePress | Historical Newspaper Generator",
  description: "Generate an authentic newspaper from any date in history.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#f4f1ea]">{children}</body>
    </html>
  );
}