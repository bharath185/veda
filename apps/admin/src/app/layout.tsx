import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopFlow Control Center | Enterprise Admin Dashboard',
  description: 'Enterprise operations, real-time analytics, inventory matrix, and delivery orchestration for ShopFlow.',
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
