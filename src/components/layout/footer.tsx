import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ShieldCheck, Repeat, HeartHandshake, Sparkles, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest text-on-surface-variant pt-16 pb-12 border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-outline-variant/30">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-on-surface font-bold text-sm mb-1">True Barter & Cash Hybrid</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Swap item for item, offer partial cash top-ups, or buy directly with standard valuations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-on-surface font-bold text-sm mb-1">Dual-Sided Verified Reviews</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Transparent trader reputation scores with condition accuracy and punctuality metrics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-on-surface font-bold text-sm mb-1">In-Person Handshake PIN</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                6-digit PIN handshake verification protects your exchange during public meetups.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-8 w-auto" viewBox="0 0 180 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#4648d4" />
                <path d="M14 16H26M26 16L22 12M26 16L22 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26 24H14M14 24L18 20M14 24L18 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="48" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="22" fontWeight="800" fill="#131b2e" letterSpacing="-0.5">
                  Barter<tspan fill="#4648d4">Hub</tspan>
                </text>
              </svg>
            </div>
            <p className="text-xs text-outline leading-relaxed mb-4">
              The premier circular marketplace for peer-to-peer book swaps, textbooks, gear, and sustainable trading.
            </p>
          </div>

          <div>
            <h5 className="text-on-surface font-bold text-xs mb-4 tracking-wider uppercase">Explore</h5>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li><Link href="/listings?type=BOOK" className="hover:text-primary transition-colors">College Textbooks</Link></li>
              <li><Link href="/listings?type=BOOK" className="hover:text-primary transition-colors">Fiction & Literature</Link></li>
              <li><Link href="/listings?type=PRODUCT" className="hover:text-primary transition-colors">Audio & Headphones</Link></li>
              <li><Link href="/listings?type=PRODUCT" className="hover:text-primary transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/listings?exchange=BARTER_ONLY" className="hover:text-primary transition-colors">Barter-Only Swaps</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-on-surface font-bold text-xs mb-4 tracking-wider uppercase">Platform</h5>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li><Link href="/listings/new" className="hover:text-primary transition-colors">Post Barter Ad</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors">Offers & Swaps Hub</Link></li>
              <li><Link href="/messages" className="hover:text-primary transition-colors">Negotiation Chats</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Listings Desk</Link></li>
              <li><Link href="/database" className="hover:text-primary transition-colors flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-primary" /> Database & ER Architecture</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-on-surface font-bold text-xs mb-4 tracking-wider uppercase">Safety & Trust</h5>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> Campus Safe Zones</li>
              <li>Handshake PIN Security</li>
              <li>Condition Grading Guide</li>
              <li>Community Standards</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between text-xs text-outline">
          <p>© {new Date().getFullYear()} BarterHub Modern Circular Marketplace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-on-surface cursor-pointer">Terms</span>
            <span className="hover:text-on-surface cursor-pointer">Privacy</span>
            <span className="hover:text-on-surface cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
