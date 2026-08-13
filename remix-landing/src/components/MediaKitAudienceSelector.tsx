import { useEffect, useState } from 'react';

export type MediaKitAudience = 'B2B' | 'B2C';

const AUDIENCE_OPTIONS: Array<{
  value: MediaKitAudience;
  title: string;
  description: string;
}> = [
  {
    value: 'B2B',
    title: 'B2B · Agencias',
    description: 'Planificación de medios y propuestas para reventa.',
  },
  {
    value: 'B2C',
    title: 'B2C · Cliente directo',
    description: 'Propuesta visual y comercial para la marca anunciante.',
  },
];

const findStudioSelect = (): HTMLSelectElement | null => {
  const candidates = Array.from(document.querySelectorAll('select'));
  return candidates.find((select) =>
    Array.from(select.options).some((option) =>
      ['Modern Pitch', 'Corporate', 'Minimal', 'B2B', 'B2C'].includes(option.value)
    )
  ) ?? null;
};

const applyAudienceOptions = (select: HTMLSelectElement) => {
  const current = select.value === 'B2B' || select.value === 'B2C' ? select.value : 'B2C';

  select.replaceChildren(
    new Option('B2B · Agencias', 'B2B'),
    new Option('B2C · Cliente directo', 'B2C'),
  );

  if (select.value !== current) {
    select.value = current;
  }
};

const hideLegacyStyleField = (select: HTMLSelectElement) => {
  const label = select.closest('label');
  if (label) {
    label.style.display = 'none';
  }
};

const setStudioAudience = (audience: MediaKitAudience) => {
  const select = findStudioSelect();
  if (!select) return;

  applyAudienceOptions(select);
  select.value = audience;
  select.dispatchEvent(new Event('change', { bubbles: true }));
};

export function MediaKitAudienceSelector() {
  const [audience, setAudience] = useState<MediaKitAudience>('B2C');

  useEffect(() => {
    let initialized = false;

    const syncStudio = () => {
      const select = findStudioSelect();
      if (!select) return false;

      applyAudienceOptions(select);
      hideLegacyStyleField(select);

      if (!initialized) {
        const current = select.value === 'B2B' || select.value === 'B2C' ? select.value : 'B2C';
        setAudience(current);
        initialized = true;
        if (select.value !== current) {
          select.value = current;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      return true;
    };

    syncStudio();
    const observer = new MutationObserver(syncStudio);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="rounded-2xl border border-[#DCE4DF] bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#049A41]">
          Tipo de Media Kit
        </p>
        <p className="mt-1 text-xs text-[#64748B]">
          Elegí el contexto comercial de la propuesta.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {AUDIENCE_OPTIONS.map((option) => {
          const active = audience === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setAudience(option.value);
                setStudioAudience(option.value);
              }}
              aria-pressed={active}
              className={[
                'rounded-2xl border p-4 text-left transition',
                active
                  ? 'border-[#049A41] bg-[#E8F0E4] shadow-sm'
                  : 'border-[#DCE4DF] bg-white hover:border-[#B9C9C0] hover:bg-[#F7F9F7]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#082028]">{option.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-[#64748B]">
                    {option.description}
                  </p>
                </div>
                <span
                  className={[
                    'mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2',
                    active
                      ? 'border-[#049A41] bg-[#049A41]'
                      : 'border-[#CBD5D1] bg-white',
                  ].join(' ')}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
