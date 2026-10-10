'use client';

import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { DesktopHome } from '../components/desktop/DesktopHome';
import { MobileHome } from '../components/mobile/MobileHome';

export default function HomePage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
