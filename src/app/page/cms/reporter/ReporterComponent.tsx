// Business logic component - shared between Figma Make and Next.js
// This file contains the actual implementation

'use client';

import { ReporterPortal } from '../../../../components/ReporterPortal';

export function Reporter() {
  return (
    <div className="min-h-screen bg-background">
      <ReporterPortal />
    </div>
  );
}
