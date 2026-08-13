export function ExplorerInventorySkeleton() {
  return (
    <section
      aria-label="Cargando inventario"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="animate-pulse space-y-4 rounded-2xl border border-[#DCE4DF] bg-white p-5">
        <div className="flex flex-col justify-between gap-4 border-b border-[#DCE4DF] pb-4 md:flex-row md:items-center">
          <div>
            <div className="h-3 w-28 rounded bg-[#E8F0E4]" />
            <div className="mt-2 h-7 w-56 rounded-lg bg-[#F1F5F2]" />
            <div className="mt-2 h-4 w-80 max-w-full rounded bg-[#F7F9F7]" />
          </div>
          <div className="h-9 w-32 rounded-xl bg-[#F7F9F7]" />
        </div>
        <div className="h-10 rounded-xl bg-[#F7F9F7]" />
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-28 rounded-xl bg-[#F7F9F7]" />
          <div className="h-7 w-24 rounded-xl bg-[#F7F9F7]" />
          <div className="h-7 w-32 rounded-xl bg-[#F7F9F7]" />
          <div className="h-7 w-24 rounded-xl bg-[#F7F9F7]" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-[#DCE4DF] bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-[#F1F5F2]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-40 max-w-full rounded bg-[#F1F5F2]" />
                    <div className="mt-2 h-3 w-56 max-w-full rounded bg-[#F7F9F7]" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-5 w-16 rounded bg-[#F7F9F7]" />
                      <div className="h-5 w-24 rounded bg-[#F7F9F7]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#F7F9F7]" />
                    <div className="h-8 w-8 rounded-full bg-[#F7F9F7]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="animate-pulse h-[600px] rounded-2xl border border-[#DCE4DF] bg-[#F7F9F7]" />
        </div>
      </div>
    </section>
  );
}
