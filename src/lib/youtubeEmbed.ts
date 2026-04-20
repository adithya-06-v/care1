/**
 * Normalize stored YouTube URLs to embed form: https://www.youtube.com/embed/{VIDEO_ID}
 * Rejects search/playlist pages and other non-embeddable URLs.
 */
export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) {
    return null;
  }

  const u = url.trim();

  if (/youtube\.com\/results\?/i.test(u) || /youtube\.com\/playlist/i.test(u)) {
    return null;
  }

  if (/youtube\.com\/embed\//i.test(u) || /youtube-nocookie\.com\/embed\//i.test(u)) {
    let out = u.startsWith('//') ? `https:${u}` : u.startsWith('http') ? u : `https://${u}`;
    if (out.startsWith('http://')) out = `https://${out.slice('http://'.length)}`;
    return out;
  }

  const idFromWatch = u.match(/[?&]v=([^&]+)/)?.[1];
  if (idFromWatch && /youtube\.com\/watch/i.test(u)) {
    return `https://www.youtube.com/embed/${idFromWatch}`;
  }

  if (u.includes('watch?v=')) {
    return u.replace('watch?v=', 'embed/');
  }

  const short = u.match(/youtu\.be\/([^/?]+)/i);
  if (short) {
    return `https://www.youtube.com/embed/${short[1]}`;
  }

  const shorts = u.match(/youtube\.com\/shorts\/([^/?]+)/i);
  if (shorts) {
    return `https://www.youtube.com/embed/${shorts[1]}`;
  }

  return null;
}

/** YouTube video IDs are 11 chars: [A-Za-z0-9_-]. Invalid IDs yield 404 on img.youtube.com. */
export function isValidYoutubeVideoId(id: string | null | undefined): boolean {
  if (id == null || typeof id !== 'string') return false;
  const s = id.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(s);
}

/**
 * Loose ID extraction (embed / v= / youtu.be / shorts) — then validate length.
 * Use for thumbnails when strict embed normalization misses an edge-case URL.
 */
export function getYouTubeIdFromUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const match = u.match(/(?:embed\/|v=|youtu\.be\/|shorts\/)([^?&#/]+)/);
  const raw = match?.[1]?.trim() ?? '';
  if (isValidYoutubeVideoId(raw)) return raw;
  return getYoutubeVideoId(url);
}

/** Watch URL for opening the same clip in a new tab when embed fails. */
export function getYoutubeWatchUrl(url: string | null | undefined): string | null {
  const id = getYoutubeVideoId(url) ?? getYouTubeIdFromUrl(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

/** Extract YouTube video id from a watch/embed/short URL. */
export function getYoutubeVideoId(url: string | null | undefined): string | null {
  const embed = getEmbedUrl(url);
  if (!embed) return null;
  const m = embed.match(/\/embed\/([^?&/]+)/);
  const raw = m?.[1]?.trim() ?? '';
  return isValidYoutubeVideoId(raw) ? raw : null;
}

/** Standard preview image for embeddable YouTube URLs (null if URL/id invalid — use app fallback image). */
export function getYoutubeThumbnailUrl(url: string | null | undefined): string | null {
  const id = getYoutubeVideoId(url) ?? getYouTubeIdFromUrl(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
