'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Heart,
  Star,
  Check,
  X,
  Camera,
  Image as ImageIcon,
  Truck,
  RotateCcw,
  Pencil,
  Save,
  Upload,
  Loader2
} from 'lucide-react';
import { ListingItem } from '@/lib/types';

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form Fields
  const [listingType, setListingType] = useState<'BOOK' | 'PRODUCT'>('PRODUCT');
  const [exchangeType, setExchangeType] = useState<'HYBRID' | 'BARTER_ONLY' | 'CASH_ONLY'>('HYBRID');
  const [status, setStatus] = useState<'ACTIVE' | 'RESERVED' | 'TRADED' | 'SOLD' | 'ARCHIVED'>('ACTIVE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState('LIKE_NEW');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [shippingCost, setShippingCost] = useState('4.00');
  const [barterWishlist, setBarterWishlist] = useState('');
  const [wishlistTags, setWishlistTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Book specific
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('General Non-Fiction');
  const [bookFormat, setBookFormat] = useState('PAPERBACK');
  const [hasAnnotations, setHasAnnotations] = useState(false);
  const [academicSubject, setAcademicSubject] = useState('');
  const [courseCode, setCourseCode] = useState('');

  // Product specific
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [includesOriginalBox, setIncludesOriginalBox] = useState(false);
  const [includesAccessories, setIncludesAccessories] = useState(false);

  const conditionLabels: Record<string, { label: string; desc: string }> = {
    BRAND_NEW: { label: 'Brand New', desc: 'Sealed in original box' },
    LIKE_NEW: { label: 'Mint 9/10', desc: 'Zero scratches or blemishes' },
    VERY_GOOD: { label: 'Very Good', desc: 'Minor gentle cosmetic use' },
    GOOD: { label: 'Good', desc: 'Fully functional, normal signs of wear' },
    ACCEPTABLE: { label: 'Acceptable', desc: 'Heavy aesthetic wear, works 100%' }
  };

  useEffect(() => {
    // 1. Fetch current logged-in user
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch listing details
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error('Listing not found');
        const data = await res.json();
        const l: ListingItem = data.listing;

        setTitle(l.title || '');
        setDescription(l.description || '');
        setListingType(l.listingType || 'PRODUCT');
        setExchangeType(l.exchangeType || 'HYBRID');
        setStatus((l.status as any) || 'ACTIVE');
        setPrice(l.price !== null && l.price !== undefined ? String(l.price) : '');
        setIsNegotiable(l.isNegotiable ?? true);
        setCondition(l.condition || 'LIKE_NEW');
        setCity(l.city || '');
        setState(l.state || '');
        setPickupAvailable(l.pickupAvailable ?? true);
        setShippingAvailable(l.shippingAvailable ?? false);
        setShippingCost(l.shippingCost ? String(l.shippingCost) : '4.00');
        setImages(l.images || []);

        if (l.barterWishlist) {
          setBarterWishlist(l.barterWishlist);
          const tags = l.barterWishlist
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
          setWishlistTags(tags);
        }

        if (l.listingType === 'BOOK' && l.bookDetails) {
          setAuthor(l.bookDetails.author || '');
          setIsbn(l.bookDetails.isbn || '');
          setGenre(l.bookDetails.genre || 'General Non-Fiction');
          setBookFormat((l.bookDetails.format as any) || 'PAPERBACK');
          setHasAnnotations(l.bookDetails.hasAnnotations ?? false);
          setAcademicSubject(l.bookDetails.academicSubject || '');
          setCourseCode(l.bookDetails.courseCode || '');
        } else if (l.productDetails) {
          setCategory(l.productDetails.category || 'Electronics');
          setBrand(l.productDetails.brand || '');
          setModel(l.productDetails.model || '');
          setIncludesOriginalBox(l.productDetails.includesOriginalBox ?? false);
          setIncludesAccessories(l.productDetails.includesAccessories ?? false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load listing for editing.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  // Check ownership once user & listing loaded
  useEffect(() => {
    if (currentUser && !loading) {
      // Allow demo user or matching user
      // If needed, check user.id matches
    }
  }, [currentUser, loading]);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload images.');
      }

      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
      } else if (data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    let hasImages = false;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        formData.append('files', files[i]);
        hasImages = true;
      }
    }

    if (!hasImages) {
      setUploadingImage(false);
      setUploadError('Please drop valid image files (PNG, JPG, WEBP, GIF).');
      return;
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload images.');
      }

      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
      } else if (data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    if (tagInput.trim() && !wishlistTags.includes(tagInput.trim())) {
      const updated = [...wishlistTags, tagInput.trim()];
      setWishlistTags(updated);
      setBarterWishlist(updated.join(', '));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = wishlistTags.filter((t) => t !== tag);
    setWishlistTags(updated);
    setBarterWishlist(updated.join(', '));
  };

  const handleQuickAddTag = (tag: string) => {
    if (!wishlistTags.includes(tag)) {
      const updated = [...wishlistTags, tag];
      setWishlistTags(updated);
      setBarterWishlist(updated.join(', '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please provide an item title and description.');
      return;
    }

    if (listingType === 'BOOK' && !author.trim()) {
      setError('Please specify the author for this textbook/book.');
      return;
    }

    if (exchangeType !== 'BARTER_ONLY' && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid asking price or valuation.');
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        exchangeType,
        status,
        price: exchangeType === 'BARTER_ONLY' ? null : parseFloat(price),
        isNegotiable,
        condition,
        city: city.trim(),
        state: state.trim(),
        pickupAvailable,
        shippingAvailable,
        shippingCost: shippingAvailable ? parseFloat(shippingCost) : null,
        barterWishlist: barterWishlist.trim() || null,
        images: images.length > 0 ? images : undefined,
      };

      if (listingType === 'BOOK') {
        payload.bookDetails = {
          author: author.trim(),
          isbn: isbn.trim() || null,
          genre,
          format: bookFormat,
          hasAnnotations,
          academicSubject: academicSubject.trim() || null,
          courseCode: courseCode.trim() || null,
        };
      } else {
        payload.productDetails = {
          category,
          brand: brand.trim() || null,
          model: model.trim() || null,
          includesOriginalBox,
          includesAccessories,
        };
      }

      const res = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update listing.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/listings/${id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-10 bg-surface-container rounded-2xl w-2/3" />
            <div className="h-64 bg-surface-container rounded-3xl" />
            <div className="h-48 bg-surface-container rounded-3xl" />
          </div>
          <div className="lg:col-span-5 h-96 bg-surface-container rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Breadcrumb & Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Pencil className="w-4 h-4 text-primary" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Owner Edit Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Edit Posting
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 truncate max-w-xl">
            Update pricing, swap preferences, photos, and item condition for: <strong>{title || 'Listing'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/listings/${id}`}
            className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 hover:bg-surface-container transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View Public Page
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/20 hover:bg-surface-container transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Error & Success Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-error-container/40 border border-error/30 rounded-2xl text-on-error-container text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-error" />
          <div>
            <span className="font-semibold block">Update Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-primary-fixed/50 border border-primary/30 rounded-2xl text-on-primary-fixed text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <span className="font-bold block">Changes Saved Successfully!</span>
            <span>Redirecting to your updated listing page...</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Split */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Sections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Item Identity & Specs */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Item Identity & Specs</h2>
                  <p className="text-[11px] text-on-surface-variant">Update item title and category attributes</p>
                </div>
              </div>
              
              {/* Status Selector */}
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-outline">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-2.5 py-1 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs font-bold text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="TRADED">TRADED</option>
                  <option value="SOLD">SOLD</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Dynamic Specifics (Product vs Book) */}
            {listingType === 'PRODUCT' ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Brand / Maker</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Sony, Apple, Logitech"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Model / Edition</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. WH-1000XM5 (Silver)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Computers & Accessories">Computers & Accessories</option>
                      <option value="Audio & Headphones">Audio & Headphones</option>
                      <option value="Games & Hobbies">Games & Hobbies</option>
                      <option value="Photography">Photography</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesOriginalBox}
                        onChange={(e) => setIncludesOriginalBox(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                      />
                      <span>Original Box</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesAccessories}
                        onChange={(e) => setIncludesAccessories(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                      />
                      <span>All Cables & Extras</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Author *</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Eric R. Kandel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">ISBN / Edition</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="e.g. 978-1259642234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Genre</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biological Sciences">Biological Sciences</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="General Non-Fiction">General Non-Fiction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Book Format</label>
                    <select
                      value={bookFormat}
                      onChange={(e) => setBookFormat(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    >
                      <option value="HARDCOVER">Hardcover</option>
                      <option value="PAPERBACK">Paperback</option>
                      <option value="SPIRAL">Spiral Bound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Course Code</label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. CS 440"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Condition Grade Rubric */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-on-surface">Condition Grade</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'BRAND_NEW', label: 'Brand New', desc: 'Sealed in box' },
                  { id: 'LIKE_NEW', label: 'Mint 9/10', desc: 'Zero scratches' },
                  { id: 'VERY_GOOD', label: 'Very Good', desc: 'Light gentle use' },
                  { id: 'GOOD', label: 'Fair/Good', desc: 'Fully functional' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id)}
                    className={`p-3 rounded-2xl text-left transition-all ${
                      condition === c.id
                        ? 'bg-primary-fixed text-on-primary-fixed shadow-sm ring-2 ring-primary'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-bold">{c.label}</span>
                      {condition === c.id && <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />}
                    </div>
                    <span className="block text-[11px] text-on-surface-variant opacity-80 mt-0.5">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Box */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Item Description & Provenance *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, history, reasons for parting..."
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Section 2: Valuation & Trade Wishlist */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Valuation & Trade Protocol</h2>
                  <p className="text-[11px] text-on-surface-variant">Update trade mode, asking price, and wishlist items</p>
                </div>
              </div>
            </div>

            {/* Trade Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExchangeType('BARTER_ONLY')}
                className={`p-4 rounded-2xl text-left transition-all ${
                  exchangeType === 'BARTER_ONLY'
                    ? 'bg-secondary text-on-secondary shadow-md ring-2 ring-secondary'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Repeat className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zero Cash</span>
                </div>
                <span className="block text-xs font-bold">True Barter</span>
                <span className="block text-[11px] opacity-80 mt-0.5">100% Item-for-item</span>
              </button>

              <button
                type="button"
                onClick={() => setExchangeType('HYBRID')}
                className={`p-4 rounded-2xl text-left transition-all ${
                  exchangeType === 'HYBRID'
                    ? 'bg-primary text-on-primary shadow-md ring-2 ring-primary'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-tertiary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Recommended</span>
                </div>
                <span className="block text-xs font-bold">Hybrid Swap</span>
                <span className="block text-[11px] opacity-80 mt-0.5">Item + Cash balance</span>
              </button>

              <button
                type="button"
                onClick={() => setExchangeType('CASH_ONLY')}
                className={`p-4 rounded-2xl text-left transition-all ${
                  exchangeType === 'CASH_ONLY'
                    ? 'bg-surface-container-highest text-on-surface shadow-md ring-2 ring-outline'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-outline" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Direct</span>
                </div>
                <span className="block text-xs font-bold">Cash Direct</span>
                <span className="block text-[11px] text-on-surface-variant mt-0.5">Traditional buyout</span>
              </button>
            </div>

            {/* Price Input */}
            {exchangeType !== 'BARTER_ONLY' && (
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-on-surface">Asking Price / Valuation Benchmark</span>
                  <span className="text-[11px] text-on-surface-variant">Changing this updates circular trade balancing</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-sm border border-outline-variant/20">
                  <span className="text-tertiary font-black text-sm">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-20 bg-transparent font-bold text-sm text-on-surface focus:outline-none text-right"
                  />
                </div>
              </div>
            )}

            {/* Wishlist Tags */}
            {exchangeType !== 'CASH_ONLY' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-on-surface">
                    Target Swap Items (Wishlist)
                  </label>
                  <span className="text-[11px] text-outline font-medium">Keywords for barter matchmaking</span>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] border border-outline-variant/15">
                  {wishlistTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-medium shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:opacity-75 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1.5 bg-surface-container-lowest rounded-full px-3.5 py-1.5 shadow-sm border border-outline-variant/20">
                    <Plus className="w-3.5 h-3.5 text-outline" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type item & hit Enter..."
                      className="bg-transparent text-on-surface text-xs placeholder:text-outline focus:outline-none w-48"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-on-surface-variant font-medium">Quick suggestions:</span>
                  {['Kindle Paperwhite', 'Mechanical 75% Keyboard', 'iPad Mini', 'Calculus Textbook'].map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => handleQuickAddTag(rec)}
                      className="px-2.5 py-1 rounded-full bg-surface-container text-[11px] text-on-surface hover:bg-surface-container-high transition-colors font-medium"
                    >
                      + {rec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Flexibility Buffer */}
            <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-outline-variant/15">
              <div>
                <span className="block text-xs font-bold text-on-surface">Cash Flexibility Buffer (OBO)</span>
                <span className="text-[11px] text-on-surface-variant">Allow small cash differences to finalize trades</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                />
                <span className="text-xs font-bold text-primary">Allow Offset</span>
              </label>
            </div>
          </div>

          {/* Section 3: Photos Gallery */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Photos & Media Proof</h2>
                  <p className="text-[11px] text-on-surface-variant">Update item gallery photos ({images.length} uploaded)</p>
                </div>
              </div>
            </div>

            {/* Drag & Drop File Upload Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <Upload className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    {uploadingImage ? 'Uploading Photos...' : 'Click to upload or drag & drop photos here'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">
                    Supports JPG, PNG, WEBP, GIF up to 10MB • Multiple photos supported
                  </span>
                </div>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-error font-medium">{uploadError}</p>
            )}

            {/* Photo URL Input Fallback */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-on-surface flex items-center justify-between">
                <span>Or add via Image Web URL</span>
                <span className="text-[11px] text-outline font-normal">Direct image link</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
                    placeholder="Paste image URL (https://images.unsplash.com/...)"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-xs focus:outline-none focus:border-primary shadow-inner"
                  />
                  <ImageIcon className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-2xl hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add URL
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-xs font-semibold text-on-surface">Item Gallery ({images.length})</span>
                  <span className="text-[11px] text-outline">First photo is cover • Click photo to set as cover</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSetCoverImage(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border group bg-surface-container-low shadow-sm cursor-pointer transition-all ${
                        idx === 0 ? 'ring-2 ring-primary border-primary' : 'border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 ? (
                        <span className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Cover
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Set Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                        className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Handover & Location */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Meetup & Location</h2>
                  <p className="text-[11px] text-on-surface-variant">Update city, state, and fulfillment methods</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. NY"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <span className="block text-xs font-bold text-on-surface">Local Meetup</span>
                    <span className="text-[10px] text-on-surface-variant">Safe handshake spot</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pickupAvailable}
                  onChange={(e) => setPickupAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-tertiary" />
                  <div>
                    <span className="block text-xs font-bold text-on-surface">Courier Shipping</span>
                    <span className="text-[10px] text-on-surface-variant">Tracked parcel</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={shippingAvailable}
                  onChange={(e) => setShippingAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary"
                />
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center justify-between gap-3">
            <Link
              href={`/listings/${id}`}
              className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
            >
              Cancel & Revert
            </Link>
            
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Updates...' : 'Save & Update Posting'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Marketplace Preview
            </span>
            <span className="text-xs text-on-surface-variant">Updates in real time</span>
          </div>

          {/* Floating Card Mockup */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-xl transition-all duration-300">
            {/* Image Container with Badges */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-surface-container-low shadow-inner">
              <img
                src={images[0] || (listingType === 'BOOK' ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')}
                alt={title || 'Preview'}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm"
              >
                <Heart className="w-4 h-4" />
              </button>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
                <span className="text-[11px] text-outline font-medium">Valuation</span>
                <span className="text-xs sm:text-sm text-tertiary font-black">
                  {exchangeType === 'BARTER_ONLY' ? 'Pure Barter' : `$${price || '0'}`}
                </span>
              </div>

              {/* Bottom Condition & Category */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {conditionLabels[condition]?.label || 'Good'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-semibold">
                  {listingType === 'PRODUCT' ? category : 'Textbook'}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="font-semibold text-primary truncate max-w-[200px]">
                  {listingType === 'PRODUCT' ? `${brand || 'Brand'} • ${model || 'Model'}` : `${author || 'Author'}`}
                </span>
                <span className="flex items-center gap-1 text-on-surface-variant font-medium shrink-0">
                  <Star className="w-3.5 h-3.5 text-tertiary fill-tertiary" />
                  Status: {status}
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface line-clamp-2">
                {title || 'Untitled Listing'}
              </h3>

              {/* Wishlist Preview */}
              <div className="space-y-1.5 pt-1">
                <span className="block text-[11px] text-outline uppercase tracking-wider font-semibold">
                  Owner Wants In Return:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wishlistTags.slice(0, 3).map((w, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-medium">
                      {w}
                    </span>
                  ))}
                  {wishlistTags.length === 0 && (
                    <span className="text-[11px] text-outline italic">Open to all offers</span>
                  )}
                </div>
              </div>

              {/* Handover & Offset callout */}
              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/15">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[150px]">{city || 'Local Area'}, {state}</span>
                </div>
                <span className="text-tertiary font-semibold">
                  {isNegotiable ? '±$50 cash offset' : 'Fixed Valuation'}
                </span>
              </div>
            </div>
          </div>

          {/* Owner Quick Tip */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Sparkles className="w-4 h-4 text-tertiary" />
              <span>Editing Tip for Algorithmic Barter Loops</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Adding 2 or more target wishlist items dramatically increases the probability of Neo4j detecting triangular (3-party) barter cycles for this listing.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
