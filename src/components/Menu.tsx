'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import menuDataFallback from '@/data/menu.json';
import HeartButton from './HeartButton';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  popular?: boolean;
  featured?: boolean;
  available?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  items: MenuItem[];
}

interface DailySpecial {
  day: string;
  name: string;
  description: string;
  price: number;
  active?: boolean;
}

interface MenuData {
  categories: MenuCategory[];
  specials: {
    daily: DailySpecial[];
  };
  notices: string[];
}

export default function Menu() {
  const { data: session } = useSession();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('breakfast');
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<string[]>([]);

  useEffect(() => {
    fetchMenu();
    fetchLikes();
  }, [session]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success && data.data) {
        setMenuData(data.data);
        if (data.data.categories?.length > 0) {
          setActiveCategory(data.data.categories[0].id);
        }
      } else {
        setMenuData(menuDataFallback as unknown as MenuData);
      }
    } catch {
      setMenuData(menuDataFallback as unknown as MenuData);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const userId = session?.user?.id || '';
      const res = await fetch(`/api/likes?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setLikeCounts(data.data.counts || {});
        setUserLikes(data.data.userLikes || []);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <section id="menu" className="py-16 md:py-24 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!menuData) return null;

  const categories = menuData.categories || [];
  const specials = menuData.specials?.daily?.filter((s) => s.active !== false) || [];
  const notices = menuData.notices || [];

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl md:text-6xl text-[#1a1a1a] mb-4">
            Our Menu
          </h2>
          <div className="w-32 h-1 bg-[#C41E3A] mx-auto mb-4"></div>
          <p className="font-accent text-xl text-gray-600 italic">
            Made fresh daily with love
          </p>
          {!session && (
            <p className="text-sm text-gray-500 mt-2">
              <a href="/login" className="text-[#C41E3A] hover:underline">
                Sign in
              </a>{' '}
              to heart your favorite dishes!
            </p>
          )}
        </div>

        {/* Daily Specials Banner */}
        {specials.length > 0 && (
          <div className="bg-[#1a1a1a] text-white rounded-lg p-6 mb-12 retro-border">
            <h3 className="font-headline text-2xl text-[#C41E3A] tracking-wider mb-4 text-center">
              DAILY SPECIALS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {specials.map((special) => (
                <div key={special.day} className="text-center">
                  <p className="font-headline text-[#C41E3A] tracking-wider">{special.day}</p>
                  <p className="font-accent font-bold">{special.name}</p>
                  <p className="text-sm text-gray-400">{special.description}</p>
                  <p className="font-headline text-lg mt-1">{formatPrice(special.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`font-headline text-lg md:text-xl tracking-wider px-4 py-2 rounded transition-all ${
                activeCategory === category.id
                  ? 'bg-[#C41E3A] text-white'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#C41E3A] hover:text-white border-2 border-[#1a1a1a]'
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${activeCategory === category.id ? 'block' : 'hidden'}`}
          >
            {/* Category Description */}
            {category.description && (
              <p className="font-accent text-lg text-gray-600 text-center italic mb-8">
                {category.description}
              </p>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items
                ?.filter((item) => item.available !== false)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow ${
                      item.featured ? 'ring-2 ring-[#C41E3A] relative' : ''
                    }`}
                  >
                    {item.featured && (
                      <div className="absolute -top-3 -right-3 bg-[#C41E3A] text-white font-headline text-sm px-3 py-1 rounded-full">
                        SIGNATURE
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-headline text-xl text-[#1a1a1a] tracking-wide">
                            {item.name}
                          </h4>
                          {item.popular && (
                            <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded">
                              POPULAR
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-600 mt-2 text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-headline text-2xl text-[#C41E3A] whitespace-nowrap">
                          {formatPrice(item.price)}
                        </span>
                        <HeartButton
                          itemId={item.id}
                          categoryId={category.id}
                          initialCount={likeCounts[item.id] || 0}
                          initialLiked={userLikes.includes(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Notice */}
        {notices.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-block bg-white rounded-lg px-6 py-4 shadow">
              {notices.map((notice, index) => (
                <p key={index} className="text-sm text-gray-500 italic">
                  {notice}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
