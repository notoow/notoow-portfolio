const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const DEFAULT_CHANNEL_ID = 'UC98TOZLprK48X1rQeA5x9FA';
export const DEFAULT_CHANNEL_URL = `https://www.youtube.com/channel/${DEFAULT_CHANNEL_ID}`;

function normalizeTag(tag) {
    return String(tag || '')
        .trim()
        .replace(/\s+/g, '')
        .toLowerCase();
}

function extractLeadingTag(title) {
    const match = String(title || '').match(/^\s*\[([^\]]+)\]/);
    return match ? match[1].trim() : '';
}

export async function fetchChannelVideos({ channelId, apiKey, maxResults = 24 }) {
    if (!apiKey) {
        throw new Error('Missing VITE_YOUTUBE_API_KEY');
    }

    let items = [];

    try {
        const channelRes = await fetch(
            `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`
        );
        if (!channelRes.ok) {
            throw new Error(`YouTube channel request failed: ${channelRes.status}`);
        }

        const channelJson = await channelRes.json();
        const uploadsPlaylistId = channelJson?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsPlaylistId) {
            throw new Error('Uploads playlist not found');
        }

        const playlistRes = await fetch(
            `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`
        );
        if (!playlistRes.ok) {
            throw new Error(`YouTube playlist request failed: ${playlistRes.status}`);
        }

        const playlistJson = await playlistRes.json();
        items = Array.isArray(playlistJson?.items) ? playlistJson.items : [];
    } catch {
        // Fallback: some channels do not expose uploads playlist via API.
        const searchRes = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${encodeURIComponent(channelId)}&type=video&order=date&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`
        );
        if (!searchRes.ok) {
            throw new Error(`YouTube search request failed: ${searchRes.status}`);
        }

        const searchJson = await searchRes.json();
        const searchItems = Array.isArray(searchJson?.items) ? searchJson.items : [];
        items = searchItems.map((item) => ({
            snippet: item?.snippet || {},
            contentDetails: { videoId: item?.id?.videoId || '' },
        }));
    }

    return items
        .map((item) => {
            const videoId = item?.contentDetails?.videoId;
            const title = item?.snippet?.title || 'Untitled';
            const thumb =
                item?.snippet?.thumbnails?.maxres?.url ||
                item?.snippet?.thumbnails?.high?.url ||
                item?.snippet?.thumbnails?.medium?.url ||
                item?.snippet?.thumbnails?.default?.url;

            return {
                videoId,
                title,
                tag: extractLeadingTag(title),
                type: 'YouTube',
                desc: item?.snippet?.description || '',
                publishedAt: item?.contentDetails?.videoPublishedAt || item?.snippet?.publishedAt || '',
                thumbnail: thumb,
                url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : DEFAULT_CHANNEL_URL,
            };
        })
        .filter((v) => Boolean(v.videoId));
}

export function filterVideosByCategoryTag(videos, categoryTag) {
    const target = normalizeTag(categoryTag);
    return videos.filter((video) => normalizeTag(video.tag) === target);
}
