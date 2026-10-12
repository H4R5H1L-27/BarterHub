'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Zap,
  Camera,
  Image as ImageIcon,
  Truck,
  RotateCcw
} from 'lucide-react';

const STEPS = [
  { id: 1, number: '01', title: 'Category & Details', shortDesc: 'Specs & Condition' },
  { id: 2, number: '02', title: 'Photos & Proof', shortDesc: 'Gallery & Angles' },
  { id: 3, number: '03', title: 'Wishlist & Valuation', shortDesc: 'Trade Protocol' },
  { id: 4, number: '04', title: 'Handover & Safe Spots', shortDesc: 'Meetup & Publish' },
];

export default function NewListingPage() {
  const router = useRouter();

  // Active Wizard Step (1, 2, 3, 4)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepEnteredAt, setStepEnteredAt] = useState<number>(Date.now());

  // Form State
  const [listingType, setListingType] = useState<'BOOK' | 'PRODUCT'>('PRODUCT');
  const [exchangeType, setExchangeType] = useState<'HYBRID' | 'BARTER_ONLY' | 'CASH_ONLY'>('HYBRID');
  const [title, setTitle] = useState('Sony WH-1000XM5 Noise-Canceling Headphones');
  const [description, setDescription] = useState('Purchased 4 months ago for study sessions. Includes carrying case, USB-C braid cable, 3.5mm jack, and original retail box. Battery health tested at 98%.');
  const [price, setPrice] = useState('280');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState('LIKE_NEW');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [shippingCost, setShippingCost] = useState('4.00');
  const [barterWishlist, setBarterWishlist] = useState('Kindle Paperwhite, Mech Keyboards, iPad Mini');
  const [wishlistTags, setWishlistTags] = useState<string[]>([
    'Kindle Paperwhite 11th Gen',
    'Mechanical Keyboards (75%)',
    'iPad Mini 6 (WiFi)'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [handoverSpot, setHandoverSpot] = useState('Campus Safe Spot');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  ]);

  // Book specific
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('Biological Sciences');
  const [bookFormat, setBookFormat] = useState('HARDCOVER');
  const [hasAnnotations, setHasAnnotations] = useState(false);
  const [academicSubject, setAcademicSubject] = useState('Neuroscience');
  const [courseCode, setCourseCode] = useState('NEUR 401');

  // Product specific
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Sony');
  const [model, setModel] = useState('WH-1000XM5 (Silver)');
  const [includesOriginalBox, setIncludesOriginalBox] = useState(true);
  const [includesAccessories, setIncludesAccessories] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conditionLabels: Record<string, { label: string; desc: string }> = {
    BRAND_NEW: { label: 'Brand New', desc: 'Sealed in original box' },
    LIKE_NEW: { label: 'Mint 9/10', desc: 'Zero scratches or blemishes' },
    VERY_GOOD: { label: 'Very Good', desc: 'Minor gentle cosmetic use' },
    GOOD: { label: 'Good', desc: 'Fully functional, normal signs of wear' },
    ACCEPTABLE: { label: 'Acceptable', desc: 'Heavy aesthetic wear, works 100%' }
  };

  const handleSwitchCategory = (type: 'BOOK' | 'PRODUCT') => {
    setListingType(type);
    setError(null);
    if (type === 'BOOK') {
      setTitle('Principles of Neural Science, Sixth Edition');
      setAuthor('Eric R. Kandel');
      setIsbn('978-1259642234');
      setGenre('Biological Sciences');
      setPrice('145');
      setDescription('Standard comprehensive medical & neuroscience reference text. Clean crisp pages with zero highlighting. Includes digital access code scratcher.');
      setImages(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']);
      setWishlistTags(['Organic Chemistry 8th Ed', 'Clinical Neurology Atlas', 'Littmann Stethoscope']);
      setBarterWishlist('Organic Chemistry 8th Ed, Clinical Neurology Atlas');
    } else {
      setTitle('Sony WH-1000XM5 Noise-Canceling Headphones');
      setBrand('Sony');
      setModel('WH-1000XM5 (Silver)');
      setCategory('Electronics');
      setPrice('280');
      setDescription('Purchased 4 months ago for study sessions. Includes carrying case, USB-C braid cable, 3.5mm jack, and original retail box. Battery health tested at 98%.');
      setImages(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80']);
      setWishlistTags(['Kindle Paperwhite 11th Gen', 'Mechanical Keyboards (75%)', 'iPad Mini 6 (WiFi)']);
      setBarterWishlist('Kindle Paperwhite, Mech Keyboards, iPad Mini');
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setBrand('');
    setModel('');
    setAuthor('');
    setIsbn('');
    setImages([]);
    setWishlistTags([]);
    setBarterWishlist('');
    setError(null);
    setCurrentStep(1);
    setStepEnteredAt(Date.now());
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
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
    const updated = wishlistTags.filter(t => t !== tag);
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

  // Step Validation & Navigation
  const validateStep = (stepNumber: number): boolean => {
    setError(null);
    if (stepNumber === 1) {
      if (!title.trim()) {
        setError('Please enter a descriptive listing title.');
        return false;
      }
      if (!description.trim()) {
        setError('Please describe your item and its provenance.');
        return false;
      }
      if (listingType === 'BOOK' && !author.trim()) {
        setError('Please specify the book author.');
        return false;
      }
      return true;
    }
    if (stepNumber === 2) {
      // Photos are optional but encouraged; if empty, provide graceful fallback
      return true;
    }
    if (stepNumber === 3) {
      if (exchangeType !== 'BARTER_ONLY' && (!price || parseFloat(price) <= 0)) {
        setError('Please provide a valid market valuation or asking price.');
        return false;
      }
      return true;
    }
    if (stepNumber === 4) {
      if (!city.trim() || !state.trim()) {
        setError('Please specify your meetup city and state.');
        return false;
      }
      return true;
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        setStepEnteredAt(Date.now());
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const goToPrevStep = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setStepEnteredAt(Date.now());
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || validateStep(currentStep)) {
      setCurrentStep(stepId);
      setStepEnteredAt(Date.now());
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Guard: Prevent submission if user is not yet on Step 4
    if (currentStep < 4) {
      goToNextStep();
      return;
    }

    // Guard: Prevent accidental double-clicks when navigating to Step 4 from immediately submitting
    if (Date.now() - stepEnteredAt < 500) {
      return;
    }

    if (!validateStep(1) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        listingType,
        exchangeType,
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

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing.');
      }

      router.push(`/listings/${data.listing.id}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic progress width class
  const progressWidth = 
    currentStep === 1 ? 'w-1/4' :
    currentStep === 2 ? 'w-2/4' :
    currentStep === 3 ? 'w-3/4' : 'w-full';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Breadcrumb & Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="w-4 h-4 text-tertiary" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Circular Peer-To-Peer Swap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Publish a Barter Ad</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Create your item listing, calibrate fair value, and unlock multi-party cyclical swaps.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-semibold transition-all flex items-center gap-1.5 border border-outline-variant/20"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <Link
            href="/listings"
            className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 hover:bg-surface-container transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Draft Auto-sync
          </span>
        </div>
      </div>

      {/* Interactive Multi-Step Stepper */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-outline-variant/20 shadow-sm mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                  isActive
                    ? 'bg-primary/10 ring-1 ring-primary/40'
                    : isCompleted
                    ? 'hover:bg-surface-container-low cursor-pointer'
                    : 'opacity-70 hover:opacity-100 cursor-pointer'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : isCompleted
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed font-black'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>
                <div className="min-w-0">
                  <span
                    className={`block text-[10px] sm:text-[11px] uppercase tracking-wider font-bold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-tertiary' : 'text-outline'
                    }`}
                  >
                    Step {step.id} {isCompleted && '✓'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-on-surface truncate">{step.title}</p>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Dynamic Progress Bar */}
        <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
          <div className={`bg-primary h-full rounded-full transition-all duration-500 ease-out ${progressWidth}`}></div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="mb-6 p-4 bg-error-container/40 border border-error/30 rounded-2xl text-on-error-container text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-error" />
          <div className="flex-1">
            <span className="font-semibold block">Validation Notice</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Split */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && currentStep < 4) {
            e.preventDefault();
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* Left Column: Interactive Wizard Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1: Category & Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Category Switcher Pill */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/20 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-wider text-outline font-bold">Category Mode</span>
                  <span className="text-tertiary text-xs font-semibold inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Smart attributes adapt dynamically
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-container-low rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleSwitchCategory('PRODUCT')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      listingType === 'PRODUCT'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Tech & Electronics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchCategory('BOOK')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      listingType === 'BOOK'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Textbooks & Books</span>
                  </button>
                </div>
              </div>

              {/* Item Identity Card */}
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-on-surface">Item Identity & Specs</h2>
                      <p className="text-[11px] text-on-surface-variant">Basic specifications and identity markers</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Required
                  </span>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Listing Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={listingType === 'PRODUCT' ? "e.g. Sony WH-1000XM5 Noise-Canceling Headphones" : "e.g. Principles of Neural Science, Sixth Edition"}
                      className="w-full px-4 py-3 rounded-2xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all shadow-inner"
                    />
                    {title.length > 5 && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1.5">
                    Include brand edition, model year, or volume for 42% faster circular swaps.
                  </p>
                </div>

                {/* Dynamic Specs (Tech vs Book) */}
                {listingType === 'PRODUCT' ? (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">Brand / Maker</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="e.g. Sony, Apple, Keychron"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">Model / Edition</label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="e.g. WH-1000XM5 (Silver)"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
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
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">ISBN / Edition</label>
                        <input
                          type="text"
                          value={isbn}
                          onChange={(e) => setIsbn(e.target.value)}
                          placeholder="e.g. 978-1259642234"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
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
                          placeholder="e.g. NEUR 401"
                          className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Condition Selector Rubric */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-on-surface">Condition Grade</label>
                    <span className="text-[11px] font-semibold text-primary">Standardized Rubric</span>
                  </div>
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
                    placeholder="Describe how long you've owned it, functionality status, reason for parting with it..."
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all resize-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Photos & Media Proof */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-on-surface">Photos & Visual Proof</h2>
                      <p className="text-[11px] text-on-surface-variant">Add clear photos from multiple angles</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-primary">
                    {images.length} Photo{images.length !== 1 ? 's' : ''} Loaded
                  </span>
                </div>

                {/* Photo URL Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">
                    Image Web URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                        className="w-full pl-9 pr-3.5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-xs focus:outline-none focus:border-primary shadow-inner"
                      />
                      <ImageIcon className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-5 py-3 bg-primary text-on-primary text-xs font-bold rounded-2xl hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add Photo
                    </button>
                  </div>
                </div>

                {/* Preset Fast Sample Photos */}
                <div className="pt-1">
                  <span className="text-[11px] text-on-surface-variant font-medium block mb-2">Or quick-pick realistic sample photo:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Sony Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
                      { name: 'Mechanical Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80' },
                      { name: 'Textbook Stacks', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
                      { name: 'Mirrorless Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80' }
                    ].map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => {
                          if (!images.includes(sample.url)) {
                            setImages([...images, sample.url]);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-medium text-on-surface transition-colors border border-outline-variant/20 flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3 text-primary" /> {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Gallery Grid */}
                {images.length > 0 ? (
                  <div className="pt-2">
                    <span className="block text-xs font-semibold text-on-surface mb-2">Item Gallery (First photo is cover)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 group bg-surface-container-low shadow-sm">
                          <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-outline-variant/40 rounded-3xl text-center space-y-2 bg-surface-container-low/50">
                    <Camera className="w-8 h-8 text-outline mx-auto" />
                    <p className="text-xs text-on-surface-variant font-medium">No images added yet. Listings with real photos receive 3.8x more verified barter proposals.</p>
                  </div>
                )}

                {/* Photo Verification Tip */}
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-start gap-3 border border-outline-variant/15">
                  <ShieldCheck className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
                  <div className="text-xs text-on-surface-variant">
                    <strong className="text-on-surface block font-semibold mb-0.5">Physical Verification Stamp</strong>
                    Include photos showing serial numbers, screen powered on, or book copyright page for instantaneous automatic verification badge.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Valuation & Trade Wishlist */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                      <Repeat className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-on-surface">Valuation & Barter Protocol</h2>
                      <p className="text-[11px] text-on-surface-variant">Set trade mode and wishlist targets</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-tertiary bg-tertiary/10 px-2.5 py-0.5 rounded-full">
                    Algorithmic Core
                  </span>
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

                {/* Estimated Market Valuation */}
                {exchangeType !== 'BARTER_ONLY' && (
                  <div className="bg-surface-container-low p-5 rounded-2xl space-y-3 border border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-on-surface">Estimated Market Valuation *</span>
                        <span className="text-[11px] text-on-surface-variant">Powers loop resolution and fair trade matching</span>
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

                    {/* Algorithmic Valuation Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
                        <span>Algorithmic Fair Range: <strong className="text-on-surface">$240 – $310</strong></span>
                        <span className="text-primary font-semibold">Optimal Liquidity</span>
                      </div>
                      <div className="h-6 w-full flex items-end gap-1.5 py-0.5">
                        <div className="flex-1 bg-primary/20 rounded-t h-2"></div>
                        <div className="flex-1 bg-primary/30 rounded-t h-3.5"></div>
                        <div className="flex-1 bg-primary/45 rounded-t h-5"></div>
                        <div className="flex-1 bg-primary rounded-t h-6 relative">
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
                        </div>
                        <div className="flex-1 bg-primary/60 rounded-t h-4.5"></div>
                        <div className="flex-1 bg-primary/35 rounded-t h-2.5"></div>
                        <div className="flex-1 bg-primary/20 rounded-t h-1.5"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wishlist Tags (Item for Item) */}
                {exchangeType !== 'CASH_ONLY' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-on-surface">
                        What items would you trade this for? (Wishlist)
                      </label>
                      <span className="text-[11px] text-outline font-medium">Targeting ~${price || '200'} valuation</span>
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
                      <span className="text-[11px] text-on-surface-variant font-medium">Popular counter-offers:</span>
                      {['Fujifilm FinePix', 'Steam Deck 64GB', 'Mechanical 75% Keyboard', 'Kindle Paperwhite'].map((rec) => (
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

                {/* Cash Offset Buffer Callout */}
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-outline-variant/15">
                  <div>
                    <span className="block text-xs font-bold text-on-surface">Cash Flexibility Buffer (OBO)</span>
                    <span className="text-[11px] text-on-surface-variant">Allow barter proposals with minor cash top-offs to close value gaps</span>
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
            </div>
          )}

          {/* STEP 4: Handover & Safe Spots */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/20 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-on-surface">Handover & Safe Meetup</h2>
                      <p className="text-[11px] text-on-surface-variant">Verified campus & public meeting zones</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Geo-Verified
                  </span>
                </div>

                {/* Safe Spot Selection */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-2">Select Preferred Safe Spot</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Campus Safe Spot', desc: 'University Student Union / Quad', icon: 'campus' },
                      { name: 'Transit Hub Locker', desc: 'Grand Central Smart Bay Lockers', icon: 'locker' },
                      { name: 'Public Library', desc: 'NYPL Main Reading Hall', icon: 'library' }
                    ].map((spot) => (
                      <button
                        key={spot.name}
                        type="button"
                        onClick={() => setHandoverSpot(spot.name)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          handoverSpot === spot.name
                            ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                            : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <MapPin className={`w-4 h-4 ${handoverSpot === spot.name ? 'text-primary' : 'text-outline'}`} />
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${handoverSpot === spot.name ? 'bg-primary border-primary' : 'border-outline'}`}>
                            {handoverSpot === spot.name && <Check className="w-3 h-3 text-white" />}
                          </span>
                        </div>
                        <span className="block text-xs font-bold text-on-surface">{spot.name}</span>
                        <span className="block text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">{spot.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Meetup City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New York"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. NY"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary shadow-inner"
                    />
                  </div>
                </div>

                {/* Fulfillment Channels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <span className="block text-xs font-bold text-on-surface">Local Pickup</span>
                        <span className="text-[10px] text-on-surface-variant">In-person handshake</span>
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
                        <span className="block text-xs font-bold text-on-surface">Tracked Shipping</span>
                        <span className="text-[10px] text-on-surface-variant">Courier transit</span>
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

                {/* 6-Digit Handshake Guarantee Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary-fixed/40 to-surface-container-low flex items-start gap-3.5 border border-primary/20">
                  <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-on-primary-fixed">6-Digit Cryptographic Handshake Code</h3>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Enforced
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                      Neither trader departs until both phones mutually submit synced 6-digit handshake codes. Multi-loop circular barters only finalize after all vertices physically verify custody receipt.
                    </p>
                  </div>
                </div>

                {/* Summary Pre-Publish Review Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Listing Summary Ready to Publish
                    </span>
                    <span className="text-[11px] text-primary font-semibold">Step 4 of 4</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest">
                      <span className="text-[10px] text-outline block font-medium">Item & Valuation</span>
                      <span className="font-bold text-on-surface truncate block">{title || 'Untitled'}</span>
                      <span className="text-tertiary font-bold text-[11px]">{exchangeType === 'BARTER_ONLY' ? 'Pure Barter' : `$${price || '0'}`}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest">
                      <span className="text-[10px] text-outline block font-medium">Handover Spot</span>
                      <span className="font-bold text-on-surface truncate block">{handoverSpot}</span>
                      <span className="text-on-surface-variant text-[11px]">{city}, {state}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-outline block font-medium">Fulfillment</span>
                      <span className="font-bold text-on-surface block">
                        {[pickupAvailable && 'Pickup', shippingAvailable && 'Shipping'].filter(Boolean).join(' & ') || 'Pickup'}
                      </span>
                      <span className="text-on-surface-variant text-[11px]">{wishlistTags.length} wishlist targets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Action Bar */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-outline-variant/20 shadow-sm flex items-center justify-between gap-3">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <Link
                  href="/listings"
                  className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-full transition-all flex items-center gap-1.5"
                >
                  Cancel
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant hidden sm:inline">
                Step {currentStep} of {STEPS.length}
              </span>
              {currentStep < 4 ? (
                <button
                  key="wizard-continue-button"
                  type="button"
                  onClick={goToNextStep}
                  className="px-7 py-3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  key="wizard-submit-button"
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? 'Publishing...' : 'Publish Listing & Unlock Barter Matching'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Live Sticky Marketplace Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Marketplace Preview
            </span>
            <span className="text-xs text-on-surface-variant">Real-time feed render</span>
          </div>

          {/* Floating Card Mockup */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Container with Badges */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-surface-container-low shadow-inner">
              <img
                src={images[0] || (listingType === 'BOOK' ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80')}
                alt={title || 'Listing Preview'}
                className="w-full h-full object-cover transition-all"
              />
              <button
                type="button"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className="w-4 h-4" />
              </button>

              {/* Valuation Badge */}
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
                  4.9 (24 swaps)
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
                    <span className="text-[11px] text-outline italic">Open to circular suggestions</span>
                  )}
                </div>
              </div>

              {/* Handover & Offset callout */}
              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/15">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[150px]">{handoverSpot}</span>
                </div>
                <span className="text-tertiary font-semibold">
                  {isNegotiable ? '±$50 cash offset' : 'Strict Valuation'}
                </span>
              </div>

              {/* Simulated Counter-Offer Button */}
              <div className="pt-2">
                <div className="w-full py-2.5 px-4 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center gap-2">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Offer Barter Proposal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Metric Card */}
          <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/20 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">BarterHub Exchange Integrity</h4>
                <p className="text-[11px] text-on-surface-variant">Listing qualifies for algorithmic circular swap rings.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-2xl bg-surface-container-low text-center">
                <span className="block text-base font-bold text-primary">99.4%</span>
                <span className="block text-[10px] text-outline uppercase font-semibold">Meetup Completion</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low text-center">
                <span className="block text-base font-bold text-tertiary">&lt; 3 hrs</span>
                <span className="block text-[10px] text-outline uppercase font-semibold">Avg Match Speed</span>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
