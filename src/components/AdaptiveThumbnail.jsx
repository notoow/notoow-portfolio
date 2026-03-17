import React, { useEffect, useMemo, useState } from 'react';
import { getYouTubeThumbnailCandidates, resolveBestYouTubeThumbnail } from '../lib/youtubeThumbnails';

export default function AdaptiveThumbnail({
    videoId,
    preferredSrc = '',
    alt = '',
    loading = 'lazy',
    style,
}) {
    const requestKey = `${videoId || ''}::${preferredSrc || ''}`;
    const thumbnailCandidates = useMemo(
        () => getYouTubeThumbnailCandidates(videoId, preferredSrc),
        [videoId, preferredSrc]
    );
    const fallbackSrc = thumbnailCandidates[0] || '';
    const [resolved, setResolved] = useState({ key: '', src: '' });

    useEffect(() => {
        let alive = true;

        resolveBestYouTubeThumbnail(videoId, preferredSrc)
            .then((best) => {
                if (alive && best) {
                    setResolved({ key: requestKey, src: best });
                }
            })
            .catch(() => {});

        return () => {
            alive = false;
        };
    }, [requestKey, videoId, preferredSrc]);

    const src = resolved.key === requestKey && resolved.src ? resolved.src : fallbackSrc;

    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            onError={() => {
                setResolved((current) => {
                    const currentSrc = current.key === requestKey && current.src ? current.src : fallbackSrc;
                    const currentIndex = thumbnailCandidates.indexOf(currentSrc);
                    if (currentIndex >= 0 && currentIndex < thumbnailCandidates.length - 1) {
                        return { key: requestKey, src: thumbnailCandidates[currentIndex + 1] };
                    }
                    return current;
                });
            }}
            style={style}
        />
    );
}
