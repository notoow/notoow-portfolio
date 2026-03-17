import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';

/*
   ═══════════════════════════════════════════════════
   편집 (POST-PRODUCTION) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: 'edit',
    title: '편집',
    en: 'POST-PRODUCTION',
    desc: '인트로, 모션그래픽, 유튜브 디자인대판, 컬러그레이딩. 유튜브 채널 다수 경험.',
    color: 'var(--tone-cool)',
};

export default function EditPage() {
    const { videos, loading, error } = useYouTubeCategoryVideos('디자인');
    const fallbackVideos = [
        {
            title: '편집 포트폴리오 준비 중',
            type: loading ? '불러오는 중' : '링크 추가 대기',
            desc: loading
                ? '포트폴리오 영상을 불러오는 중입니다.'
                : (error ? `영상 연결 오류: ${error}` : 'src/data/portfolioVideos.js 에 일부공개 유튜브 링크를 추가해 주세요.'),
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
