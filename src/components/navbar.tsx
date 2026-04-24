"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Plane className="h-5 w-5 text-primary" />
          <span>AI Travel Negotiator</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 text-sm transition-colors hover:text-primary ${
              pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
