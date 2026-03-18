const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];
const thumbnailProbeCache = new Map();
const thumbnailOEmbedCache = new Map();

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
        const currentIdMatch = value.match(/\/vi\/([^/]+)\//i);
        if (!currentIdMatch?.[1] || currentIdMatch[1] === id) {
            const qualityMatch = value.match(/\/(maxresdefault|sddefault|hqdefault|mqdefault|default)\.(?:jpg|webp)/i);
            return getYouTubeThumbnailUrl(id, qualityMatch?.[1] || 'maxresdefault');
        }

        const qualityMatch = value.match(/\/(maxresdefault|sddefault|hqdefault|mqdefault|default)\.(?:jpg|webp)/i);
        return getYouTubeThumbnailUrl(id, qualityMatch?.[1] || 'maxresdefault');
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

function probeThumbnail(url) {
    if (!url || typeof Image === 'undefined') {
        return Promise.resolve(false);
    }

    if (thumbnailProbeCache.has(url)) {
        return thumbnailProbeCache.get(url);
    }

    const promise = new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(Boolean(image.naturalWidth && image.naturalHeight));
        image.onerror = () => resolve(false);
        image.src = url;
    });

    thumbnailProbeCache.set(url, promise);
    return promise;
}

async function fetchOEmbedThumbnailUrl(videoId) {
    const id = String(videoId || '').trim();
    if (!id || typeof fetch === 'undefined') return '';

    if (thumbnailOEmbedCache.has(id)) {
        return thumbnailOEmbedCache.get(id);
    }

    const promise = fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`)
        .then((response) => (response.ok ? response.json() : null))
        .then((payload) => String(payload?.thumbnail_url || '').trim())
        .catch(() => '');

    thumbnailOEmbedCache.set(id, promise);
    return promise;
}

export async function resolveBestYouTubeThumbnail(videoId, preferredSrc = '') {
    const candidates = getYouTubeThumbnailCandidates(videoId, preferredSrc);

    for (const candidate of candidates) {
        if (await probeThumbnail(candidate)) {
            return candidate;
        }
    }

    const oEmbedCandidate = await fetchOEmbedThumbnailUrl(videoId);
    if (oEmbedCandidate && await probeThumbnail(oEmbedCandidate)) {
        return oEmbedCandidate;
    }

    return candidates[0] || oEmbedCandidate || preferredSrc || '';
}
