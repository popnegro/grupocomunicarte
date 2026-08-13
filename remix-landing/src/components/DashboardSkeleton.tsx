export function MetricCardSkeleton() {
  return (
    <article className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-5 shadow-sm" aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-3 w-20 rounded bg-[#E8F0E4]" />
          <div className="mt-3 h-9 w-14 rounded-lg bg-[#F1F5F2]" />
          <div className="mt-2 h-3 w-36 rounded bg-[#F1F5F2]" />
        </div>
        <div className="h-11 w-11 rounded-xl bg-[#F1F5F2]" />
      </div>
    </article>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <section aria-label="Cargando dashboard" aria-busy="true" className="space-y-6">
      <header className="animate-pulse">
        <div className="h-3 w-28 rounded bg-[#E8F0E4]" />
        <div className="mt-2 h-8 w-40 rounded-lg bg-[#F1F5F2]" />
        <div className="mt-2 h-4 w-full max-w-2xl rounded bg-[#F1F5F2]" />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-5">
          <div className="h-4 w-32 rounded bg-[#F1F5F2]" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="h-24 rounded-xl bg-[#F7F9F7]" />
            <div className="h-24 rounded-xl bg-[#F7F9F7]" />
            <div className="h-24 rounded-xl bg-[#F7F9F7]" />
          </div>
        </div>

        <div className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-5">
          <div className="h-4 w-28 rounded bg-[#F1F5F2]" />
          <div className="mt-5 space-y-2">
            <div className="h-10 rounded-xl bg-[#F7F9F7]" />
            <div className="h-10 rounded-xl bg-[#F7F9F7]" />
            <div className="h-10 rounded-xl bg-[#F7F9F7]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LeadsKanbanSkeleton() {
  return (
    <div aria-label="Cargando leads" aria-busy="true" className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="grid min-w-[960px] grid-cols-3 gap-4 lg:min-w-0">
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div key={columnIndex} className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-[#F1F5F2]" />
              <div className="h-6 w-8 rounded-full bg-[#F1F5F2]" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="rounded-xl border border-[#DCE4DF] bg-white p-4">
                  <div className="h-4 w-32 rounded bg-[#F1F5F2]" />
                  <div className="mt-2 h-3 w-24 rounded bg-[#F7F9F7]" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-[#F7F9F7]" />
                    <div className="h-3 w-5/6 rounded bg-[#F7F9F7]" />
                    <div className="h-3 w-2/3 rounded bg-[#F7F9F7]" />
                  </div>
                  <div className="mt-4 h-8 rounded-lg bg-[#F7F9F7]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaKitHistorySkeleton() {
  return (
    <section aria-label="Cargando historial de Media Kits" aria-busy="true" className="space-y-4">
      <header className="animate-pulse">
        <div className="h-3 w-28 rounded bg-[#E8F0E4]" />
        <div className="mt-2 h-7 w-48 rounded-lg bg-[#F1F5F2]" />
        <div className="mt-2 h-4 w-80 max-w-full rounded bg-[#F7F9F7]" />
      </header>

      <div className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-4">
        <div className="h-10 rounded-xl bg-[#F7F9F7]" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-2xl border border-[#DCE4DF] bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="h-3 w-20 rounded bg-[#E8F0E4]" />
                <div className="mt-3 h-4 w-48 rounded bg-[#F1F5F2]" />
                <div className="mt-2 h-3 w-32 rounded bg-[#F7F9F7]" />
              </div>

              <div className="grid w-full gap-2 sm:grid-cols-2 md:max-w-[360px]">
                <div className="h-14 rounded-xl bg-[#F7F9F7]" />
                <div className="h-14 rounded-xl bg-[#F7F9F7]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
