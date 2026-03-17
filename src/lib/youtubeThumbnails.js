const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];

export function getYouTubeThumbnailUrl(videoId, quality = 'maxresdefault') {
    const id = String(videoId || '').trim();
    return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : '';
}

export function normalizeYouTubeThumbnail(src, videoId) {
    const value = String(src || '').trim();
    const id = String(videoId || '').trim();

    if (!id) return value;
    if (!value) return getYouTubeThumbnailUrl(id);

    if (/ytimg\.com\/vi\/|img\.youtube\.com\/vi\//i.test(value)) {
        return getYouTubeThumbnailUrl(id);
    }

    return value;
}

export function getYouTubeThumbnailCandidates(videoId, preferredSrc = '') {
    const id = String(videoId || '').trim();
    const initial = normalizeYouTubeThumbnail(preferredSrc, id);
    const sources = initial ? [initial] : [];

    for (const quality of THUMBNAIL_QUALITIES) {
        const candidate = getYouTubeThumbnailUrl(id, quality);
        if (candidate && !sources.includes(candidate)) {
            sources.push(candidate);
        }
    }

    return sources;
}
