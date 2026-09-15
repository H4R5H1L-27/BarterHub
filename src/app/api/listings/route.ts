import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { resolveUser } from '@/lib/session';
import { ListingType, ExchangeType, ItemCondition } from '@prisma/client';
import { seedDatabase } from '@/lib/seed-data';

export async function GET(req: NextRequest) {
  try {
    // Auto-seed database if empty for instant demo experience
    const totalExisting = await prisma.listing.count();
    if (totalExisting === 0) {
      try {
        await seedDatabase(prisma);
      } catch (seedErr) {
        console.warn('Auto-seed execution error:', seedErr);
      }
    }
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const type = searchParams.get('type') as ListingType | null;
    const exchange = searchParams.get('exchange') as ExchangeType | null;
    const condition = searchParams.get('condition') as ItemCondition | null;
    const city = searchParams.get('city')?.trim();
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const category = searchParams.get('category')?.trim();
    const verified = searchParams.get('verified') === '1';
    const shipping = searchParams.get('shipping') === '1';
    const pickup = searchParams.get('pickup') === '1';
    const warranty = searchParams.get('warranty') === '1';
    const featured = searchParams.get('featured') === '1';
    const posted = searchParams.get('posted');
    const viewer = await resolveUser(req);

    const where: any = {
      status: 'ACTIVE',
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { barterWishlist: { contains: q, mode: 'insensitive' } },
        {
          bookDetails: {
            OR: [
              { author: { contains: q, mode: 'insensitive' } },
              { isbn: { contains: q, mode: 'insensitive' } },
              { isbn13: { contains: q, mode: 'insensitive' } },
              { genre: { contains: q, mode: 'insensitive' } },
              { academicSubject: { contains: q, mode: 'insensitive' } },
              { courseCode: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
        {
          productDetails: {
            OR: [
              { category: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } },
              { model: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (type && ['BOOK', 'PRODUCT'].includes(type)) {
      where.listingType = type;
    }

    if (exchange && ['CASH_ONLY', 'BARTER_ONLY', 'HYBRID'].includes(exchange)) {
      where.exchangeType = exchange;
    }

    if (condition) {
      where.condition = condition;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (category) {
      where.productDetails = {
        is: { category: { contains: category, mode: 'insensitive' } },
      };
    }

    if (verified) where.user = { isVerified: true };
    if (shipping) where.shippingAvailable = true;
    if (pickup) where.pickupAvailable = true;
    if (warranty) {
      where.productDetails = {
        is: {
          ...(where.productDetails?.is || {}),
          warrantyStatus: { not: null },
        },
      };
    }
    if (featured) {
      where.AND = [
        ...(where.AND || []),
        { OR: [{ isFeatured: true }, { isTopAd: true }, { isUrgent: true }] },
      ];
    }
    if (posted === '1d' || posted === '7d' || posted === '30d') {
      const days = posted === '1d' ? 1 : posted === '7d' ? 7 : 30;
      where.createdAt = { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }

    let orderBy: any = [{ isTopAd: 'desc' }, { isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'newest') orderBy = [{ isTopAd: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { viewsCount: 'desc' };
    if (sort === 'relevance') orderBy = [{ isFeatured: 'desc' }, { viewsCount: 'desc' }];

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
            reputationScore: true,
            totalReviews: true,
            totalTrades: true,
            isVerified: true,
          },
        },
        bookDetails: true,
        productDetails: true,
        savedByUsers: viewer
          ? { where: { userId: viewer.id }, select: { id: true } }
          : false,
        _count: {
          select: { savedByUsers: true, cashOffers: true, barterProposalsAsTarget: true },
        },
      },
    });

    const payload = listings.map((listing) => {
      const { savedByUsers, ...rest } = listing as typeof listing & { savedByUsers?: { id: string }[] };
      return {
        ...rest,
        isSaved: Array.isArray(savedByUsers) && savedByUsers.length > 0,
      };
    });

    return NextResponse.json({ listings: payload });
  } catch (error: any) {
    console.error('Fetch listings error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = await getUserFromRequest(req);
    // If not logged in via cookie/header, check demo user header or fallback to first user in DB for seamless testing
    if (!user) {
      const demoEmail = req.headers.get('x-demo-user');
      if (demoEmail) {
        user = await prisma.user.findUnique({ where: { email: demoEmail } });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to create a listing.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      listingType,
      exchangeType,
      price,
      isNegotiable,
      condition,
      images,
      city,
      state,
      pickupAvailable,
      shippingAvailable,
      shippingCost,
      barterWishlist,
      bookDetails,
      productDetails,
    } = body;

    if (!title || !description || !listingType || !exchangeType || !condition) {
      return NextResponse.json({ error: 'Missing required listing fields.' }, { status: 400 });
    }

    const defaultImages = images && images.length > 0
      ? images
      : listingType === 'BOOK'
      ? ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80']
      : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'];

    const newListing = await prisma.listing.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        listingType,
        exchangeType,
        price: price ? parseFloat(price) : null,
        isNegotiable: isNegotiable ?? true,
        condition,
        images: defaultImages,
        city: city || user.city || 'New York',
        state: state || user.state || 'NY',
        pickupAvailable: pickupAvailable ?? true,
        shippingAvailable: shippingAvailable ?? false,
        shippingCost: shippingCost ? parseFloat(shippingCost) : null,
        barterWishlist: barterWishlist?.trim() || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ...(listingType === 'BOOK' && bookDetails
          ? {
              bookDetails: {
                create: {
                  author: bookDetails.author || 'Unknown Author',
                  isbn: bookDetails.isbn || null,
                  isbn13: bookDetails.isbn13 || null,
                  publisher: bookDetails.publisher || null,
                  publicationYear: bookDetails.publicationYear ? parseInt(bookDetails.publicationYear, 10) : null,
                  edition: bookDetails.edition || null,
                  genre: bookDetails.genre || 'General',
                  format: bookDetails.format || 'PAPERBACK',
                  language: bookDetails.language || 'English',
                  pageCount: bookDetails.pageCount ? parseInt(bookDetails.pageCount, 10) : null,
                  hasAnnotations: bookDetails.hasAnnotations ?? false,
                  academicSubject: bookDetails.academicSubject || null,
                  courseCode: bookDetails.courseCode || null,
                },
              },
            }
          : {}),
        ...(listingType === 'PRODUCT' && productDetails
          ? {
              productDetails: {
                create: {
                  category: productDetails.category || 'General Products',
                  subCategory: productDetails.subCategory || null,
                  brand: productDetails.brand || null,
                  model: productDetails.model || null,
                  includesOriginalBox: productDetails.includesOriginalBox ?? false,
                  includesAccessories: productDetails.includesAccessories ?? false,
                  warrantyStatus: productDetails.warrantyStatus || null,
                },
              },
            }
          : {}),
      },
      include: {
        user: true,
        bookDetails: true,
        productDetails: true,
      },
    });

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error: any) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create listing.' }, { status: 500 });
  }
}
