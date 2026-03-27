"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin =
    session?.user?.role === "SUPER_ADMIN" ||
    session?.user?.role === "EMPLOYER_ADMIN";

  return (
    <header className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-heading text-xl font-bold tracking-tight">
              FNN Employment Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/employers" className="hover:text-teal transition-colors">
              Employers
            </Link>
            <Link href="/jobs" className="hover:text-teal transition-colors">
              Jobs
            </Link>
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-teal transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="hover:text-teal transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:text-teal transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-teal transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-teal hover:bg-teal-dark px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/employers" className="block py-2 hover:text-teal" onClick={() => setMobileMenuOpen(false)}>
              Employers
            </Link>
            <Link href="/jobs" className="block py-2 hover:text-teal" onClick={() => setMobileMenuOpen(false)}>
              Jobs
            </Link>
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="block py-2 hover:text-teal" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="block py-2 hover:text-teal" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block py-2 hover:text-teal">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-teal" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Link href="/register" className="block py-2 bg-teal hover:bg-teal-dark px-4 rounded-md text-center" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
