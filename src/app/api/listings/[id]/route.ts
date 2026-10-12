import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            city: true,
            state: true,
            reputationScore: true,
            totalReviews: true,
            totalTrades: true,
            totalSales: true,
            responseRate: true,
            avgResponseTime: true,
            isVerified: true,
            createdAt: true,
          },
        },
        bookDetails: true,
        productDetails: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
                isVerified: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        priceHistory: {
          orderBy: { createdAt: 'asc' },
          take: 12,
        },
        _count: {
          select: {
            cashOffers: true,
            barterProposalsAsTarget: true,
            savedByUsers: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.listing
      .update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch(() => {});

    return NextResponse.json({
      listing: {
        ...listing,
        sharesCount: listing.sharesCount,
      },
    });
  } catch (error: any) {
    console.error('Fetch listing detail error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}

async function handleUpdateListing(req: NextRequest, id: string) {
  try {
    let user = await getUserFromRequest(req);
    if (!user) {
      const demoEmail = req.headers.get('x-demo-user');
      if (demoEmail) {
        user = await prisma.user.findUnique({ where: { email: demoEmail } });
      }
    }

    const existing = await prisma.listing.findUnique({
      where: { id },
      include: { bookDetails: true, productDetails: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to update listing.' }, { status: 401 });
    }

    if (existing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to edit this listing.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
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
      status,
      bookDetails,
      productDetails,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (exchangeType !== undefined) updateData.exchangeType = exchangeType;
    if (price !== undefined) {
      const parsedPrice = price === '' || price === null ? null : parseFloat(price);
      if (existing.price && parsedPrice !== null && parsedPrice !== existing.price) {
        updateData.previousPrice = existing.price;
        // Record to priceHistory
        prisma.priceHistory.create({
          data: {
            listingId: id,
            price: parsedPrice,
          },
        }).catch(() => {});
      }
      updateData.price = exchangeType === 'BARTER_ONLY' ? null : parsedPrice;
    }
    if (isNegotiable !== undefined) updateData.isNegotiable = Boolean(isNegotiable);
    if (condition !== undefined) updateData.condition = condition;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : existing.images;
    if (city !== undefined) updateData.city = String(city).trim();
    if (state !== undefined) updateData.state = String(state).trim();
    if (pickupAvailable !== undefined) updateData.pickupAvailable = Boolean(pickupAvailable);
    if (shippingAvailable !== undefined) updateData.shippingAvailable = Boolean(shippingAvailable);
    if (shippingCost !== undefined) {
      updateData.shippingCost = shippingCost === '' || shippingCost === null ? null : parseFloat(shippingCost);
    }
    if (barterWishlist !== undefined) {
      updateData.barterWishlist = barterWishlist ? String(barterWishlist).trim() : null;
    }
    if (status !== undefined) updateData.status = status;

    if (existing.listingType === 'BOOK' && bookDetails) {
      updateData.bookDetails = {
        upsert: {
          create: {
            author: bookDetails.author || 'Unknown',
            isbn: bookDetails.isbn || null,
            genre: bookDetails.genre || 'General',
            format: bookDetails.format || 'PAPERBACK',
            hasAnnotations: bookDetails.hasAnnotations ?? false,
            academicSubject: bookDetails.academicSubject || null,
            courseCode: bookDetails.courseCode || null,
          },
          update: {
            ...(bookDetails.author ? { author: bookDetails.author.trim() } : {}),
            ...(bookDetails.isbn !== undefined ? { isbn: bookDetails.isbn?.trim() || null } : {}),
            ...(bookDetails.genre ? { genre: bookDetails.genre } : {}),
            ...(bookDetails.format ? { format: bookDetails.format } : {}),
            ...(bookDetails.hasAnnotations !== undefined ? { hasAnnotations: Boolean(bookDetails.hasAnnotations) } : {}),
            ...(bookDetails.academicSubject !== undefined ? { academicSubject: bookDetails.academicSubject?.trim() || null } : {}),
            ...(bookDetails.courseCode !== undefined ? { courseCode: bookDetails.courseCode?.trim() || null } : {}),
          },
        },
      };
    } else if (existing.listingType === 'PRODUCT' && productDetails) {
      updateData.productDetails = {
        upsert: {
          create: {
            category: productDetails.category || 'General',
            brand: productDetails.brand || null,
            model: productDetails.model || null,
            includesOriginalBox: productDetails.includesOriginalBox ?? false,
            includesAccessories: productDetails.includesAccessories ?? false,
          },
          update: {
            ...(productDetails.category ? { category: productDetails.category } : {}),
            ...(productDetails.brand !== undefined ? { brand: productDetails.brand?.trim() || null } : {}),
            ...(productDetails.model !== undefined ? { model: productDetails.model?.trim() || null } : {}),
            ...(productDetails.includesOriginalBox !== undefined ? { includesOriginalBox: Boolean(productDetails.includesOriginalBox) } : {}),
            ...(productDetails.includesAccessories !== undefined ? { includesAccessories: Boolean(productDetails.includesAccessories) } : {}),
          },
        },
      };
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            city: true,
            state: true,
          },
        },
        bookDetails: true,
        productDetails: true,
      },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    console.error('Update listing error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdateListing(req, params.id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdateListing(req, params.id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let user = await getUserFromRequest(req);
    if (!user) {
      const demoEmail = req.headers.get('x-demo-user');
      if (demoEmail) {
        user = await prisma.user.findUnique({ where: { email: demoEmail } });
      }
    }
    const { id } = params;

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    if (user && listing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to delete this listing.' }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Listing deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
