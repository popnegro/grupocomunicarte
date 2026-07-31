import React from 'react';
import { useParams } from 'react-router-dom';
import { SubpageLayout } from './SubpageLayout';
import { useCms } from './CmsContext';

export function SubpageRouter() {
  const params = useParams();
  const slug = `/${Object.values(params).join('/')}`;

  // #region agent log
  fetch("http://127.0.0.1:7493/ingest/f8c8e631-57b0-4152-abc1-83ff85c4f09b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8483d9" },
    body: JSON.stringify({
      sessionId: "8483d9",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "SubpageRouter.tsx:render",
      message: "SubpageRouter rendered",
      data: { slug, params },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const {
    screens,
    cart,
    toggleCart,
    clearCart,
    weeks,
    setWeeks,
    addLead,
  } = useCms();

  return (
    <SubpageLayout
      slug={slug}
      screens={screens}
      cart={cart}
      toggleCart={toggleCart}
      clearCart={clearCart}
      weeks={weeks}
      setWeeks={setWeeks}
      addLead={addLead}
    />
  );
}
