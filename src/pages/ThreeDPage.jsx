import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';

/*
   ═══════════════════════════════════════════════════
   3D (3D VISUALIZATION) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: '3d',
    title: '3D',
    en: '3D VISUALIZATION',
    desc: 'Blender 기반 제품 3D 렌더링, 홍보 애니메이션, 비주얼 제작.',
    color: 'var(--tone-vivid)',
};

export default function ThreeDPage() {
    const { videos, loading, error } = useYouTubeCategoryVideos('3D');
    const fallbackVideos = [
        {
            title: '3D 포트폴리오 준비 중',
            type: loading ? '불러오는 중' : '링크 추가 대기',
            desc: loading
                ? '포트폴리오 영상을 불러오는 중입니다.'
                : (error ? `영상 연결 오류: ${error}` : 'src/data/portfolioVideos.js 에 일부공개 유튜브 링크를 추가해 주세요.'),
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
