const brands = [
  { name: 'Coca-Cola', logo: '/brands/coca-cola.svg' },
  { name: "McDonald's", logo: '/brands/mcdonalds.svg' },
  { name: 'Nike', logo: '/brands/nike.svg' },
  { name: 'Ford', logo: '/brands/ford.svg' },
  { name: 'Adidas', logo: '/brands/adidas.svg' },
  { name: 'Mercado Libre', logo: '/brands/mercadolibre.svg' },
  { name: 'Visa', logo: '/brands/visa.svg' },
  { name: 'Samsung', logo: '/brands/samsung.svg' },
];

export function BrandCarousel() {
  const extendedBrands = [...brands, ...brands];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-center text-lg font-semibold leading-8 text-[#082028]">
            Marcas que confían en nuestra cobertura y alcance
          </h2>

          <div
            className="relative mt-10 overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}
          >
            <div className="flex w-max animate-scroll motion-reduce:animate-none">
              {extendedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex h-20 w-45 shrink-0 items-center justify-center px-6 sm:w-50"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    width={160}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 max-w-40 object-contain opacity-75 grayscale transition-opacity duration-200 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}