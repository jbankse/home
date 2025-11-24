"use client";

import Link from "next/link";
export default function Home() {
  const links = [
    { text: "A04-B1Q", href: "/A04-B1Q" },
    { text: "A31-C2C", href: "https://instagram.com/unmarkedlabel" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-[#171717] font-sans flex flex-col overflow-hidden relative">

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-[768px] mx-auto flex flex-col items-center justify-end pb-128 z-20 relative">
        <div className="w-full flex flex-col gap-4 text-center">
          <div className="flex justify-center">
            <h4 className="font-bold uppercase tracking-normal">ARCHIVES</h4>
          </div>
          <div className="flex justify-center gap-2">
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  className="underline"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.text}
                </Link>
                {index < links.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full h-[64px] flex items-center justify-center z-20 relative">
        <p className="text-sm">UNMARKED—LABEL © 2026</p>
      </footer>
    </div>
  );
}
