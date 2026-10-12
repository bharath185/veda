import type { Metadata } from 'next';
import './globals.css';
import { CartDrawer } from '../components/desktop/CartDrawer';

export const metadata: Metadata = {
  title: 'VedaFlow | Classical Ayurvedic Medicines & AYUSH Formulations',
  description:
    '100% Genuine, NABL Lab Tested Classical Ayurvedic Medicines, Rasayanas, Pure Himalayan Shilajit, and Herbal Formulations. AYUSH Certified E-Commerce.',
  metadataBase: new URL('https://vedaflow-theta.vercel.app'),
  openGraph: {
    title: 'VedaFlow | Classical Ayurvedic Medicines & AYUSH Formulations',
    description: 'Shop genuine classical Rasayanas, Shilajit, Ashwagandha and herbal medicines with fast delivery.',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=630'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VedaFlow | Classical Ayurvedic Medicines',
    description: 'Shop genuine classical Rasayanas, Shilajit, Ashwagandha and herbal medicines with fast delivery.',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=630'],
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
        <meta name="theme-color" content="#2874f0" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
