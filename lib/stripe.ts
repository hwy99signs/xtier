import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    });
  }
  return stripeInstance;
}

// Keep the export for backward compatibility but it will throw if used during build if key is missing
// Actually, it's better to just export the getter and update usages.
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    })
  : null as unknown as Stripe;

/**
 * Creates or retrieves a Stripe Customer for a given User
 */
export async function getOrCreateStripeCustomer(email: string, name: string) {
  const customers = await stripe.customers.list({ email });
  if (customers.data.length > 0) {
    return customers.data[0];
  }

  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'ERANTT TRANSIT',
    },
  });
}

/**
 * Creates a PaymentIntent for the initial commitment
 */
export async function createCommitmentPaymentIntent(
  amount: number,
  customerId: string,
  metadata: Record<string, string>
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects cents
    currency: 'usd',
    customer: customerId,
    metadata: {
      ...metadata,
      type: 'commitment',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
}
