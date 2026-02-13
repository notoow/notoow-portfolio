import React from 'react';
import CategoryDetail from './CategoryDetail';

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

const VIDEOS = [
    // ↓ videoId를 실제 유튜브 영상 ID로 교체하세요
    { videoId: '3sVkYrFfHjw', title: 'Blender 3D Text Logo', type: '3D 타이포', desc: 'Blender로 제작한 3D 텍스트 로고 애니메이션' },
    { videoId: 'OZU-Cxj-49w', title: '빈지노 24:26 3D 커버', type: '3D 뮤직비주얼', desc: '빈지노 앨범 커버 3D 렌더링' },
    { videoId: 'Av2oG8Mp3ic', title: 'Building 2D Animation', type: '2D 애니메이션', desc: '건물 2D 애니메이션 제작' },
    { videoId: 'XDLWgUJ2eD4', title: 'AstraZeneca 백신 3D', type: '3D 제품', desc: '아스트라제네카 백신 제품 3D 렌더링' },
    { videoId: 'f4j-vPBNb0k', title: 'Cactus Jack 3D Logo', type: '3D 로고', desc: 'Cactus Jack 브랜드 로고 3D 작업' },
    // 추가하려면 여기에 { videoId: 'xxx', title: '제목', type: '유형' } 넣기
];

export default function ThreeDPage() {
    return <CategoryDetail category={CATEGORY} videos={VIDEOS} />;
}
