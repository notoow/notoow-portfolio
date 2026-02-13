import React from 'react';
import CategoryDetail from './CategoryDetail';

/*
   ═══════════════════════════════════════════════════
   개발 (DEVELOPMENT) 포트폴리오
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: 'dev',
    title: '개발',
    en: 'DEVELOPMENT',
    desc: '웹앱, 자동화 도구, AI 통합 서비스를 직접 설계하고 구현. React, Python, FFmpeg 기반의 파이프라인 구축.',
    color: 'var(--tone-mint)',
};

const VIDEOS = [
    // ↓ videoId를 실제 유튜브 영상 ID로 교체하세요
    { videoId: 'N-MJOCrLh0A', title: 'Unity Tutorials', type: '개발 튜토리얼', desc: 'Unity 게임 개발 튜토리얼 영상' },
    // 추가하려면 여기에 { videoId: 'xxx', title: '제목', type: '유형' } 넣기
];

// NOTE: 개발 포트폴리오는 영상 외에도 GitHub 링크나 데모가 중요할 수 있지만, 
// 현재 템플릿은 영상 위주이므로 관련 데모 영상이나 설명 영상을 넣는 것을 추천합니다.

export default function DevPage() {
    return <CategoryDetail category={CATEGORY} videos={VIDEOS} />;
}
