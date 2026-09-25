import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DancePal — Aprende coreografías paso a paso",
  description:
    "Descompón la coreografía de tus bandas favoritas en pasos, practícala a tu ritmo con slow-motion, loop y espejo, y sigue tu progreso.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DancePal",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/coreos", label: "Coreos" },
  { href: "/perfil", label: "Mi progreso" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-neutral-100">
        <PwaRegister />
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-xl">🕺</span>
              <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                DancePal
              </span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-neutral-400 transition hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
          DancePal · practica a tu ritmo 🎵
        </footer>
      </body>
    </html>
  );
}
