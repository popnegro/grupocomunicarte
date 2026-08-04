import { useEffect } from "react";

export interface PageMetadata {
  title: string;
  description?: string;
  ogType?: string;
  ogImage?: string;
}

/**
 * Custom hook to dynamically update page titles, meta descriptions, and Open Graph tags
 * for client-side routing, adhering to WCAG and SEO enterprise standards.
 */
export function usePageMetadata({
  title,
  description = "Líderes en publicidad de vía pública y plataformas de comunicación digital OOH/DOOH en Argentina.",
  ogType = "website",
  ogImage = "/og-image.jpg"
}: PageMetadata) {
  useEffect(() => {
    // Update document title
    const formattedTitle = `${title} | Grupo Comunicarte`;
    document.title = formattedTitle;

    // Helper to select or create meta tags
    const updateMetaTag = (attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update standard description
    updateMetaTag("name", "description", description);

    // Update Open Graph tags
    updateMetaTag("property", "og:title", formattedTitle);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:type", ogType);
    updateMetaTag("property", "og:image", ogImage);

    // Update Twitter Cards tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", formattedTitle);
    updateMetaTag("name", "twitter:description", description);
    updateMetaTag("name", "twitter:image", ogImage);
  }, [title, description, ogType, ogImage]);
}
