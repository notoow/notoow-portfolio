import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';

/*
   ═══════════════════════════════════════════════════
   촬영 (CINEMATOGRAPHY) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: 'film',
    title: '촬영',
    en: 'CINEMATOGRAPHY',
    desc: '드론, 멀티캠, 현장 스케치 등 다양한 촬영 환경에서의 실전 경험. 의료, 커머스, 스포츠 등 다방면의 촬영 경험',
    color: 'var(--tone-warm)',
};

export default function FilmPage() {
    const { videos, loading, error } = useYouTubeCategoryVideos('예능');
    const fallbackVideos = [
        {
            title: '촬영 포트폴리오 준비 중',
            type: loading ? '불러오는 중' : '링크 추가 대기',
            desc: loading
                ? '포트폴리오 영상을 불러오는 중입니다.'
                : (error ? `영상 연결 오류: ${error}` : 'src/data/portfolioVideos.js 에 일부공개 유튜브 링크를 추가해 주세요.'),
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
