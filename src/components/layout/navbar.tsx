'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeftRight,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Search,
  CheckCircle2,
  Menu,
  X,
  MapPin,
  Bell,
  Heart,
  Mic,
  LayoutGrid,
} from 'lucide-react';
import { UserSummary } from '@/lib/types';
import { CITIES, TRENDING_SEARCHES } from '@/lib/catalog';
import { useMarketplace } from './marketplace-provider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { city, setCity, rememberSearch, recentSearches } = useMarketplace();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unread, setUnread] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; href?: string | null; isRead: boolean }[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            fetch('/api/notifications')
              .then((r) => r.json())
              .then((d) => {
                setUnread(d.unread || 0);
                setNotes(d.notifications || []);
              })
              .catch(() => {});
            fetch('/api/conversations')
              .then((r) => r.json())
              .then((d) => setChatUnread(d.unreadTotal || 0))
              .catch(() => {});
            return;
          }
        }
        setUser(null);
        setUnread(0);
        setChatUnread(0);
        setNotes([]);
      } catch {
        setUser(null);
        setUnread(0);
        setChatUnread(0);
        setNotes([]);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    router.push('/');
  };

  const goSearch = (q: string) => {
    rememberSearch(q);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city && city !== 'All India') params.set('city', city);
    router.push(`/listings?${params.toString()}`);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goSearch(searchQuery);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please type your search query directly.');
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      setIsListening(true);
      rec.onresult = (event: any) => {
        const text = event.results?.[0]?.[0]?.transcript;
        if (text) {
          setSearchQuery(text);
          goSearch(text);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2.5 lg:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none group">
            <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 180 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#4648d4" />
              <path d="M14 16H26M26 16L22 12M26 16L22 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M26 24H14M14 24L18 20M14 24L18 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="48" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="22" fontWeight="800" fill="#131b2e" letterSpacing="-0.5">
                Barter<tspan fill="#4648d4">Hub</tspan>
              </text>
            </svg>
          </Link>

          {/* Center Search Bar with Location Pill */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant/40 shadow-inner">
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest text-xs font-semibold text-on-surface shadow-xs cursor-pointer hover:bg-surface-container transition-colors shrink-0">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer max-w-[85px] text-xs font-medium truncate"
                aria-label="Location"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <div className="h-4 w-px bg-outline-variant/60 mx-1.5 shrink-0" />

            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0 flex items-center">
              <Search className="w-3.5 h-3.5 text-outline mr-1.5 shrink-0 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search books, gear..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline/80"
              />

              <div className="flex items-center gap-0.5 shrink-0 ml-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchRef.current?.focus();
                    }}
                    className="p-1 text-outline hover:text-on-surface rounded-full"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={startVoice}
                  className={`p-1 rounded-full transition-all ${
                    isListening
                      ? 'bg-clay text-white animate-pulse'
                      : 'text-outline hover:text-primary hover:bg-surface-container'
                  }`}
                  aria-label="Voice search"
                  title={isListening ? 'Listening... speak now' : 'Voice search'}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-container transition-all shadow-xs shrink-0"
                >
                  Search
                </button>
              </div>

              {searchOpen && (
                <div className="absolute top-11 left-0 right-0 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-lift p-3 z-50">
                  {recentSearches.length > 0 && (
                    <div className="mb-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1">Recent Searches</p>
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => goSearch(s)}
                          className="block w-full text-left text-xs py-1 text-on-surface hover:text-primary transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] uppercase tracking-wider text-outline font-bold mb-1.5">Trending Swaps</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => goSearch(s)}
                        className="px-2.5 py-1 rounded-full bg-surface-container-low text-[11px] font-medium text-on-surface hover:bg-primary-fixed hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            <Link
              href="/listings"
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                pathname.startsWith('/listings') && pathname !== '/listings/new'
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/offers"
              className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                pathname.startsWith('/offers')
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span>Offers & Swaps</span>
              {user && unread > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px] shrink-0 leading-none">
                  {unread}
                </span>
              )}
            </Link>
            <Link
              href="/messages"
              className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                pathname.startsWith('/messages')
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span>Messages</span>
              {user && chatUnread > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-primary text-white font-bold text-[10px] shrink-0 leading-none">
                  {chatUnread}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                pathname === '/dashboard'
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              My Ads
            </Link>
            <Link
              href="/favorites"
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                pathname === '/favorites'
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Favorites
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/listings/new"
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary hover:bg-secondary-container text-white text-xs font-bold shadow-[0_4px_14px_rgba(113,42,226,0.3)] transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Barter</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotesOpen(!notesOpen)}
                    className="p-2 rounded-full text-on-surface hover:bg-surface-container relative transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unread > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-clay text-white text-[10px] leading-4 text-center font-bold">
                        {unread}
                      </span>
                    )}
                  </button>

                  {notesOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-modal p-3 z-50">
                      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                        <span className="text-xs font-bold text-on-surface">Notifications</span>
                        <button
                          className="text-[11px] text-primary font-semibold hover:underline"
                          onClick={() => {
                            fetch('/api/notifications', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ all: true }),
                            });
                            setUnread(0);
                            setNotes((n) => n.map((x) => ({ ...x, isRead: true })));
                          }}
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto pt-2 space-y-1">
                        {notes.length === 0 && (
                          <p className="text-xs text-outline p-3 text-center">No notifications yet.</p>
                        )}
                        {notes.map((n) => (
                          <Link
                            key={n.id}
                            href={n.href || '/offers'}
                            onClick={() => setNotesOpen(false)}
                            className={`block p-2 rounded-xl text-xs hover:bg-surface-container-low transition-colors ${
                              n.isRead ? 'opacity-65' : 'bg-surface-container/50 font-medium'
                            }`}
                          >
                            <p className="font-semibold text-on-surface">{n.title}</p>
                            <p className="text-outline line-clamp-2 mt-0.5">{n.body}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar */}
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-container transition-colors"
                  title="My Profile"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-fixed border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.slice(0, 1)
                    )}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-outline hover:text-clay rounded-full hover:bg-surface-container transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-surface-container-low rounded-full transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-full text-on-surface hover:bg-surface-container"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/30">
            <MapPin className="w-4 h-4 text-primary" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-surface-container-low text-xs font-semibold px-2 py-1 rounded-lg border-none focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <nav className="space-y-1">
            <Link
              href="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container-low"
            >
              Explore Listings
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container-low"
            >
              <span>Offers & Swaps</span>
              {user && unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                  {unread}
                </span>
              )}
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container-low"
            >
              <span>Messages</span>
              {user && chatUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-white font-bold text-[10px]">
                  {chatUnread}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container-low"
            >
              My Ads Desk
            </Link>
            <Link
              href="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold hover:bg-surface-container-low"
            >
              Saved Listings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
