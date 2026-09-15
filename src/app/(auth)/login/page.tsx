'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Repeat, 
  CheckCircle2,
  QrCode
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('marcus@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePersona, setActivePersona] = useState('marcus@example.com');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in.');
      }

      localStorage.setItem('demo_user', JSON.stringify(data.user));
      router.push('/listings');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setActivePersona(demoEmail);
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('demo_user', JSON.stringify(data.user));
        router.push('/listings');
      } else {
        throw new Error(data.error || 'Demo login failed.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-10 min-h-[calc(100vh-5rem)]">
      {/* Background ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Standards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold mb-3">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Zero-Cash Peer Economy</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Access Your Barter Engine</h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
                  Trade books, creative gear, and tech directly. Verified handshakes without payment gateway fees.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center p-1 rounded-full bg-surface-container-low">
                <button
                  type="button"
                  className="flex-1 py-2 rounded-full text-xs font-bold transition-all text-center bg-surface-container-lowest text-primary shadow-sm"
                >
                  Sign In
                </button>
                <Link
                  href="/register"
                  className="flex-1 py-2 rounded-full text-xs font-semibold transition-all text-center text-on-surface-variant hover:text-on-surface"
                >
                  Create Account
                </Link>
              </div>

              {error && (
                <div className="p-3.5 bg-error-container/40 border border-error/30 rounded-xl text-on-error-container text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-error" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface">Email Address</label>
                    <span className="text-[11px] text-tertiary font-medium">Campus / Verified Email</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                    <Mail className="w-4 h-4 text-outline" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface">Secret Passphrase</label>
                    <span className="text-[11px] text-primary hover:underline cursor-pointer">Default: password123</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                    <Lock className="w-4 h-4 text-outline" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-outline hover:text-on-surface"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary"
                    />
                    <span className="text-xs text-on-surface-variant">Remember this browser</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>TLS 1.3</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to BarterHub'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-on-surface-variant">
                  New trader?{' '}
                  <Link href="/register" className="font-bold text-primary hover:underline">
                    Register a free profile
                  </Link>
                </span>
              </div>
            </div>

            {/* Barter Guarantee Standards */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Barter Guarantee Standards</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                  <QrCode className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-xs font-bold text-on-surface">6-Digit PIN</p>
                  <p className="text-[10px] text-on-surface-variant">Safe Handover</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                  <Repeat className="w-5 h-5 text-tertiary mx-auto mb-1" />
                  <p className="text-xs font-bold text-on-surface">Zero Fees</p>
                  <p className="text-[10px] text-on-surface-variant">Pure Barter</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-bold text-on-surface">ID Verified</p>
                  <p className="text-[10px] text-on-surface-variant">Campus Hubs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rapid Persona Switcher (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Demo Sandbox Utility
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Rapid Persona Switcher</h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Sandbox Session</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Switch identities with 1 click to test mutual barter negotiations, send counter-offers, and verify 6-digit handshake codes from both buyer and seller perspectives.
              </p>

              {/* Featured Active Trader: Marcus */}
              <div className="relative p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/40 shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Marcus Chen"
                        className="w-14 h-14 rounded-full object-cover shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-on-surface">Marcus Chen</h3>
                        <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                          Default Demo Persona
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Tech Enthusiast & Student • 14 Confirmed Swaps</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('marcus@example.com')}
                    className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-all"
                  >
                    Quick Login as Marcus
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-outline-variant/10 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-outline font-semibold text-[11px]">Active Listings:</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface text-[11px]">Sony WH-1000XM4</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface text-[11px]">Keychron Q1 Pro Mechanical</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-bold text-[11px]">+2 more</span>
                </div>
              </div>

              {/* Grid of Other Personas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Alex Turner */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                          alt="Alex Turner"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Alex Turner</h4>
                          <p className="text-[11px] text-on-surface-variant">Software Engineer</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                        19 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Data-Intensive Apps</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Kindle Oasis</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">NYC Tech Node</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('alex@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to Alex
                    </button>
                  </div>
                </div>

                {/* Sarah Jenkins */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                          alt="Sarah Jenkins"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Sarah Jenkins</h4>
                          <p className="text-[11px] text-on-surface-variant">PhD Researcher</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                        18 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Neural Science</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">iPad Pro 11"</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">Boston Hub</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('sarah@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to Sarah
                    </button>
                  </div>
                </div>

                {/* Elena Rostova */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                          alt="Elena Rostova"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Elena Rostova</h4>
                          <p className="text-[11px] text-on-surface-variant">CS Graduate Student</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                        35 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Calculus Stewart 9th</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Logitech MX Master 3S</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">Austin Quad</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('elena@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to Elena
                    </button>
                  </div>
                </div>

                {/* David Miller */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                          alt="David Miller"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">David Miller</h4>
                          <p className="text-[11px] text-on-surface-variant">Audio & Sound Producer</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold">
                        6 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">AudioQuest DAC</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Yeti Pro Mic</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">Seattle Hub</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('david@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to David
                    </button>
                  </div>
                </div>

                {/* Chloe Zhao */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                          alt="Chloe Zhao"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Chloe Zhao</h4>
                          <p className="text-[11px] text-on-surface-variant">Staff Product Designer</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                        15 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">iPad Air M2</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">AirPods Pro 2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">Seattle Tech Commons</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('chloe@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to Chloe
                    </button>
                  </div>
                </div>

                {/* Julian Vance */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 shadow-sm transition-all flex flex-col justify-between gap-3 group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
                          alt="Julian Vance"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Julian Vance</h4>
                          <p className="text-[11px] text-on-surface-variant">Camera & Synth Artisan</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                        27 Swaps
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Fujifilm X-T30 II</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface">Shure SM7B</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="text-[10px] text-outline">Portland Arts District</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('julian@example.com')}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-[11px] font-bold text-on-surface transition-all"
                    >
                      Switch to Julian
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
