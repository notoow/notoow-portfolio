import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const sourceArg = process.argv[2];
const targetPath = path.resolve('src/data/portfolioVideos.js');
const FILE_NAME_PATTERN = /^studio-videos(?: \(\d+\))?\.json$/i;
const EXCLUDED_VIDEO_IDS = new Set([
    'ggYmI9DIgJs', // dev case study
    'yi1iuJM1Vww', // cosmic superstar
    'Zi4oV9esC3w', // duplicate with Fitbot / private now
]);

const VIDEO_OVERRIDES = {
    'Iv8xAVWP-Ds': {
        category: '디자인',
        section: 'motion',
        title: '롯데홈쇼핑 바로알기 | 이천 자동화 물류센터',
    },
    'Qcezswtg2yU': {
        category: '디자인',
        section: 'design',
        title: '캐릭터 립싱크 | 조선멤버스 취준생 면접 필승 전략',
    },
    'KwJkwZOR1f4': {
        category: '디자인',
        section: 'edit',
        title: '국회 국집소 예능 영상 2',
    },
    'UU7XzIeqlK0': {
        category: '디자인',
        section: 'edit',
        title: '국회 어쩌다인턴 예능 영상 1',
    },
    'j4O7CKTEONI': {
        category: '디자인',
        section: 'design',
        title: '가정의학과 자막 디자인',
    },
    'RZ2EzlKigqo': {
        category: '디자인',
        section: 'edit',
        title: '구슬 애착인형 경연대회',
    },
    'SvZ5ECeT53g': {
        category: '디자인',
        section: 'design',
        title: '여행 영상',
    },
    'IHwd8zO2KRk': {
        category: '디자인',
        section: 'design',
        title: '미국대학입시컨설팅 인트로',
    },
    'jENZhdkI9RY': {
        category: '디자인',
        section: 'design',
        title: '한줄 유튜브 인트로',
    },
    'tSYy9GYdmRc': {
        category: '디자인',
        section: 'edit',
        title: '크립토 차트',
    },
    'maM5_DQNwgI': {
        category: '디자인',
        section: 'design',
        title: '여행 인트로',
    },
    'g-qCZq67cbE': {
        category: '디자인',
        section: 'design',
        title: '이수근채널 당구 자막 디자인',
    },
    '1YZOO9pLbQY': {
        category: '디자인',
        section: 'design',
        title: '탐정채널 인트로영상',
    },
    'LIX9c_AlvAA': {
        category: '디자인',
        section: 'design',
        title: '비뇨기과산부인과 자막 디자인',
    },
    'dZg5tkabopg': {
        category: '디자인',
        section: 'ai',
        title: '도깨비 동화 1',
    },
    'XCxamMM_7vM': {
        category: '디자인',
        section: 'ai',
        title: '도깨비 동화 2',
    },
    'Cjg20fAQUSI': {
        category: '3D',
        title: '멀티탭 홍보영상',
    },
    'Je54gM1ccDw': {
        category: '3D',
        title: '수경재배기구 제품 홍보',
    },
    'CH1klZAl9rA': {
        category: '3D',
        title: '세코어 로보스틱스 IR 피치영상',
    },
    'PmSm9-_y7O4': {
        category: '3D',
        title: '웨딩 반지 서핑 홍보 영상',
    },
    'cgeUUyAz7R0': {
        category: '3D',
        title: '비타민 제품 홍보',
    },
    'aWt8RAiKP3w': {
        category: '3D',
        title: '웨딩 반지 별 홍보 영상',
    },
    'AyYL5E7OIu8': {
        category: '3D',
        title: '3단 폴대 박람회영상',
    },
    'iGGFvrpeRr8': {
        category: '3D',
        title: '공기청정기 홍보영상',
    },
    'eweX-SA06Ss': {
        category: '3D',
        title: '카포트 홍보영상',
    },
    'KKQbx8WNG68': {
        category: '3D',
        title: '스마트블라인드 홍보영상',
    },
    '9L5D72ZVLrc': {
        category: '3D',
        title: '노인케어로봇 홍보영상',
    },
    'VOTU-8623Co': {
        category: '3D',
        title: '발각질제거기 홍보영상',
    },
    'URX0C7XdF0g': {
        category: '3D',
        title: '파레트밴드 홍보영상',
    },
    'vomJJrpoT1k': {
        category: '예능',
        title: '박성웅 유딱날 2',
    },
    '6ZuUQpCjfN0': {
        category: '예능',
        title: '박성웅 유딱날 1',
    },
    'jCedoH9wStg': {
        category: '예능',
        title: '첨단보석연구소 공개합니다 | VVS 시금법 랩그로운 다이아',
    },
    'tVDkecL1Vxw': {
        category: '예능',
        title: '현대 연구성과 교류회',
    },
    'tTAv8yObdJ4': {
        category: '예능',
        title: 'K리그 퓨처스 리프팅편',
    },
    'Z475UoAV4s4': {
        category: '예능',
        title: '현대엔지비 연구장학생 현대모터스튜디오 견학',
    },
};

