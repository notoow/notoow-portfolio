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
    desc: '영상편집, 모션그래픽, 디자인 제작을 분리해서 보여주는 포스트 프로덕션 포트폴리오.',
    color: 'var(--tone-cool)',
};

const EDIT_SECTIONS = [
    {
        key: 'edit',
        title: '영상편집',
        desc: '예능, 브랜디드, 현장형 콘텐츠를 리듬감 있게 정리한 컷 편집 중심 작업입니다.',
    },
    {
        key: 'motion',
        title: '모션그래픽',
        desc: '인트로, 립싱크, 그래픽 애니메이션처럼 움직임 자체가 핵심인 작업을 모았습니다.',
    },
    {
        key: 'design',
        title: '디자인 제작',
        desc: '자막, 타이틀, 화면용 그래픽 요소처럼 영상 안의 비주얼 시스템을 다듬는 작업입니다.',
    },
];

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

    const sections = EDIT_SECTIONS.map((section) => ({
        ...section,
        videos: videos.filter((video) => video.section === section.key),
    })).filter((section) => section.videos.length > 0);

    return (
        <CategoryDetail
            category={CATEGORY}
            videos={videos.length ? videos : fallbackVideos}
            sections={videos.length ? sections : undefined}
        />
    );
}
