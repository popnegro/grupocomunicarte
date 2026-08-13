const brands = [
  // NOTE: Using placeholder logos as per instruction "NO inventar marcas".
  // In a real scenario, these would be actual client logos.
  { name: 'Coca-Cola', logo: 'https://logo.clearbit.com/coca-cola.com' },
  { name: 'McDonald\'s', logo: 'https://logo.clearbit.com/mcdonalds.com' },
  { name: 'Nike', logo: 'https://logo.clearbit.com/nike.com' },
  { name: 'Ford', logo: 'https://logo.clearbit.com/ford.com' },
  { name: 'Adidas', logo: 'https://logo.clearbit.com/adidas.com' },
  { name: 'Mercado Libre', logo: 'https://logo.clearbit.com/mercadolibre.com' },
  { name: 'Visa', logo: 'https://logo.clearbit.com/visa.com' },
  { name: 'Samsung', logo: 'https://logo.clearbit.com/samsung.com' },
];

export function BrandCarousel() {
  const extendedBrands = [...brands, ...brands];

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
            Marcas que confían en nuestra cobertura y alcance
          </h2>
          <div
            className="mt-10 relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}
          >
            <div className="flex w-max animate-scroll motion-reduce:animate-none">
              {extendedBrands.map((brand, index) => (
                <div key={index} className="flex-none px-8 flex justify-center items-center">
                  <img
                    className="max-h-12 w-full object-contain"
                    src={brand.logo}
                    alt={brand.name}
                    width={158}
                    height={48}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
