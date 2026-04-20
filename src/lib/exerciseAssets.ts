import { getYoutubeThumbnailUrl } from '@/lib/youtubeEmbed';

/** Public fallback when `exercises.image_url` is null */
export const DEFAULT_EXERCISE_IMAGE = '/default-exercise.png';

export function exerciseCardImageSrc(imageUrl: string | null | undefined): string {
  const t = imageUrl?.trim();
  return t || DEFAULT_EXERCISE_IMAGE;
}

/**
 * Card thumbnail: validated YouTube hqdefault, else exercise image, else default.
 * Avoids hqdefault 404 when video_id is malformed.
 */
/** App image when YouTube thumb is missing or invalid (no /fallback.jpg in repo). */
export const YOUTUBE_THUMB_FALLBACK = DEFAULT_EXERCISE_IMAGE;

export function exerciseVideoThumbnailSrc(
  videoUrl: string | null | undefined,
  imageUrl: string | null | undefined,
): string {
  const yt = getYoutubeThumbnailUrl(videoUrl);
  if (yt) return yt;
  return exerciseCardImageSrc(imageUrl);
}
