import React from 'react';
import CategoryDetail from './CategoryDetail';

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

const VIDEOS = [
    // ↓ videoId를 실제 유튜브 영상 ID로 교체하세요
    { videoId: 'OZU-Cxj-49w', title: '빈지노 24:26 편집', type: '뮤직 비주얼', desc: '빈지노 뮤직비디오 편집 작업' },
    { videoId: 'mkA-BkpoX6E', title: '천사소녀 네티 OST', type: '음악 리메이크', desc: '음악 리메이크 및 영상 편집' },
    { videoId: 'OZU-Cxj-49w', title: '편집 프로젝트 B', type: '유튜브 편집' },
    // 추가하려면 여기에 { videoId: 'xxx', title: '제목', type: '유형' } 넣기
];

export default function EditPage() {
    return <CategoryDetail category={CATEGORY} videos={VIDEOS} />;
}
