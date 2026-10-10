import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopFlow | Modern Enterprise Multi-Vendor E-Commerce Platform',
  description:
    'ShopFlow is a next-generation e-commerce platform featuring same-day express delivery, genuine multi-vendor catalog, Razorpay/Stripe payments, and Instagram share attribution.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'ShopFlow | Premium E-Commerce Experience',
    description: 'Shop top electronics, computing, fashion and wearables with express delivery.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopFlow | Premium E-Commerce Experience',
    description: 'Shop top electronics, computing, fashion and wearables with express delivery.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#4F46E5" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
