import { useEffect, useMemo, useState } from 'react';
import {
    DEFAULT_CHANNEL_ID,
    DEFAULT_CHANNEL_URL,
    fetchChannelVideos,
    filterVideosByCategoryTag,
} from '../lib/youtube';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

function mapSupabaseVideo(row) {
    const videoId = row.video_id || '';
    return {
        videoId,
        title: row.title || 'Untitled',
        tag: row.category_tag || '',
        type: row.video_type || 'YouTube',
        desc: row.description || '',
        thumbnail: row.thumbnail_url || '',
        publishedAt: row.published_at || '',
        url: row.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : DEFAULT_CHANNEL_URL),
    };
}

export function useYouTubeCategoryVideos(categoryTag, maxResults = 24) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    useEffect(() => {
        let alive = true;

        async function run() {
            setLoading(true);
            setError('');
            let supabaseError = '';

            try {
                if (hasSupabaseConfig && supabase) {
                    const { data, error: dbError } = await supabase
                        .from('portfolio_videos')
                        .select('title, category_tag, video_id, url, video_type, description, thumbnail_url, published_at, sort_order')
                        .eq('category_tag', categoryTag)
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true })
                        .order('published_at', { ascending: false, nullsFirst: false });

                    if (dbError) {
                        supabaseError = dbError.message || 'Supabase query failed';
                    } else if (Array.isArray(data) && data.length > 0) {
                        if (!alive) return;
                        setVideos(data.map(mapSupabaseVideo));
                        return;
                    }
                }

                const allVideos = await fetchChannelVideos({ channelId, apiKey, maxResults });
                if (!alive) return;
                setVideos(filterVideosByCategoryTag(allVideos, categoryTag));
            } catch (err) {
                if (!alive) return;
                setVideos([]);
                const ytError = err?.message || 'Failed to fetch YouTube videos';
                setError(supabaseError ? `${supabaseError} / ${ytError}` : ytError);
            } finally {
                if (alive && supabaseError) {
                    setError((prev) => prev || supabaseError);
                }
                if (alive) setLoading(false);
            }
        }

        run();
        return () => { alive = false; };
    }, [apiKey, categoryTag, channelId, maxResults]);

    return useMemo(() => ({ videos, loading, error }), [videos, loading, error]);
}
