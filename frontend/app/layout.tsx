import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charulata — Online Plant Nursery",
  description: "Buy green to save green — fruit trees, flowers, ornamentals and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
