import React from 'react';
import CategoryDetail from './CategoryDetail';
import { useYouTubeCategoryVideos } from '../hooks/useYouTubeCategoryVideos';
import { DEFAULT_CHANNEL_URL } from '../lib/youtube';

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
            title: '[디자인] YouTube 채널',
            type: loading ? '자동 파싱 중' : '채널 바로가기',
            desc: loading
                ? '유튜브 목록을 불러오는 중입니다.'
                : (error ? `API 연결 필요: ${error}` : '디자인 태그 영상이 아직 없습니다.'),
            url: DEFAULT_CHANNEL_URL,
        },
    ];

    return <CategoryDetail category={CATEGORY} videos={videos.length ? videos : fallbackVideos} />;
}
