'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="bg-[#FFF8E7] rounded-lg p-8 max-w-md w-full shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/logo.avif"
              alt="Mac Daddy's Diner"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-3xl text-[#1a1a1a]">
            Join the Family
          </h1>
          <p className="text-gray-600 mt-2 font-accent italic">
            Sign in to heart your favorite dishes!
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          {/* Facebook Login */}
          <button
            onClick={() => signIn('facebook', { callbackUrl: '/#menu' })}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-headline tracking-wider py-3 px-4 rounded-lg hover:bg-[#166fe5] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            CONTINUE WITH FACEBOOK
          </button>

          {/* Instagram info (uses Facebook OAuth) */}
          <div className="text-center text-sm text-gray-500">
            <p>Instagram login is handled through Facebook</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">Why sign in?</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Benefits */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C41E3A] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700">Heart your favorite dishes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C41E3A] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <span className="text-gray-700">See what others love</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C41E3A] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700">Help us know your favorites</span>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[#C41E3A] hover:underline font-headline tracking-wider"
          >
            &larr; BACK TO MENU
          </Link>
        </div>
      </div>
    </div>
  );
}
