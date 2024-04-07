
import Stripe from 'stripe';

// El ! es para decirle a TypeScript que confíe en nosotros y que no es nulo
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

