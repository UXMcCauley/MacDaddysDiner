'use client';

import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

export default function About() {
  const { about, features } = siteContent;

  return (
    <section id="about" className="py-16 md:py-24 bg-[#1a1a1a] text-white">
      {/* Decorative top stripe */}
      <div className="diner-divider mb-16"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
            Our Story
          </h2>
          <div className="w-32 h-1 bg-[#C41E3A] mx-auto mb-4"></div>
          <p className="font-headline text-2xl text-[#C41E3A] tracking-widest">
            {about.headline.toUpperCase()}
          </p>
        </div>

        {/* Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden retro-border">
              <Image
                src="/images/about-interior.png"
                alt="Inside Mac Daddy's Diner"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#C41E3A] text-white rounded-full w-32 h-32 flex items-center justify-center rotate-12 shadow-xl">
              <div className="text-center -rotate-12">
                <p className="font-headline text-sm">EST.</p>
                <p className="font-display text-3xl">{siteContent.business.established}</p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div>
            <p className="font-accent text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              {about.story}
            </p>

            {/* Values */}
            <div className="space-y-4">
              {about.values.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#C41E3A] rotate-45"></div>
                  <span className="font-headline text-lg tracking-wide">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur rounded-lg p-8 text-center hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-16 bg-[#C41E3A] rounded-full flex items-center justify-center mx-auto mb-4">
                {index === 0 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="font-headline text-xl text-[#C41E3A] tracking-wider mb-2">
                {feature.title.toUpperCase()}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <h3 className="font-headline text-3xl text-center text-[#C41E3A] tracking-widest mb-12">
            MEET THE CREW
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {siteContent.team.map((member, index) => (
              <div key={index} className="text-center max-w-sm">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#C41E3A]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-headline text-2xl tracking-wide">{member.name}</h4>
                <p className="font-accent text-[#C41E3A] italic mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom stripe */}
      <div className="diner-divider mt-16"></div>
    </section>
  );
}
