import defaultPrisma from '@/lib/prisma';
import {
  PrismaClient,
  ListingType,
  ExchangeType,
  ItemCondition,
  ListingStatus,
  BookFormat,
  OfferStatus,
  BarterStatus,
  MessageType,
  TransactionType,
  NotificationType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedDatabase(client?: PrismaClient) {
  const prisma = client || defaultPrisma;
  console.log('🌱 Starting comprehensive database seeding with rich, production-grade mock data...');

  // 1. Clean existing records in reverse order of foreign keys
  await prisma.notification.deleteMany();
  await prisma.savedListing.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.barterItem.deleteMany();
  await prisma.barterProposal.deleteMany();
  await prisma.cashOffer.deleteMany();
  await prisma.productDetails.deleteMany();
  await prisma.bookDetails.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create 10 Realistic User Personas
  console.log('👤 Creating 10 authentic trader personas...');

  const userAlex = await prisma.user.create({
    data: {
      name: 'Alex Turner',
      email: 'alex@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Senior backend engineer & distributed systems enthusiast. Always open to trading high-demand programming books and Apple developer gear.',
      phone: '+1 (555) 234-5678',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      isVerified: true,
      reputationScore: 4.95,
      totalReviews: 34,
      totalTrades: 22,
      totalSales: 16,
      responseRate: 98,
      avgResponseTime: 'Within 20 mins',
    },
  });

  const userSarah = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Literature PhD candidate and antique book preservationist. Obsessed with first editions, philosophical classics, and mechanical writing instruments.',
      phone: '+1 (555) 345-6789',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      isVerified: true,
      reputationScore: 5.0,
      totalReviews: 48,
      totalTrades: 38,
      totalSales: 24,
      responseRate: 100,
      avgResponseTime: 'Within 15 mins',
    },
  });

  const userMarcus = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Hardware geek, mechanical keyboard builder, and audio engineer. Constantly rotating DACs, IEMs, studio monitors, and cyberpunk novels.',
      phone: '+1 (555) 456-7890',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      isVerified: true,
      reputationScore: 4.89,
      totalReviews: 29,
      totalTrades: 18,
      totalSales: 11,
      responseRate: 96,
      avgResponseTime: 'Within 45 mins',
    },
  });

  const userElena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      bio: 'UT Austin senior double-majoring in Biochemistry and Data Science. Looking to trade textbooks, graphing calculators, and lab gear.',
      phone: '+1 (555) 567-8901',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      isVerified: true,
      reputationScore: 4.82,
      totalReviews: 22,
      totalTrades: 14,
      totalSales: 12,
      responseRate: 94,
      avgResponseTime: 'Within 1 hour',
    },
  });

  const userDavid = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'david@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Board game collector, vintage synthesizer enthusiast, and sci-fi collector. Let us make trades that keep physical goods in circulation!',
      phone: '+1 (555) 678-9012',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      isVerified: true,
      reputationScore: 4.93,
      totalReviews: 39,
      totalTrades: 29,
      totalSales: 17,
      responseRate: 99,
      avgResponseTime: 'Within 30 mins',
    },
  });

  const userChloe = await prisma.user.create({
    data: {
      name: 'Chloe Zhao',
      email: 'chloe@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      bio: 'Staff Product Designer & photographer. Swapping high-end digital pens, camera lenses, ergonomic chairs, and design theory monographs.',
      phone: '+1 (555) 789-0123',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98104',
      isVerified: true,
      reputationScore: 4.97,
      totalReviews: 18,
      totalTrades: 15,
      totalSales: 9,
      responseRate: 97,
      avgResponseTime: 'Within 25 mins',
    },
  });

  const userLiam = await prisma.user.create({
    data: {
      name: 'Liam O\'Connor',
      email: 'liam@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      bio: 'University of Chicago physics doctoral student. Trading math, quantum mechanics texts, Kindle e-readers, and laboratory electronics.',
      phone: '+1 (555) 890-1234',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60637',
      isVerified: true,
      reputationScore: 4.91,
      totalReviews: 25,
      totalTrades: 19,
      totalSales: 10,
      responseRate: 95,
      avgResponseTime: 'Within 40 mins',
    },
  });

  const userMaya = await prisma.user.create({
    data: {
      name: 'Maya Patel',
      email: 'maya@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Organic chemistry researcher & STEM student mentor. Passionate about zero-waste circular living and low-cost textbook access.',
      phone: '+1 (555) 901-2345',
      city: 'Philadelphia',
      state: 'PA',
      postalCode: '19104',
      isVerified: true,
      reputationScore: 4.86,
      totalReviews: 21,
      totalTrades: 16,
      totalSales: 8,
      responseRate: 93,
      avgResponseTime: 'Within 1 hour',
    },
  });

  const userJulian = await prisma.user.create({
    data: {
      name: 'Julian Vance',
      email: 'julian@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
      bio: 'Analog synth builder, film camera restorer, and mechanical artisan. Seeking vintage glass, 35mm rangefinders, and rare technical manuals.',
      phone: '+1 (555) 012-3456',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      isVerified: true,
      reputationScore: 4.94,
      totalReviews: 31,
      totalTrades: 27,
      totalSales: 13,
      responseRate: 99,
      avgResponseTime: 'Within 30 mins',
    },
  });

  const userSophia = await prisma.user.create({
    data: {
      name: 'Sophia Ramirez',
      email: 'sophia@example.com',
      password: passwordHash,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Environmental science educator & trail hiker. Trading botany guides, outdoor solar tech, e-ink tablets, and climate literature.',
      phone: '+1 (555) 123-4567',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      isVerified: true,
      reputationScore: 4.88,
      totalReviews: 16,
      totalTrades: 12,
      totalSales: 7,
      responseRate: 96,
      avgResponseTime: 'Within 35 mins',
    },
  });

  // 3. Create 18 High-Demand Academic & Cultural Book Listings
  console.log('📚 Creating 18 realistic book & textbook listings...');

  const b_ddia = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Designing Data-Intensive Applications',
      description: 'The definitive guide to distributed data systems, storage engines, replication, and partitioning. Immaculate condition, no annotations or bent corners. Essential for system design interview prep or senior architecture work.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 35.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/books/ddia.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 4.5,
      barterWishlist: 'Looking for "Database Internals" by Alex Petrov or "Clean Architecture" + $10 cash.',
      viewsCount: 680,
      sharesCount: 42,
      bookDetails: {
        create: {
          isbn: '1449373321',
          isbn13: '978-1449373320',
          author: 'Martin Kleppmann',
          publisher: 'O\'Reilly Media',
          publicationYear: 2017,
          edition: '1st Edition',
          genre: 'Software Architecture',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 616,
          hasAnnotations: false,
          academicSubject: 'Computer Science',
          courseCode: 'CS 452 / Distributed Systems',
        },
      },
    },
  });

  const b_cleanCode = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      description: 'Classic software craftsmanship text by Uncle Bob. Pristine pages, never highlighted. Learn how to write robust, maintainable, self-documenting code.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/clean-code.jpg'],
      city: 'Boston',
      state: 'MA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      barterWishlist: 'Direct swap for "Refactoring 2nd Edition" by Martin Fowler or "The Pragmatic Programmer".',
      viewsCount: 395,
      sharesCount: 18,
      bookDetails: {
        create: {
          isbn: '0132350882',
          isbn13: '978-0132350884',
          author: 'Robert C. Martin',
          publisher: 'Prentice Hall',
          publicationYear: 2008,
          edition: '1st Edition',
          genre: 'Software Engineering',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 464,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_dune = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'Dune: Deluxe Hardcover Collector\'s Edition',
      description: 'Stunning collectible edition featuring stained edges, custom endpapers, embossed foil cover, and poster map of Arrakis. Kept in a smoke-free, humidity-controlled bookshelf.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 45.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/books/dune-deluxe.jpg'],
      city: 'Boston',
      state: 'MA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Looking for Folio Society sci-fi editions, Neuromancer 1st printing, or mechanical keyboard components.',
      viewsCount: 820,
      sharesCount: 65,
      bookDetails: {
        create: {
          isbn: '0593099324',
          isbn13: '978-0593099322',
          author: 'Frank Herbert',
          publisher: 'Ace Books / Penguin',
          publicationYear: 2019,
          edition: 'Deluxe Collector\'s Edition',
          genre: 'Science Fiction',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 688,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_tolkien = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'The Lord of the Rings & The Hobbit Deluxe 4-Book Boxed Set',
      description: 'Pocket leatherette flexibound editions in gold embossed slipcase. Includes The Hobbit, Fellowship of the Ring, The Two Towers, and The Return of the King. Complete with pull-out color maps.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 65.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/tolkien-box.jpg'],
      city: 'Boston',
      state: 'MA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 6.0,
      barterWishlist: 'Will barter for high-end headphones (Sony XM4/XM5) with cash offset, or Keychron wireless keyboards.',
      viewsCount: 540,
      bookDetails: {
        create: {
          isbn: '0544445783',
          isbn13: '978-0544445789',
          author: 'J.R.R. Tolkien',
          publisher: 'Mariner Books',
          publicationYear: 2014,
          edition: 'Collector\'s Boxed Edition',
          genre: 'Epic Fantasy',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1728,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_clrs = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Introduction to Algorithms (CLRS) 4th Edition',
      description: 'The definitive algorithms standard. Updated 4th edition with new chapters on bipartite graphs, online algorithms, and machine learning. Thick hardcover, clean pages.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 75.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/clrs-algorithms.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 8.0,
      barterWishlist: 'Trade for Apple Magic Trackpad or Stewart Calculus 9th ed + $25 cash.',
      viewsCount: 710,
      bookDetails: {
        create: {
          isbn: '026204630X',
          isbn13: '978-0262046305',
          author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
          publisher: 'The MIT Press',
          publicationYear: 2022,
          edition: '4th Edition',
          genre: 'Computer Science',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1312,
          hasAnnotations: false,
          academicSubject: 'Algorithms & Data Structures',
          courseCode: 'CS 301 / CS 6006',
        },
      },
    },
  });

  const b_calc = await prisma.listing.create({
    data: {
      userId: userLiam.id,
      title: 'Calculus: Early Transcendentals (9th Edition)',
      description: 'James Stewart calculus hardcover. Essential for single-variable and multivariable engineering sequences. Crisp binding, all formulas fully intact.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 60.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/stewart-calculus.jpg'],
      city: 'Chicago',
      state: 'IL',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 7.5,
      barterWishlist: 'Swap for Griffiths Quantum Mechanics or Halliday & Resnick Physics.',
      viewsCount: 440,
      bookDetails: {
        create: {
          isbn: '1337613924',
          isbn13: '978-1337613927',
          author: 'James Stewart, Daniel Clegg, Saleem Watson',
          publisher: 'Cengage Learning',
          publicationYear: 2020,
          edition: '9th Edition',
          genre: 'Mathematics',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1368,
          hasAnnotations: false,
          academicSubject: 'Mathematics',
          courseCode: 'MATH 151 / 152',
        },
      },
    },
  });

  const b_campbell = await prisma.listing.create({
    data: {
      userId: userElena.id,
      title: 'Campbell Biology (12th Edition)',
      description: 'Leading college biology textbook. Full-color figures throughout. Minor wear on corner tabs, zero interior highlighting. Great for pre-med courses.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 85.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/campbell-biology.jpg'],
      city: 'Austin',
      state: 'TX',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 9.0,
      barterWishlist: 'Trade for Organic Chemistry Wade 9th ed or TI-84 Plus CE calculator.',
      viewsCount: 520,
      bookDetails: {
        create: {
          isbn: '0135188741',
          isbn13: '978-0135188743',
          author: 'Lisa A. Urry, Michael L. Cain',
          publisher: 'Pearson',
          publicationYear: 2020,
          edition: '12th Edition',
          genre: 'Biological Sciences',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1488,
          hasAnnotations: false,
          academicSubject: 'General Biology',
          courseCode: 'BIO 311C',
        },
      },
    },
  });

  const b_orgChem = await prisma.listing.create({
    data: {
      userId: userMaya.id,
      title: 'Organic Chemistry (9th Edition) — Wade & Simek',
      description: 'Standard textbook for two-semester organic chemistry. Includes 3D reaction mechanisms and synthesis roadmaps. Comes with molecular model kit.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 70.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/organic-chemistry-wade.jpg'],
      city: 'Philadelphia',
      state: 'PA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 7.0,
      barterWishlist: 'Looking for Lehninger Principles of Biochemistry (8th ed) or Apple Pencil USB-C.',
      viewsCount: 380,
      bookDetails: {
        create: {
          isbn: '032197137X',
          isbn13: '978-0321971371',
          author: 'Leroy G. Wade, Jan W. Simek',
          publisher: 'Pearson',
          publicationYear: 2016,
          edition: '9th Edition',
          genre: 'Chemistry',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1320,
          hasAnnotations: false,
          academicSubject: 'Organic Chemistry',
          courseCode: 'CHEM 241',
        },
      },
    },
  });

  const b_sicp = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Structure and Interpretation of Computer Programs (SICP)',
      description: 'The Wizard Book from MIT Press. Essential foundation in computer science and Scheme/Lisp abstractions. Clean purple cover hardcover.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/sicp-wizard.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Straight swap for "Crafting Interpreters" by Bob Nystrom or "Compilers: Principles, Techniques, and Tools" (Dragon Book).',
      viewsCount: 490,
      bookDetails: {
        create: {
          isbn: '0262510871',
          isbn13: '978-0262510875',
          author: 'Harold Abelson, Gerald Jay Sussman',
          publisher: 'MIT Press',
          publicationYear: 1996,
          edition: '2nd Edition',
          genre: 'Computer Science',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 657,
          hasAnnotations: false,
          academicSubject: 'Computer Science',
          courseCode: 'MIT 6.001',
        },
      },
    },
  });

  const b_pragmatic = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'The Pragmatic Programmer: 20th Anniversary Edition',
      description: 'Your journey to mastery. One of the most cited books in modern tech careers. Beautiful hardcover with textured silver typography.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 32.0,
      isNegotiable: true,
      condition: ItemCondition.BRAND_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/pragmatic-programmer.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      barterWishlist: 'Will swap for "Working Effectively with Legacy Code" or "System Design Interview" volume 1.',
      viewsCount: 430,
      bookDetails: {
        create: {
          isbn: '0135957052',
          isbn13: '978-0135957059',
          author: 'David Thomas, Andrew Hunt',
          publisher: 'Addison-Wesley Professional',
          publicationYear: 2019,
          edition: '20th Anniversary Edition',
          genre: 'Software Engineering',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 352,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_hailMary = await prisma.listing.create({
    data: {
      userId: userDavid.id,
      title: 'Project Hail Mary',
      description: 'Brilliant hard sci-fi thriller by Andy Weir. Read once during summer, kept in pristine condition. Zero spine creasing.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 14.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/project-hail-mary.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      barterWishlist: 'Looking for "Children of Time" by Adrian Tchaikovsky or "Three-Body Problem" box set.',
      viewsCount: 310,
      bookDetails: {
        create: {
          isbn: '0593135202',
          isbn13: '978-0593135204',
          author: 'Andy Weir',
          publisher: 'Ballantine Books',
          publicationYear: 2021,
          edition: '1st Edition',
          genre: 'Science Fiction',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 496,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_neuromancer = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Neuromancer (Sprawl Trilogy Book 1)',
      description: 'The cyberpunk masterwork that coined "cyberspace" and won the Hugo, Nebula, and Philip K. Dick awards. Ace paperback edition in solid condition.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 10.0,
      isNegotiable: false,
      condition: ItemCondition.GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/neuromancer.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.0,
      barterWishlist: 'Will trade for hard sci-fi paperbacks or Snow Crash by Neal Stephenson.',
      viewsCount: 290,
      bookDetails: {
        create: {
          isbn: '0441569595',
          isbn13: '978-0441569595',
          author: 'William Gibson',
          publisher: 'Ace Books',
          publicationYear: 2000,
          edition: 'Reprint',
          genre: 'Cyberpunk Sci-Fi',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 288,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_physics = await prisma.listing.create({
    data: {
      userId: userLiam.id,
      title: 'Fundamentals of Physics (Extended 12th Edition)',
      description: 'Comprehensive calculus-based physics text covering mechanics, thermodynamics, wave optics, electricity, magnetism, and relativity.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 90.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/fundamentals-physics.jpg'],
      city: 'Chicago',
      state: 'IL',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 9.0,
      barterWishlist: 'Swap for Jackson Classical Electrodynamics or Kindle Paperwhite.',
      viewsCount: 360,
      bookDetails: {
        create: {
          isbn: '1119773510',
          isbn13: '978-1119773511',
          author: 'David Halliday, Robert Resnick, Jearl Walker',
          publisher: 'Wiley',
          publicationYear: 2021,
          edition: '12th Edition',
          genre: 'Physics',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1456,
          hasAnnotations: false,
          academicSubject: 'Physics',
          courseCode: 'PHYS 201 / 202',
        },
      },
    },
  });

  const b_sapiens = await prisma.listing.create({
    data: {
      userId: userSophia.id,
      title: 'Sapiens: A Brief History of Humankind',
      description: 'International bestseller examining the cognitive, agricultural, and scientific revolutions of our species. Deckle edge paperback in pristine state.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.CASH_ONLY,
      price: 12.0,
      isNegotiable: false,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/sapiens.jpg'],
      city: 'Denver',
      state: 'CO',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      viewsCount: 220,
      bookDetails: {
        create: {
          isbn: '0062316095',
          isbn13: '978-0062316097',
          author: 'Yuval Noah Harari',
          publisher: 'Harper Perennial',
          publicationYear: 2015,
          edition: 'Paperback Edition',
          genre: 'Anthropology & History',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 464,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_habits = await prisma.listing.create({
    data: {
      userId: userChloe.id,
      title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
      description: 'James Clear’s groundbreaking habit architecture blueprint. Unopened hardcover with dust jacket in flawless condition.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 15.0,
      isNegotiable: true,
      condition: ItemCondition.BRAND_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/atomic-habits.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      barterWishlist: 'Trade for "Design of Everyday Things" by Don Norman or "Deep Work" by Cal Newport.',
      viewsCount: 410,
      bookDetails: {
        create: {
          isbn: '0735211299',
          isbn13: '978-0735211292',
          author: 'James Clear',
          publisher: 'Avery',
          publicationYear: 2018,
          edition: 'Hardcover',
          genre: 'Psychology & Productivity',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 320,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_dbConcepts = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Database System Concepts (7th Edition)',
      description: 'The standard relational database systems textbook. Covers relational algebra, SQL, index hashing (B+ Trees), concurrency control, and ACID isolation.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 55.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/database-system-concepts.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 6.0,
      barterWishlist: 'Open to trade for mechanical keyboard keycaps or high-speed USB-C hubs.',
      viewsCount: 295,
      bookDetails: {
        create: {
          isbn: '0078022150',
          isbn13: '978-0078022159',
          author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
          publisher: 'McGraw-Hill Education',
          publicationYear: 2019,
          edition: '7th Edition',
          genre: 'Databases & Systems',
          format: BookFormat.HARDCOVER,
          language: 'English',
          pageCount: 1376,
          hasAnnotations: false,
          academicSubject: 'Computer Science',
          courseCode: 'CS 411 / Databases',
        },
      },
    },
  });

  const b_thinkingFast = await prisma.listing.create({
    data: {
      userId: userSarah.id,
      title: 'Thinking, Fast and Slow',
      description: 'Nobel laureate Daniel Kahneman’s tour de force on dual-system cognition, heuristics, prospect theory, and human cognitive biases.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/thinking-fast-and-slow.jpg'],
      city: 'Boston',
      state: 'MA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 3.5,
      barterWishlist: 'Trade for "Nudge" by Thaler & Sunstein or "Fooled by Randomness" by Taleb.',
      viewsCount: 260,
      bookDetails: {
        create: {
          isbn: '0374533555',
          isbn13: '978-0374533557',
          author: 'Daniel Kahneman',
          publisher: 'Farrar, Straus and Giroux',
          publicationYear: 2013,
          edition: 'Paperback',
          genre: 'Behavioral Economics',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 512,
          hasAnnotations: false,
        },
      },
    },
  });

  const b_ctci = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Cracking the Coding Interview (6th Edition)',
      description: '189 programming questions and solutions. Covers big O, hash tables, linked lists, dynamic programming, and systems design. Zero penciled notes.',
      listingType: ListingType.BOOK,
      exchangeType: ExchangeType.HYBRID,
      price: 24.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/books/cracking-coding-interview.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 4.0,
      barterWishlist: 'Swap for LeetCode premium credits, Logitech mouse, or Python data science manuals.',
      viewsCount: 510,
      bookDetails: {
        create: {
          isbn: '0984782850',
          isbn13: '978-0984782857',
          author: 'Gayle Laakmann McDowell',
          publisher: 'CareerCup',
          publicationYear: 2015,
          edition: '6th Edition',
          genre: 'Software Interviews',
          format: BookFormat.PAPERBACK,
          language: 'English',
          pageCount: 708,
          hasAnnotations: false,
          academicSubject: 'Computer Science',
        },
      },
    },
  });

  // 4. Create 18 High-Demand Tech Hardware & Gear Listings
  console.log('💻 Creating 18 realistic tech, audio & electronics listings...');

  const p_sonyHeadphones = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      description: 'Silver edition. 30-hour battery life, 8-microphone ANC array, LDAC high-res audio codec. Flawless cosmetic condition. Comes with original hardshell case, 3.5mm audio cable, and USB-C charger.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 260.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/products/sony-wh1000xm5.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 10.0,
      barterWishlist: 'Open to trade for iPad Air / Mini (USB-C) or Fujifilm lenses (cash added if necessary).',
      viewsCount: 940,
      sharesCount: 58,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'Audio & Headphones',
          brand: 'Sony',
          model: 'WH-1000XM5',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Original receipt from Best Buy available',
        },
      },
    },
  });

  const p_keychron = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard (Banana Tactile)',
      description: 'Full CNC anodized aluminum body, double-gasket mount design, south-facing RGB, QMK/VIA programmable. Hot-swappable Keychron K Pro Banana switches. Mac/Windows compatible.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 145.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/keychron-q1-pro.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 9.0,
      barterWishlist: 'Will barter for HHKB Professional Hybrid or Apple Magic Trackpad + high-end textbooks.',
      viewsCount: 620,
      productDetails: {
        create: {
          category: 'Computers & Accessories',
          subCategory: 'Mechanical Keyboards',
          brand: 'Keychron',
          model: 'Q1 Pro Carbon Black',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: '6 months remaining factory warranty',
        },
      },
    },
  });

  const p_ipad = await prisma.listing.create({
    data: {
      userId: userChloe.id,
      title: 'Apple iPad Air 11-inch M2 (128GB, Space Gray, Wi-Fi)',
      description: 'Purchased for UI prototyping, barely used. Apple M2 silicon chip, Liquid Retina display with P3 wide color, 12MP landscape ultra wide camera. Battery cycle count: 24, 100% capacity. Includes magnetic folio smart case.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 490.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/products/ipad-air-m2.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 12.0,
      barterWishlist: 'Interested in trade for Sony A6400 / A6600 camera body, or M2 Mac mini + cash.',
      viewsCount: 1120,
      sharesCount: 78,
      productDetails: {
        create: {
          category: 'Computers & Tablets',
          subCategory: 'Tablets',
          brand: 'Apple',
          model: 'iPad Air 11-inch (M2 Chip)',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'AppleCare+ eligible until next month',
        },
      },
    },
  });

  const p_kindle = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Kindle Paperwhite Signature Edition (32GB, Agave Green)',
      description: 'Top-tier e-reader with 6.8" 300 ppi glare-free display, auto-adjusting warm front light, wireless charging, and 10 weeks of battery life. Scratch-free screen.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 115.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/kindle-paperwhite.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Trade for leatherbound fantasy editions or CLRS 4th Edition + cash offset.',
      viewsCount: 540,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'E-Readers',
          brand: 'Amazon',
          model: 'Paperwhite Signature 11th Gen',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Verified working perfectly',
        },
      },
    },
  });

  const p_catan = await prisma.listing.create({
    data: {
      userId: userDavid.id,
      title: 'Catan (Settlers of Catan) 5th Edition Base Game',
      description: 'Complete 3-4 player strategy board game. All hexagon terrain tiles, resource cards, harbor tokens, dice, and wooden settlements/roads fully verified. Played only 3 times.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/catan-game.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 8.5,
      barterWishlist: 'Direct swap for "Wingspan", "Terraforming Mars", or "Ticket to Ride: Europe".',
      viewsCount: 310,
      productDetails: {
        create: {
          category: 'Games & Hobbies',
          subCategory: 'Board Games',
          brand: 'Catan Studio',
          model: '5th Edition Base Game',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Complete components',
        },
      },
    },
  });

  const p_calcTi84 = await prisma.listing.create({
    data: {
      userId: userElena.id,
      title: 'TI-84 Plus CE Graphing Calculator (Rose Gold Edition)',
      description: 'Rechargeable color graphing calculator with high-res backlit LCD. Preloaded with math/science apps. Approved for SAT, ACT, AP, and college calculus/physics.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 80.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/ti84-calculator.jpg'],
      city: 'Austin',
      state: 'TX',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Open to barter for organic chemistry models, lab notebooks, or biology textbooks.',
      viewsCount: 470,
      productDetails: {
        create: {
          category: 'Office & Electronics',
          subCategory: 'Calculators',
          brand: 'Texas Instruments',
          model: 'TI-84 Plus CE',
          includesOriginalBox: false,
          includesAccessories: true,
          warrantyStatus: 'Holds full charge, charger cable included',
        },
      },
    },
  });

  const p_mxMaster = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Logitech MX Master 3S Wireless Performance Mouse',
      description: 'Quiet click edition in Space Gray. 8K DPI tracking on any glass surface, MagSpeed electromagnetic scroll wheel, USB-C fast charge, and multi-computer Flow control.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 70.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/logitech-mx-master-3s.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 5.0,
      barterWishlist: 'Trade for Apple Magic Mouse / Trackpad or Keychron accessories.',
      viewsCount: 520,
      productDetails: {
        create: {
          category: 'Computers & Accessories',
          subCategory: 'Mice & Pointers',
          brand: 'Logitech',
          model: 'MX Master 3S',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Logitech warranty valid',
        },
      },
    },
  });

  const p_fujifilm = await prisma.listing.create({
    data: {
      userId: userJulian.id,
      title: 'Fujifilm X-T30 II Mirrorless Digital Camera Body (Silver)',
      description: 'X-Trans CMOS 4 26.1MP sensor with X-Processor 4. Iconic film simulation modes (Classic Chrome, Classic Neg). Sensor spotless, shutter count only 2,800. Includes two OEM batteries and strap.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 720.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/products/fujifilm-xt30-ii.jpg'],
      city: 'Portland',
      state: 'OR',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 15.0,
      barterWishlist: 'Trade for vintage Leica glass, M2 iPad Pro, or Teenage Engineering synthesizers (cash balancing welcome).',
      viewsCount: 1350,
      sharesCount: 94,
      productDetails: {
        create: {
          category: 'Cameras & Optics',
          subCategory: 'Digital Cameras',
          brand: 'Fujifilm',
          model: 'X-T30 II Silver Body',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Clean mechanical condition, inspected',
        },
      },
    },
  });

  const p_airpodsPro = await prisma.listing.create({
    data: {
      userId: userChloe.id,
      title: 'Apple AirPods Pro (2nd Generation with USB-C MagSafe Case)',
      description: 'H2 chip with Active Noise Cancellation and Adaptive Audio. Pristine ear tips (all 4 sizes included). Case protected by Nomad leather skin since day one.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 165.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/airpods-pro-2.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 6.0,
      barterWishlist: 'Looking for Sony XM5 in black or vintage Minolta 50mm f/1.4 lens.',
      viewsCount: 680,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'Audio & Headphones',
          brand: 'Apple',
          model: 'AirPods Pro 2 (USB-C)',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Apple Limited Warranty active',
        },
      },
    },
  });

  const p_steamDeck = await prisma.listing.create({
    data: {
      userId: userMarcus.id,
      title: 'Valve Steam Deck OLED (512GB NVMe SSD)',
      description: 'Gorgeous 7.4-inch 90Hz HDR OLED screen with vibrant colors and pitch blacks. 50Wh battery offering 3-12 hours of playtime. Includes OEM carrying case and 45W charger.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 460.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/products/steam-deck-oled.jpg'],
      city: 'San Francisco',
      state: 'CA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 12.0,
      barterWishlist: 'Will barter for Nintendo Switch OLED + games + cash, or high-end mechanical keyboard kits.',
      viewsCount: 1420,
      sharesCount: 110,
      productDetails: {
        create: {
          category: 'Video Games & Consoles',
          subCategory: 'Handheld Consoles',
          brand: 'Valve',
          model: 'Steam Deck OLED 512GB',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Under official Valve 1-year warranty',
        },
      },
    },
  });

  const p_dellMonitor = await prisma.listing.create({
    data: {
      userId: userAlex.id,
      title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
      description: 'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color accuracy, and 90W USB-C Power Delivery with RJ45 Ethernet pass-through. Zero dead pixels.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.CASH_ONLY,
      price: 380.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/dell-ultrasharp-27.jpg'],
      city: 'New York',
      state: 'NY',
      pickupAvailable: true,
      shippingAvailable: false,
      viewsCount: 640,
      productDetails: {
        create: {
          category: 'Computers & Monitors',
          subCategory: 'Monitors',
          brand: 'Dell',
          model: 'U2723QE UltraSharp',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Dell Advanced Exchange Warranty through 2027',
        },
      },
    },
  });

  const p_shureMic = await prisma.listing.create({
    data: {
      userId: userJulian.id,
      title: 'Shure SM7B Cardioid Dynamic Studio Vocal Microphone',
      description: 'Legendary broadcast and podcasting studio microphone with flat, wide-range frequency response. Includes standard windscreen, A7WS detachable close-talk windscreen, and locking yoke mount.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 295.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/shure-sm7b.jpg'],
      city: 'Portland',
      state: 'OR',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 10.0,
      barterWishlist: 'Seeking Cloudlifter CL-1 + audio interface (Focusrite / Motu) or synthesizers.',
      viewsCount: 780,
      productDetails: {
        create: {
          category: 'Musical Instruments & Gear',
          subCategory: 'Microphones',
          brand: 'Shure',
          model: 'SM7B',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Authentic OEM unit, verified with serial',
        },
      },
    },
  });

  const p_ankerBank = await prisma.listing.create({
    data: {
      userId: userLiam.id,
      title: 'Anker 737 Power Bank (PowerCore 24K, 140W Two-Way Fast Charge)',
      description: '24,000mAh massive capacity with smart digital color display showing real-time input/output wattage and battery health. Can charge a 16" MacBook Pro to 50% in 40 minutes.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 85.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/anker-737-powerbank.jpg'],
      city: 'Chicago',
      state: 'IL',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 6.0,
      barterWishlist: 'Trade for high-quality scientific calculators or college physics problem guides.',
      viewsCount: 390,
      productDetails: {
        create: {
          category: 'Electronics',
          subCategory: 'Batteries & Chargers',
          brand: 'Anker',
          model: '737 Power Bank (A1289)',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Anker 24-month warranty intact',
        },
      },
    },
  });

  const p_applePencil = await prisma.listing.create({
    data: {
      userId: userMaya.id,
      title: 'Apple Pencil (USB-C Edition)',
      description: 'Pixel-perfect precision with low latency and tilt sensitivity. Magnetically snaps to the side of iPad Air and Pro. Used for 2 months of biology diagram sketching.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 55.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/apple-pencil.jpg'],
      city: 'Philadelphia',
      state: 'PA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 4.0,
      barterWishlist: 'Swap for chemistry reference handbooks or scientific lab kits.',
      viewsCount: 340,
      productDetails: {
        create: {
          category: 'Computers & Accessories',
          subCategory: 'Styluses & Pens',
          brand: 'Apple',
          model: 'Pencil USB-C',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Full functional guarantee',
        },
      },
    },
  });

  const p_op1 = await prisma.listing.create({
    data: {
      userId: userDavid.id,
      title: 'Teenage Engineering OP-1 Portable Synthesizer & Sampler',
      description: 'Iconic all-in-one synthesizer, 4-track tape recorder, drum machine, and FM radio sampler. Beautiful condition with OLED screen protector installed and original rubber bands.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 850.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      isFeatured: true,
      images: ['/items/products/op1-synthesizer.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 15.0,
      barterWishlist: 'Looking for modern analog synthesizers (Moog Subsequent / Korg Minilogue XD) or mirrorless cameras.',
      viewsCount: 1680,
      sharesCount: 140,
      productDetails: {
        create: {
          category: 'Musical Instruments & Gear',
          subCategory: 'Synthesizers & Keyboards',
          brand: 'Teenage Engineering',
          model: 'OP-1 Classic Revision',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Clean potentiometer action and full battery life',
        },
      },
    },
  });

  const p_wingspan = await prisma.listing.create({
    data: {
      userId: userSophia.id,
      title: 'Wingspan Board Game + European Expansion (Stonemaier Games)',
      description: 'Critically acclaimed bird-collection engine-building board game. Comes with base game plus European Expansion in excellent condition. Includes customized card sleeves.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.BARTER_ONLY,
      price: null,
      isNegotiable: false,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/wingspan-game.jpg'],
      city: 'Denver',
      state: 'CO',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 9.0,
      barterWishlist: 'Will barter for "Everdell", "Cascadia", or "Root" board game sets.',
      viewsCount: 290,
      productDetails: {
        create: {
          category: 'Games & Hobbies',
          subCategory: 'Board Games',
          brand: 'Stonemaier Games',
          model: 'Wingspan + European Exp',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Complete game with all eggs and food tokens',
        },
      },
    },
  });

  const p_ergoChair = await prisma.listing.create({
    data: {
      userId: userChloe.id,
      title: 'Herman Miller Mirra 2 Ergonomic Task Chair (Graphite)',
      description: 'Fully adjustable Butterfly Back suspension, Tilt Limiter with Forward Tilt, and 3D Intelligent Armrests. Perfect lumbar support for remote desk work.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.CASH_ONLY,
      price: 480.0,
      isNegotiable: true,
      condition: ItemCondition.VERY_GOOD,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/herman-miller-chair.jpg'],
      city: 'Seattle',
      state: 'WA',
      pickupAvailable: true,
      shippingAvailable: false,
      viewsCount: 890,
      productDetails: {
        create: {
          category: 'Home & Office',
          subCategory: 'Office Chairs',
          brand: 'Herman Miller',
          model: 'Mirra 2 Chair',
          includesOriginalBox: false,
          includesAccessories: true,
          warrantyStatus: 'Mechanisms working smoothly',
        },
      },
    },
  });

  const p_hhkb = await prisma.listing.create({
    data: {
      userId: userJulian.id,
      title: 'HHKB Professional HYBRID Type-S (Charcoal, Printed Keycaps)',
      description: 'The holy grail Topre 45g electrostatic capacitive switch keyboard. Silent Type-S dampening rings, Bluetooth multi-pairing, USB-C, and legendary Unix-friendly layout.',
      listingType: ListingType.PRODUCT,
      exchangeType: ExchangeType.HYBRID,
      price: 240.0,
      isNegotiable: true,
      condition: ItemCondition.LIKE_NEW,
      status: ListingStatus.ACTIVE,
      images: ['/items/products/hhkb-keyboard.jpg'],
      city: 'Portland',
      state: 'OR',
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 8.0,
      barterWishlist: 'Looking to swap for Sony WH-1000XM5 headphones or Teenage Engineering gear.',
      viewsCount: 790,
      productDetails: {
        create: {
          category: 'Computers & Accessories',
          subCategory: 'Keyboards',
          brand: 'PFU Fujitsu / HHKB',
          model: 'Professional HYBRID Type-S',
          includesOriginalBox: true,
          includesAccessories: true,
          warrantyStatus: 'Full functional guarantee',
        },
      },
    },
  });

  console.log('✅ Created 18 high-demand general product listings.');

  // 5. Create Realistic Cash Offer Negotiations
  console.log('💵 Creating realistic cash offer negotiations...');

  const offer1 = await prisma.cashOffer.create({
    data: {
      listingId: b_ddia.id,
      buyerId: userMarcus.id,
      sellerId: userAlex.id,
      offerAmount: 28.0,
      counterAmount: 31.0,
      status: OfferStatus.COUNTERED,
      message: 'Hey Alex! Would you consider $28 cash and I can pick it up tomorrow afternoon in Manhattan?',
    },
  });

  const offer2 = await prisma.cashOffer.create({
    data: {
      listingId: p_sonyHeadphones.id,
      buyerId: userDavid.id,
      sellerId: userMarcus.id,
      offerAmount: 235.0,
      counterAmount: 245.0,
      status: OfferStatus.ACCEPTED,
      message: 'Hi Marcus! Can do $235 cash with local meetup at Market St station or coffee shop.',
    },
  });

  const offer3 = await prisma.cashOffer.create({
    data: {
      listingId: b_clrs.id,
      buyerId: userLiam.id,
      sellerId: userAlex.id,
      offerAmount: 68.0,
      counterAmount: null,
      status: OfferStatus.PENDING,
      message: 'Hello! I can offer $68 with expedited shipping to Chicago. Need it for semester finals.',
    },
  });

  const offer4 = await prisma.cashOffer.create({
    data: {
      listingId: p_ipad.id,
      buyerId: userJulian.id,
      sellerId: userChloe.id,
      offerAmount: 450.0,
      counterAmount: 475.0,
      status: OfferStatus.COUNTERED,
      message: 'Would you take $450 cash for local Seattle pickup at Pike Place Starbucks?',
    },
  });

  const offer5 = await prisma.cashOffer.create({
    data: {
      listingId: p_calcTi84.id,
      buyerId: userMaya.id,
      sellerId: userElena.id,
      offerAmount: 70.0,
      counterAmount: null,
      status: OfferStatus.ACCEPTED,
      message: 'Can take it for $70! My tutoring student desperately needs this exact model.',
    },
  });

  const offer6 = await prisma.cashOffer.create({
    data: {
      listingId: p_steamDeck.id,
      buyerId: userDavid.id,
      sellerId: userMarcus.id,
      offerAmount: 420.0,
      counterAmount: 440.0,
      status: OfferStatus.ACCEPTED,
      message: 'Hey Marcus! I have $420 ready in hand. Can meet at Powell St station.',
    },
  });

  // 6. Create Barter Proposals (Item-for-Item & Hybrid Barters with Handshake PINs)
  console.log('🤝 Creating realistic barter proposals & Handshake tokens...');

  const barter1 = await prisma.barterProposal.create({
    data: {
      initiatorId: userMarcus.id,
      recipientId: userSarah.id,
      targetListingId: b_dune.id, // Dune Deluxe
      cashTopUp: 15.0, // $15 cash offset
      status: BarterStatus.PROPOSED,
      notes: 'Hi Sarah! I noticed your wishlist for cyberpunk titles. I would love to trade my Neuromancer paperback plus $15 cash for your Dune deluxe hardcover.',
      offeredItems: {
        create: [{ listingId: b_neuromancer.id }],
      },
    },
  });

  const barter2 = await prisma.barterProposal.create({
    data: {
      initiatorId: userSarah.id,
      recipientId: userMarcus.id,
      targetListingId: p_keychron.id, // Keychron Keyboard
      cashTopUp: 0.0,
      status: BarterStatus.ACCEPTED,
      exchangeCode: 'TRD-8492',
      notes: 'I would love to trade the Tolkien 4-book boxed set for your Keychron mechanical keyboard! Both are in like-new condition.',
      offeredItems: {
        create: [{ listingId: b_tolkien.id }],
      },
    },
  });

  const barter3 = await prisma.barterProposal.create({
    data: {
      initiatorId: userLiam.id,
      recipientId: userAlex.id,
      targetListingId: b_clrs.id, // CLRS Algorithms
      cashTopUp: 15.0,
      status: BarterStatus.ACCEPTED,
      exchangeCode: 'TRD-4209',
      notes: 'Trading Stewart Calculus 9th edition + $15 cash top-up for your CLRS 4th edition.',
      offeredItems: {
        create: [{ listingId: b_calc.id }],
      },
    },
  });

  const barter4 = await prisma.barterProposal.create({
    data: {
      initiatorId: userJulian.id,
      recipientId: userMarcus.id,
      targetListingId: p_sonyHeadphones.id, // Sony XM5
      cashTopUp: 20.0,
      status: BarterStatus.ACCEPTED,
      exchangeCode: 'TRD-7731',
      notes: 'Offering HHKB Professional Hybrid Type-S keyboard plus $20 cash for your Sony WH-1000XM5 headphones.',
      offeredItems: {
        create: [{ listingId: p_hhkb.id }],
      },
    },
  });

  const barter5 = await prisma.barterProposal.create({
    data: {
      initiatorId: userSophia.id,
      recipientId: userDavid.id,
      targetListingId: p_catan.id, // Catan Base Game
      cashTopUp: 0.0,
      status: BarterStatus.COMPLETED,
      exchangeCode: 'TRD-1904',
      notes: 'Straight game-for-game trade: Wingspan with European expansion for your Catan 5th edition.',
      offeredItems: {
        create: [{ listingId: p_wingspan.id }],
      },
    },
  });

  const barter6 = await prisma.barterProposal.create({
    data: {
      initiatorId: userElena.id,
      recipientId: userMaya.id,
      targetListingId: b_orgChem.id, // Organic Chem
      cashTopUp: 0.0,
      status: BarterStatus.PROPOSED,
      notes: 'Offering Campbell Biology 12th edition for your Organic Chemistry Wade 9th edition. Both are heavy STEM references in great condition.',
      offeredItems: {
        create: [{ listingId: b_campbell.id }],
      },
    },
  });

  // 6B. Pre-seed a True 3-Way Circular Trade Cycle:
  // Alex (DDIA) -> Sarah (Clean Code) -> Marcus (Sony Headphones) -> Alex (DDIA)
  await prisma.barterProposal.create({
    data: {
      initiatorId: userAlex.id,
      recipientId: userSarah.id,
      targetListingId: b_cleanCode.id,
      cashTopUp: 0.0,
      status: BarterStatus.PROPOSED,
      notes: '3-Way Cycle Leg 1: Alex offers DDIA for Clean Code',
      offeredItems: {
        create: [{ listingId: b_ddia.id }],
      },
    },
  });

  await prisma.barterProposal.create({
    data: {
      initiatorId: userSarah.id,
      recipientId: userMarcus.id,
      targetListingId: p_sonyHeadphones.id,
      cashTopUp: 0.0,
      status: BarterStatus.PROPOSED,
      notes: '3-Way Cycle Leg 2: Sarah offers Clean Code for Sony Headphones',
      offeredItems: {
        create: [{ listingId: b_cleanCode.id }],
      },
    },
  });

  await prisma.barterProposal.create({
    data: {
      initiatorId: userMarcus.id,
      recipientId: userAlex.id,
      targetListingId: b_ddia.id,
      cashTopUp: 0.0,
      status: BarterStatus.PROPOSED,
      notes: '3-Way Cycle Leg 3: Marcus offers Sony Headphones for DDIA',
      offeredItems: {
        create: [{ listingId: p_sonyHeadphones.id }],
      },
    },
  });

  // 7. Create Active Negotiation Conversations with In-Thread Action Cards
  console.log('💬 Creating active chat negotiations and contextual cards...');

  // Thread 1: Marcus & Sarah (Dune Swap)
  const conv1 = await prisma.conversation.create({
    data: {
      participantAId: userMarcus.id,
      participantBId: userSarah.id,
      listingId: b_dune.id,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userMarcus.id,
      receiverId: userSarah.id,
      content: 'Hey Sarah! I saw your Dune Deluxe listing and noticed you collect classic sci-fi.',
      messageType: MessageType.TEXT,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userMarcus.id,
      receiverId: userSarah.id,
      content: 'I submitted a barter proposal offering my Neuromancer copy plus $15 cash top-up!',
      messageType: MessageType.BARTER_PROPOSAL_CARD,
      metadata: JSON.stringify({
        barterId: barter1.id,
        offeredItemTitles: ['Neuromancer (Sprawl Trilogy Book 1)'],
        cashTopUp: 15.0,
        status: 'PROPOSED',
      }),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv1.id,
      senderId: userSarah.id,
      receiverId: userMarcus.id,
      content: 'Hi Marcus! That is super tempting. Is your Neuromancer copy the 2000 Ace reprint? Any spine creases or page tanning?',
      messageType: MessageType.TEXT,
    },
  });

  // Thread 2: Marcus & Alex (DDIA Cash Deal)
  const conv2 = await prisma.conversation.create({
    data: {
      participantAId: userMarcus.id,
      participantBId: userAlex.id,
      listingId: b_ddia.id,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userMarcus.id,
      receiverId: userAlex.id,
      content: 'Hi Alex! Wondering if you are flexible on the DDIA book asking price?',
      messageType: MessageType.TEXT,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userMarcus.id,
      receiverId: userAlex.id,
      content: 'Sent an offer for $28 cash with Manhattan meetup.',
      messageType: MessageType.CASH_OFFER_CARD,
      metadata: JSON.stringify({
        offerId: offer1.id,
        amount: 28.0,
        status: 'COUNTERED',
        counterAmount: 31.0,
      }),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv2.id,
      senderId: userAlex.id,
      receiverId: userMarcus.id,
      content: 'Hey Marcus! Countered at $31. It really is in brand new condition, zero notes. Can meet near Union Square around 5:30 PM!',
      messageType: MessageType.TEXT,
    },
  });

  // Thread 3: Sarah & Marcus (Keychron Handshake Deal)
  const conv3 = await prisma.conversation.create({
    data: {
      participantAId: userSarah.id,
      participantBId: userMarcus.id,
      listingId: p_keychron.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv3.id,
      senderId: userSarah.id,
      receiverId: userMarcus.id,
      content: 'Hi Marcus, I accepted your trade deal for the Keychron keyboard! Looking forward to meeting.',
      messageType: MessageType.TEXT,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv3.id,
      senderId: userSarah.id,
      receiverId: userMarcus.id,
      content: 'Deal Agreement locked. Handshake Token: TRD-8492. Show this code at the meet-up spot.',
      messageType: MessageType.BARTER_PROPOSAL_CARD,
      metadata: JSON.stringify({
        barterId: barter2.id,
        exchangeCode: 'TRD-8492',
        status: 'ACCEPTED',
        targetTitle: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
      }),
    },
  });

  // 8. Create Realistic Multi-Dimensional Trust Reviews
  console.log('⭐ Creating 12 multi-dimensional trader reviews...');

  await prisma.review.create({
    data: {
      reviewerId: userSarah.id,
      targetUserId: userAlex.id,
      listingId: b_cleanCode.id,
      transactionType: TransactionType.BARTER_EXCHANGE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'Alex was fantastic to trade with! Clean Code was in exact pristine condition described. He showed up on time at the coffee shop and we had a great chat about software architecture.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userAlex.id,
      targetUserId: userSarah.id,
      listingId: b_cleanCode.id,
      transactionType: TransactionType.BARTER_EXCHANGE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'Super smooth exchange with Sarah! Books were packaged carefully and communication was instantaneous. Top tier member of the BarterHub community.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userDavid.id,
      targetUserId: userMarcus.id,
      transactionType: TransactionType.CASH_SALE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 4,
      comment: 'Bought audio equipment from Marcus. Tested it on the spot, works like a charm. Very honest and transparent seller!',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userMarcus.id,
      targetUserId: userDavid.id,
      transactionType: TransactionType.CASH_SALE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'David is a true gentleman. Cash in hand, polite communication, showed up 5 minutes early to the meetup station.',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userChloe.id,
      targetUserId: userAlex.id,
      listingId: p_kindle.id,
      transactionType: TransactionType.BARTER_EXCHANGE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'Exchanged tech gear with Alex in NYC. The Kindle Signature Edition looked like it was unboxed yesterday. Highly recommended trader!',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      reviewerId: userSophia.id,
      targetUserId: userDavid.id,
      listingId: p_catan.id,
      transactionType: TransactionType.BARTER_EXCHANGE,
      overallRating: 5,
      conditionRating: 5,
      communicationRating: 5,
      punctualityRating: 5,
      comment: 'Completed board game swap via the 6-digit handshake PIN. Every single component was bagged neatly. 10/10 trade.',
      isVerified: true,
    },
  });

  // 9. Pre-seed Saved Listings (Watchlist) & Notifications
  console.log('❤️ Pre-seeding user watchlists and activity notifications...');

  await prisma.savedListing.createMany({
    data: [
      { userId: userMarcus.id, listingId: b_dune.id },
      { userId: userMarcus.id, listingId: b_ddia.id },
      { userId: userSarah.id, listingId: p_keychron.id },
      { userId: userSarah.id, listingId: b_neuromancer.id },
      { userId: userAlex.id, listingId: p_sonyHeadphones.id },
      { userId: userAlex.id, listingId: p_steamDeck.id },
      { userId: userElena.id, listingId: b_orgChem.id },
      { userId: userElena.id, listingId: p_calcTi84.id },
      { userId: userChloe.id, listingId: p_fujifilm.id },
      { userId: userChloe.id, listingId: b_habits.id },
      { userId: userLiam.id, listingId: b_clrs.id },
      { userId: userLiam.id, listingId: b_physics.id },
    ],
    skipDuplicates: true,
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: userMarcus.id,
        type: NotificationType.BARTER,
        title: '🤝 New Barter Deal Accepted!',
        body: 'Sarah Jenkins accepted your barter proposal for Keychron Q1 Pro with PIN token TRD-8492.',
        href: '/offers',
        isRead: false,
      },
      {
        userId: userSarah.id,
        type: NotificationType.OFFER,
        title: '💵 Inbound Offer Countered',
        body: 'Alex Turner updated the counter amount on Designing Data-Intensive Applications to $31.00.',
        href: '/offers',
        isRead: false,
      },
      {
        userId: userAlex.id,
        type: NotificationType.MESSAGE,
        title: '💬 New Message from Marcus Chen',
        body: 'Can meet near Union Square around 5:30 PM!',
        href: '/messages',
        isRead: false,
      },
      {
        userId: userElena.id,
        type: NotificationType.PRICE_DROP,
        title: '📉 Valuation Drop Alert',
        body: 'Organic Chemistry (9th Edition) valuation dropped from $75 to $70.',
        href: `/listings/${b_orgChem.id}`,
        isRead: true,
      },
      {
        userId: userChloe.id,
        type: NotificationType.SYSTEM,
        title: '🛡️ Account Verification Confirmed',
        body: 'Your identity and campus meetup credentials have been verified. Level 4 Pioneer Badge granted.',
        href: '/profile/chloe',
        isRead: true,
      },
    ],
  });

  console.log('🎉 Database seeding completed successfully with 10 users, 36 listings, offers, barters, chats, reviews, and notifications!');

  return {
    users: 10,
    listings: 36,
    offers: 6,
    barters: 6,
    conversations: 3,
    reviews: 6,
  };
}
