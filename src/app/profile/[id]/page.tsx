'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Repeat, 
  Package, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import ListingCard from '@/components/marketplace/listing-card';
import { UserSummary, ListingItem, ReviewItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function UserProfilePage() {
  const { id } = useParams();

  const [profileUser, setProfileUser] = useState<UserSummary | null>(null);
  const [userListings, setUserListings] = useState<ListingItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'REVIEWS'>('LISTINGS');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch listings by this user
        const [listingsRes, reviewsRes] = await Promise.all([
          fetch(`/api/listings?limit=50`),
          fetch(`/api/reviews?userId=${id}`),
        ]);

        if (listingsRes.ok) {
          const lData = await listingsRes.json();
          const items: ListingItem[] = lData.listings || [];
          const userItems = items.filter((item) => item.userId === id);
          setUserListings(userItems);

          if (userItems.length > 0) {
            setProfileUser(userItems[0].user);
          }
        }

        if (reviewsRes.ok) {
          const rData = await reviewsRes.json();
          setReviews(rData.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-64 bg-gray-100 rounded-3xl animate-pulse mb-8" />
      </div>
    );
  }

  const user = profileUser || {
    id: id as string,
    name: 'Community Member',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    city: 'New York',
    state: 'NY',
    isVerified: true,
    reputationScore: 4.9,
    totalReviews: reviews.length,
    totalTrades: 15,
    bio: 'Avid reader and trade enthusiast.',
    responseRate: 98,
    avgResponseTime: 'Within 30 mins',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Banner & Card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-outline-variant/20">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-primary/20 shadow-md"
              />
              {user.isVerified && (
                <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-white p-1 rounded-full shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">{user.name}</h1>
                {user.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                    Campus Safe Zone Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {user.city}, {user.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  {user.avgResponseTime || 'Replies quickly'}
                </span>
              </div>

              {user.bio && (
                <p className="text-xs text-on-surface-variant mt-3 max-w-xl leading-relaxed bg-surface-container-low p-3 rounded-2xl">
                  &quot;{user.bio}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/messages?recipientId=${user.id}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-full shadow-lift transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Message Trader
            </Link>
          </div>

        </div>

        {/* Reputation Score & Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
          <div className="p-4 bg-surface-container-low rounded-2xl">
            <div className="flex items-center justify-center gap-1 text-tertiary mb-0.5">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xl font-extrabold text-on-surface">{user.reputationScore.toFixed(1)}</span>
            </div>
            <p className="text-[11px] text-outline font-semibold">Community Trust ({reviews.length})</p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl">
            <div className="text-xl font-extrabold text-primary mb-0.5">{user.totalTrades || 0}</div>
            <p className="text-[11px] text-outline font-semibold">Successful Swaps</p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl">
            <div className="text-xl font-extrabold text-emerald-600 mb-0.5">100%</div>
            <p className="text-[11px] text-outline font-semibold">Handshake Accuracy</p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl">
            <div className="text-xl font-extrabold text-secondary mb-0.5">{user.responseRate || 98}%</div>
            <p className="text-[11px] text-outline font-semibold">Response Rate</p>
          </div>
        </div>

      </div>

      {/* Tabs: Active Listings vs Reviews */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab('LISTINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'LISTINGS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Active Inventory ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'REVIEWS'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Verified Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'LISTINGS' && (
        userListings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-700">No active listings currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'REVIEWS' && (
        reviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-700">No reviews published yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.reviewer.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={rev.reviewer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900">{rev.reviewer.name}</span>
                      <p className="text-[11px] text-gray-700">{formatDate(rev.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.overallRating ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>

                {/* Rating Criteria Breakdown Mini Badges */}
                <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-gray-700">
                  <span>Condition Accuracy: <strong>{rev.conditionRating}/5 ★</strong></span>
                  <span>•</span>
                  <span>Communication: <strong>{rev.communicationRating}/5 ★</strong></span>
                  <span>•</span>
                  <span>Punctuality: <strong>{rev.punctualityRating}/5 ★</strong></span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}
