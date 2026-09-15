import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resolveUser, notify } from '@/lib/session';
import { ListingStatus, BarterStatus, MessageType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await resolveUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to verify handshake PIN.' }, { status: 401 });
    }

    const body = await req.json();
    const rawPin = (body.pin || '').toString().trim();

    if (!rawPin) {
      return NextResponse.json({ error: 'Please enter a valid handshake PIN code.' }, { status: 400 });
    }

    const cleanPin = rawPin.toUpperCase();
    const digitsOnly = cleanPin.replace(/\D/g, '');

    // Match either full code e.g. TRD-8492 or numeric portion e.g. 8492
    const searchConditions: any[] = [
      { exchangeCode: cleanPin },
      { exchangeCode: { equals: cleanPin, mode: 'insensitive' } },
    ];

    if (cleanPin.startsWith('TRD-')) {
      const codeWithoutPrefix = cleanPin.replace(/^TRD-?/i, '');
      if (codeWithoutPrefix) searchConditions.push({ exchangeCode: codeWithoutPrefix });
    } else {
      searchConditions.push({ exchangeCode: `TRD-${cleanPin}` });
    }

    if (digitsOnly) {
      searchConditions.push({ exchangeCode: `TRD-${digitsOnly}` });
      searchConditions.push({ exchangeCode: digitsOnly });
    }

    // Search for proposal with matching exchange code
    const proposal = await prisma.barterProposal.findFirst({
      where: {
        OR: searchConditions,
      },
      include: {
        targetListing: true,
        offeredItems: { include: { listing: true } },
        initiator: true,
        recipient: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        {
          error: `No barter swap found matching PIN "${cleanPin}". Please check the 6-character code (e.g. TRD-8492) provided by the other trader.`,
        },
        { status: 404 }
      );
    }

    if (proposal.status === BarterStatus.COMPLETED) {
      return NextResponse.json(
        {
          error: `This barter swap for "${proposal.targetListing.title}" has already been verified and marked as completed!`,
        },
        { status: 400 }
      );
    }

    if (proposal.status === BarterStatus.REJECTED || proposal.status === BarterStatus.CANCELLED) {
      return NextResponse.json(
        {
          error: `This barter proposal was previously ${proposal.status.toLowerCase()} and cannot be verified.`,
        },
        { status: 400 }
      );
    }

    // Update proposal to COMPLETED
    const updated = await prisma.barterProposal.update({
      where: { id: proposal.id },
      data: {
        status: BarterStatus.COMPLETED,
      },
      include: {
        targetListing: true,
        offeredItems: { include: { listing: true } },
        initiator: true,
        recipient: true,
      },
    });

    // Mark target listing as TRADED
    await prisma.listing.update({
      where: { id: proposal.targetListingId },
      data: { status: ListingStatus.TRADED },
    });

    // Mark all offered items as TRADED
    for (const item of proposal.offeredItems) {
      await prisma.listing.update({
        where: { id: item.listingId },
        data: { status: ListingStatus.TRADED },
      });
    }

    // Increment completed trade counts for both users
    await prisma.user.update({
      where: { id: proposal.initiatorId },
      data: { totalTrades: { increment: 1 } },
    });
    await prisma.user.update({
      where: { id: proposal.recipientId },
      data: { totalTrades: { increment: 1 } },
    });

    // Add confirmation message to the negotiation thread if present
    if (proposal.conversationId) {
      const otherUserId = user.id === proposal.initiatorId ? proposal.recipientId : proposal.initiatorId;
      await prisma.message.create({
        data: {
          conversationId: proposal.conversationId,
          senderId: user.id,
          receiverId: otherUserId,
          messageType: MessageType.SYSTEM_ALERT,
          content: `🤝 In-Person Handshake Verified! Exchange Code ${proposal.exchangeCode} confirmed delivery. Swap status marked as COMPLETED.`,
        },
      });
    }

    // Notify both traders
    await notify({
      userId: proposal.initiatorId,
      type: 'BARTER',
      title: '🤝 In-Person Trade Verified & Completed!',
      body: `Handshake PIN verified for "${proposal.targetListing.title}". You can now leave a mutual trust review.`,
      href: '/offers',
    });
    await notify({
      userId: proposal.recipientId,
      type: 'BARTER',
      title: '🤝 In-Person Trade Verified & Completed!',
      body: `Handshake PIN verified for "${proposal.targetListing.title}". You can now leave a mutual trust review.`,
      href: '/offers',
    });

    return NextResponse.json({
      success: true,
      message: `🎉 Handshake PIN verified successfully! Trade between ${proposal.initiator.name} and ${proposal.recipient.name} for "${proposal.targetListing.title}" is officially completed.`,
      proposal: {
        id: updated.id,
        status: updated.status,
        exchangeCode: updated.exchangeCode,
        targetTitle: updated.targetListing.title,
        initiatorName: updated.initiator.name,
        recipientName: updated.recipient.name,
      },
    });
  } catch (error: any) {
    console.error('Verify handshake PIN error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to verify handshake PIN.' }, { status: 500 });
  }
}
