import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';
import { DEFAULT_CHANNEL_URL } from '../lib/youtube';

/*
   ═══════════════════════════════════════════════════
   촬영 (CINEMATOGRAPHY) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: 'film',
    title: '촬영',
    en: 'CINEMATOGRAPHY',
    desc: '드론, 멀티캠, 현장 스케치 등 다양한 촬영 환경에서의 실전 경험. 의료, 커머스, 스포츠 등 다방면의 촬영 작업물입니다.',
    color: 'var(--tone-warm)',
};

export default function FilmPage() {
    const { videos, loading, error } = useYouTubeCategoryVideos('예능');
    const fallbackVideos = [
        {
            title: '[예능] YouTube 채널',
            type: loading ? '자동 파싱 중' : '채널 바로가기',
            desc: loading
                ? '유튜브 목록을 불러오는 중입니다.'
                : (error ? `API 연결 필요: ${error}` : '예능 태그 영상이 아직 없습니다.'),
            url: DEFAULT_CHANNEL_URL,
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
