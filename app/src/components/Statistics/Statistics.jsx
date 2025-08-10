import React, { Suspense, lazy } from 'react';

const FishProDemo = lazy(() => import('./FishProDemo'));

export const Statistics = (props) => {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading statistics…</div>}>
      <FishProDemo {...props} />
    </Suspense>
  );
};