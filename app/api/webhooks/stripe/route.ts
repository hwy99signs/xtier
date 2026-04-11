import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return new Response('Webhook secret or signature missing', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { subscriberId, type } = paymentIntent.metadata;

      if (type === 'commitment' && subscriberId) {
        await prisma.subscriber.update({
          where: { id: subscriberId },
          data: {
            paymentStatus: 'COMMITMENT_PAID',
            commitmentPaid: paymentIntent.amount / 100,
            commitmentPaidAt: new Date(),
            stripePaymentId: paymentIntent.id,
          },
        });
        console.log(`Commitment paid for subscriber: ${subscriberId}`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { subscriberId } = paymentIntent.metadata;

      if (subscriberId) {
        await prisma.subscriber.update({
          where: { id: subscriberId },
          data: {
            paymentStatus: 'FAILED',
          },
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
