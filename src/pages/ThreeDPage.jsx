import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';
import { DEFAULT_CHANNEL_URL } from '../lib/youtube';

/*
   ═══════════════════════════════════════════════════
   3D (3D VISUALIZATION) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: '3d',
    title: '3D',
    en: '3D VISUALIZATION',
    desc: 'Cinema 4D, Blender 기반 제품 3D 렌더링, 홍보 애니메이션, 로고 제작.',
    color: 'var(--tone-vivid)',
};

export default function ThreeDPage() {
    const { videos, loading, error } = useYouTubeCategoryVideos('3D');
    const fallbackVideos = [
        {
            title: '[3D] YouTube 채널',
            type: loading ? '자동 파싱 중' : '채널 바로가기',
            desc: loading
                ? '유튜브 목록을 불러오는 중입니다.'
                : (error ? `API 연결 필요: ${error}` : '3D 태그 영상이 아직 없습니다.'),
            url: DEFAULT_CHANNEL_URL,
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
