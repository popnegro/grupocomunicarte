export function formatPrice(price: number | null | undefined): string {
  if (!price || price <= 0) {
    return "CONSULTAR";
  }

  return `$${price.toLocaleString("es-AR")}`;
}