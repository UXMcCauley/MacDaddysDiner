'use client';

import { useState } from 'react';
import Image from 'next/image';

const galleryImages = [
  { src: '/images/gallery-1.png', alt: 'Diner interior with vintage decor', category: 'interior' },
  { src: '/images/gallery-2.png', alt: 'Classic burger and fries', category: 'food' },
  { src: '/images/gallery-3.png', alt: 'Breakfast omelette', category: 'food' },
  { src: '/images/gallery-4.png', alt: 'Jukebox and license plates', category: 'interior' },
  { src: '/images/gallery-5.png', alt: 'Chef preparing food', category: 'team' },
  { src: '/images/gallery-6.png', alt: 'Milkshake', category: 'food' },
  { src: '/images/gallery-7.png', alt: 'Counter seating', category: 'interior' },
  { src: '/images/gallery-8.png', alt: 'Exterior with Route 28 sign', category: 'exterior' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', 'food', 'interior', 'team', 'exterior'];

  const filteredImages = filter === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl md:text-6xl text-[#1a1a1a] mb-4">
            Gallery
          </h2>
          <div className="w-32 h-1 bg-[#C41E3A] mx-auto mb-4"></div>
          <p className="font-accent text-xl text-gray-600 italic">
            A peek inside the diner
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`font-headline text-sm md:text-base tracking-wider px-4 py-2 rounded transition-all ${
                filter === category
                  ? 'bg-[#C41E3A] text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#C41E3A] hover:text-white border-2 border-[#1a1a1a]'
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Social CTA */}
        <div className="mt-12 text-center">
          <p className="font-headline text-xl text-[#1a1a1a] tracking-wider mb-4">
            FOLLOW US FOR MORE
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/macdaddysdiner"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-none font-headline tracking-wider"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              INSTAGRAM
            </a>
            <a
              href="https://www.facebook.com/MacDaddysDiner"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#1877F2] text-white border-none font-headline tracking-wider"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              FACEBOOK
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-[#C41E3A] transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
