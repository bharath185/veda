import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopFlow Courier Fleet | Delivery Partner App',
  description: 'Live order routing, GPS tracking broadcast, and proof of delivery verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">{children}</body>
    </html>
  );
}
