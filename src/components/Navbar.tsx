'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#menu', label: 'Menu' },
    { href: '#about', label: 'About' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/images/logo.avif"
                alt="Mac Daddy's Diner"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-headline text-xl md:text-2xl text-white tracking-wider hidden sm:block">
              MAC DADDY&apos;S
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-headline text-lg text-white hover:text-[#C41E3A] transition-colors tracking-wide retro-underline"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[#C41E3A]"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-[#C41E3A] rounded-full flex items-center justify-center text-white font-bold">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-headline text-sm text-gray-500">Signed in as</p>
                      <p className="font-headline truncate">{session.user?.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 font-headline text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2 rounded font-headline tracking-wider hover:bg-[#a01830] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                SIGN IN
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Auth */}
            {status !== 'loading' && session ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-[#C41E3A]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#C41E3A] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                </button>
              </div>
            ) : status !== 'loading' ? (
              <Link href="/login" className="text-[#C41E3A]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </Link>
            ) : null}

            <button
              className="text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 font-headline text-xl text-white hover:text-[#C41E3A] transition-colors tracking-wide text-center"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="block w-full py-3 font-headline text-xl text-[#C41E3A] tracking-wide text-center"
              >
                SIGN OUT
              </button>
            )}
          </div>
        )}

        {/* Mobile User Menu */}
        {showUserMenu && session && (
          <div className="md:hidden absolute right-4 top-16 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
            <div className="px-4 py-2 border-b">
              <p className="font-headline text-sm text-gray-500">Signed in as</p>
              <p className="font-headline truncate">{session.user?.name}</p>
            </div>
            <button
              onClick={() => {
                setShowUserMenu(false);
                signOut();
              }}
              className="w-full text-left px-4 py-2 font-headline text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Decorative stripe */}
      <div className="h-1 bg-gradient-to-r from-[#C41E3A] via-[#FFF8E7] to-[#C41E3A]"></div>
    </nav>
  );
}
