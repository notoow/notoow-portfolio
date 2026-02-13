import React from 'react';
import CategoryDetail from './CategoryDetail';

/*
   ═══════════════════════════════════════════════════
   촬영 (CINEMATOGRAPHY) 포트폴리오
   ═══════════════════════════════════════════════════
   
   videoId 교체 방법:
   1. 유튜브 영상 URL에서 ?v= 뒤의 코드를 복사
   2. 아래 videos 배열의 videoId에 붙여넣기
   3. 새 프로젝트 추가: { videoId: '코드', title: '제목', type: '유형' } 추가
   ═══════════════════════════════════════════════════ */

const CATEGORY = {
    id: 'film',
    title: '촬영',
    en: 'CINEMATOGRAPHY',
    desc: '드론, 멀티캠, 현장 스케치 등 다양한 촬영 환경에서의 실전 경험. 의료, 커머스, 스포츠 등 다방면의 촬영 작업물입니다.',
    color: 'var(--tone-warm)',
};

const VIDEOS = [
    // ↓ videoId를 실제 유튜브 영상 ID로 교체하세요
    { videoId: 'YN28Fyo0Q7Q', title: 'HSBC 환경캠프', type: '다큐멘터리', desc: 'HSBC 환경 캠프 현장 촬영 및 기록' },
    { videoId: 'YN28Fyo0Q7Q', title: '촬영 프로젝트 B', type: '현장 촬영' },
    { videoId: 'YN28Fyo0Q7Q', title: '촬영 프로젝트 C', type: '드론 촬영' },
    // 추가하려면 여기에 { videoId: 'xxx', title: '제목', type: '유형' } 넣기
];

export default function FilmPage() {
    return <CategoryDetail category={CATEGORY} videos={VIDEOS} />;
}
