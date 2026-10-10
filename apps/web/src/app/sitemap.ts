import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000';

  const staticRoutes = [
    '',
    '/categories',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productSlugs = [
    'aura-pro-5g-smartphone',
    'sonicwave-anc-over-ear-headphones',
    'chronos-horizon-titanium-smartwatch',
    'zenith-titan-16-creator-laptop',
    'roboclean-lidar-omni-vacuum-mop',
    'powerdial-quick-adjust-dumbbell-pair',
  ];

  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