const MANUAL_ENTRIES = [
    {
        category: '디자인',
        title: '고양시지속가능발전협의회 홍보영상',
        url: 'https://youtu.be/rQkWrjpCgKs',
        section: 'motion',
        type: 'YouTube Unlisted',
        thumbnail: 'https://i.ytimg.com/vi/rQkWrjpCgKs/hqdefault.jpg',
    },
];

function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function extractVideoId(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

    const patterns = [
        /[?&]v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = s.match(pattern);
        if (match?.[1]) return match[1];
    }

    return '';
}

function listMatchingFiles(dir) {
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((name) => FILE_NAME_PATTERN.test(name))
        .map((name) => path.join(dir, name))
        .filter((fullPath) => fs.statSync(fullPath).isFile());
}

function findSourceFile() {
    if (sourceArg) {
        return path.resolve(sourceArg);
    }

    const dirs = [
        path.join(os.homedir(), 'Downloads'),
        path.join(os.homedir(), 'Desktop', 'CustomDownloads'),
    ];

    const matches = dirs
        .flatMap((dir) => listMatchingFiles(dir))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

    return matches[0] || path.join(os.homedir(), 'Downloads', 'studio-videos.json');
}

function classifyCategory(row, videoId) {
    const override = VIDEO_OVERRIDES[videoId];
    if (override?.category) return override.category;
    if (EXCLUDED_VIDEO_IDS.has(videoId)) return null;

    const text = normalize(`${row.title} ${row.text}`).toLowerCase();

    if (/\[(개발|dev)\]/i.test(text)) return null;
    if (/\[(ai)\]/i.test(text)) return '디자인';
    if (/\[(3d|3디)\]/i.test(text)) return '3D';
    if (/\[(예능|film|촬영|cinematography)\]/i.test(text)) return '예능';
    if (/\[(디자인|edit|편집|design|모션|motion)\]/i.test(text)) return '디자인';

    if (/blender|octane|3d|모델링|렌더/.test(text)) return '3D';
    if (/드론|촬영|현장|멀티캠|스케치|film|cinematography/.test(text)) return '예능';
    if (/개발|dev/.test(text)) return null;
    if (/ai/.test(text)) return '디자인';

    return '디자인';
}

function inferEditSection(row, videoId) {
    const override = VIDEO_OVERRIDES[videoId];
    if (override?.section) return override.section;

    const text = normalize(`${row.title} ${row.text}`).toLowerCase();

    if (/\[(ai)\]/i.test(text) || /\bai\b/.test(text)) return 'ai';
    if (/모션|motion|립싱크|애니메이션|그래픽/.test(text)) return 'motion';
    if (/디자인|자막|타이틀|인트로|썸네일/.test(text)) return 'design';

    return 'edit';
}

function normalizeTitle(row, videoId) {
    const override = VIDEO_OVERRIDES[videoId];
    if (override?.title) return override.title;

    return normalize(row.title)
        .replace(/^\[[^\]]+\]\s*/u, '')
        .replace(/\s+[A-Za-z0-9_-]{11}$/u, '')
        .replace(/\+/g, ' ');
}

function toEntry(row) {
    const videoId = extractVideoId(row.watchUrl);
    const category = classifyCategory(row, videoId);

    if (!category) return null;

    const entry = {
        title: normalizeTitle(row, videoId) || 'Untitled',
        url: row.watchUrl,
        desc: '',
        type: 'YouTube Unlisted',
        thumbnail: VIDEO_OVERRIDES[videoId]?.thumbnail || row.thumbnail || '',
    };

    if (category === '디자인') {
        entry.section = inferEditSection(row, videoId);
    }

    return { category, entry };
}

