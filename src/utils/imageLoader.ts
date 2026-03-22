import type { ImageMetadata } from "astro";

export interface GalleryItem {
  image: string;
  description: string;
}

export interface ResolvedGalleryItem extends GalleryItem {
  metadata: ImageMetadata;
}

export async function resolveProjectImages(
  slug: string,
  images: GalleryItem[],
): Promise<ResolvedGalleryItem[]> {
  const allImages = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/projects/*/*.{webp,png,jpg,gif}",
  );

  const resolvedImages = await Promise.all(
    images.map(async (item) => {
      const projectPath = `/src/assets/projects/${slug}/${item.image}`;
      const portfolioPath = `/src/assets/projects/portfolio/${item.image}`;

      const imageLoader = allImages[projectPath] || allImages[portfolioPath];

      if (imageLoader) {
        try {
          const imageModule = await imageLoader();
          return {
            ...item,
            metadata: imageModule.default,
          };
        } catch (error) {
          console.error(`Error loading image ${item.image}:`, error);
          return null;
        }
      }
      
      return null;
    }),
  );

  return resolvedImages.filter(
    (img): img is ResolvedGalleryItem => img !== null,
  );
}
