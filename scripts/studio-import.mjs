import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const sourceArg = process.argv[2];
const sourceCandidates = [
    sourceArg ? path.resolve(sourceArg) : '',
    path.join(os.homedir(), 'Downloads', 'studio-videos.json'),
    path.join(os.homedir(), 'Desktop', 'CustomDownloads', 'studio-videos.json'),
].filter(Boolean);
const sourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate)) || sourceCandidates[0];
const targetPath = path.resolve('src/data/portfolioVideos.js');

function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function classifyCategory(row) {
    const text = normalize(`${row.title} ${row.text}`).toLowerCase();
    if (/\[(3d|3디)\]/i.test(text)) return '3D';
    if (/\[(예능|film|촬영|cinematography)\]/i.test(text)) return '예능';
    if (/\[(디자인|edit|편집|design|모션|motion)\]/i.test(text)) return '디자인';

    if (/blender|octane|3d|모델링|렌더/.test(text)) return '3D';
    if (/드론|촬영|현장|멀티캠|스케치|film|cinematography/.test(text)) return '예능';
    return '디자인';
}

function inferEditSection(row) {
    const text = normalize(`${row.title} ${row.text}`).toLowerCase();

    if (/모션|motion|립싱크|애니메이션|그래픽/.test(text)) return 'motion';
    if (/디자인|자막|타이틀|썸네일/.test(text)) return 'design';

    return 'edit';
}

function sortRows(a, b) {
    const titleA = normalize(a.title).toLowerCase();
    const titleB = normalize(b.title).toLowerCase();
    return titleA.localeCompare(titleB, 'ko');
}

function toEntry(row, category) {
    const entry = {
        title: normalize(row.title) || 'Untitled',
        url: row.watchUrl,
        desc: '',
        type: 'YouTube Unlisted',
        thumbnail: row.thumbnail || '',
    };

    if (category === '디자인') {
        entry.section = inferEditSection(row);
    }

    return entry;
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
        디자인: [],
        '3D': [],
        예능: [],
    };

    unlisted.sort(sortRows).forEach((row) => {
        const category = classifyCategory(row);
        grouped[category].push(toEntry(row, category));
    });

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