function formatEntry(entry) {
    const lines = [
        '        {',
        `            title: ${JSON.stringify(entry.title)},`,
        `            url: ${JSON.stringify(entry.url)},`,
    ];

    if (entry.desc) {
        lines.push(`            desc: ${JSON.stringify(entry.desc)},`);
    }
    if (entry.section) {
        lines.push(`            section: ${JSON.stringify(entry.section)},`);
    }
    lines.push(`            type: ${JSON.stringify(entry.type)},`);
    if (entry.thumbnail) {
        lines.push(`            thumbnail: ${JSON.stringify(entry.thumbnail)},`);
    }
    lines.push('        },');
    return lines.join('\n');
}

function buildFileContent(grouped) {
    return `import { normalizeYouTubeThumbnail } from '../lib/youtubeThumbnails';

export const portfolioVideoMode = 'manual';

const portfolioVideos = {
    디자인: [
${grouped['디자인'].map(formatEntry).join('\n')}
    ],
    '3D': [
${grouped['3D'].map(formatEntry).join('\n')}
    ],
    예능: [
${grouped['예능'].map(formatEntry).join('\n')}
    ],
};

function extractVideoId(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

    const patterns = [
        /[?&]v=([A-Za-z0-9_-]{11})/,
        /youtu\\.be\\/([A-Za-z0-9_-]{11})/,
        /youtube\\.com\\/shorts\\/([A-Za-z0-9_-]{11})/,
        /youtube\\.com\\/embed\\/([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = s.match(pattern);
        if (match?.[1]) return match[1];
    }

    return '';
}

function resolveThumbnail(thumbnail, videoId) {
    return normalizeYouTubeThumbnail(thumbnail, videoId);
}

export function getPortfolioVideosByCategory(categoryTag) {
    const items = portfolioVideos[categoryTag];
    if (!Array.isArray(items)) return [];

    return items
        .map((item, index) => {
            const title = String(item?.title || '').trim();
            const desc = String(item?.desc || item?.description || '').trim();
            const thumbnail = String(item?.thumbnail || item?.thumbnailUrl || '').trim();
            const rawUrl = String(item?.url || '').trim();
            const rawVideoId = String(item?.videoId || item?.video_id || '').trim();
            const videoId = extractVideoId(rawVideoId || rawUrl);
            const url = rawUrl || (videoId ? \`https://www.youtube.com/watch?v=\${videoId}\` : '');
            const type = String(item?.type || 'YouTube Unlisted').trim();
            const hasContent = Boolean(title || desc || thumbnail || url || videoId);

            if (!hasContent) return null;

            return {
                videoId,
                title: title || \`Untitled \${index + 1}\`,
                type,
                desc,
                thumbnail: resolveThumbnail(thumbnail, videoId),
                url,
                section: String(item?.section || '').trim(),
            };
        })
        .filter(Boolean);
}

export default portfolioVideos;
`;
}

function main() {
    const sourcePath = findSourceFile();
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found: ${sourcePath}`);
    }

    const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const rows = Array.isArray(raw.rows) ? raw.rows : [];
    const unlisted = rows.filter((row) => row.visibility === 'unlisted' && row.watchUrl);

    if (unlisted.length === 0) {
        throw new Error('No unlisted videos with watchUrl were found in the source file');
    }

    const grouped = {
        디자인: MANUAL_ENTRIES.filter((entry) => entry.category === '디자인').map(({ category, ...entry }) => entry),
        '3D': MANUAL_ENTRIES.filter((entry) => entry.category === '3D').map(({ category, ...entry }) => entry),
        예능: MANUAL_ENTRIES.filter((entry) => entry.category === '예능').map(({ category, ...entry }) => entry),
    };

    for (const row of unlisted) {
        const mapped = toEntry(row);
        if (!mapped) continue;
        grouped[mapped.category].push(mapped.entry);
    }

    fs.writeFileSync(targetPath, buildFileContent(grouped), 'utf8');

    console.log(JSON.stringify({
        sourcePath,
        targetPath,
        totalRows: rows.length,
        unlistedCount: unlisted.length,
        categoryCounts: {
            디자인: grouped['디자인'].length,
            '3D': grouped['3D'].length,
            예능: grouped['예능'].length,
        },
    }, null, 2));
}

main();
