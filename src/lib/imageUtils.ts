/**
 * Utility to optimize image URLs (e.g., Unsplash) by forcing modern WebP format
 * and configuring reasonable quality/compression parameters.
 */
export function optimizeImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("unsplash.com")) {
    let optimized = url;
    
    // Replace auto=format or format=auto with WebP formatting
    if (optimized.includes("auto=format")) {
      optimized = optimized.replace("auto=format", "fm=webp");
    } else if (optimized.includes("format=auto")) {
      optimized = optimized.replace("format=auto", "fm=webp");
    }
    
    // Ensure fm=webp is present
    if (!optimized.includes("fm=webp") && !optimized.includes("format=webp")) {
      optimized += optimized.includes("?") ? "&fm=webp" : "?fm=webp";
    }
    
    // Ensure reasonable quality (80 is a sweet spot for WebP)
    if (!optimized.includes("q=")) {
      optimized += "&q=80";
    }
    
    return optimized;
  }
  return url;
}
