import type { Metadata } from "next";
import "./globals.css";
import Favicon from "../../public/favicon.ico";

export const metadata: Metadata = {
  title: "PromptCraft",
  description:
    "Discover professionally crafted AI prompts for writing, coding, design, and business. Boost your productivity and unlock the full potential of AI tools.",
  keywords:
    "AI prompts, prompt engineering, ChatGPT prompts, AI tools, productivity",
  icons: { icon: Favicon.src },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
