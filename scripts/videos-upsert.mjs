import {
    buildVideoUrl,
    createSupabaseClient,
    extractLeadingTag,
    extractVideoId,
    isValidCategory,
    normalizeCategory,
    parseArgs,
    readInputRows,
    toInt,
} from './videos-common.mjs';

const args = parseArgs(process.argv.slice(2));
const file = args.file || args.f;
const dryRun = Boolean(args['dry-run']);

if (!file) {
    console.error('Usage: npm run videos:upsert -- --file ./data/videos.csv [--dry-run]');
    process.exit(1);
}

function toBool(v, fallback = true) {
    if (v === undefined || v === null || v === '') return fallback;
    const s = String(v).trim().toLowerCase();
    if (['1', 'true', 'yes', 'y'].includes(s)) return true;
    if (['0', 'false', 'no', 'n'].includes(s)) return false;
    return fallback;
}

function normalizeRow(input) {
    const rawTitle = String(input.title || '').trim();
    const tag = normalizeCategory(input.category_tag || extractLeadingTag(rawTitle));
    const videoId = extractVideoId(input.video_id || input.url || '');
    const url = String(input.url || '').trim() || buildVideoUrl(videoId);

    if (!tag || !isValidCategory(tag)) {
        throw new Error(`Invalid or missing category_tag for title "${rawTitle}"`);
    }
    if (!rawTitle) {
        throw new Error('title is required');
    }

    return {
        category_tag: tag,
        title: rawTitle,
        video_id: videoId || null,
        url: url || null,
        video_type: String(input.video_type || 'YouTube').trim(),
        description: String(input.description || '').trim() || null,
        thumbnail_url: String(input.thumbnail_url || '').trim() || null,
        published_at: String(input.published_at || '').trim() || null,
        sort_order: toInt(input.sort_order, 0),
        is_active: toBool(input.is_active, true),
    };
}

async function main() {
    const supabase = createSupabaseClient({ write: true });
    const sourceRows = readInputRows(file);
    const normalized = sourceRows.map(normalizeRow);

    const { data: existingRows, error: existingError } = await supabase
        .from('portfolio_videos')
        .select('id, video_id, url, title, category_tag');
    if (existingError) throw new Error(existingError.message);

    const byVideoId = new Map();
    const byUrl = new Map();
    for (const row of existingRows || []) {
        if (row.video_id) byVideoId.set(row.video_id, row);
        if (row.url) byUrl.set(row.url, row);
    }

    const inserts = [];
    const updates = [];

    for (const row of normalized) {
        const existing = (row.video_id && byVideoId.get(row.video_id)) || (row.url && byUrl.get(row.url));
        if (existing?.id) {
            updates.push({ id: existing.id, ...row });
        } else {
            inserts.push(row);
        }
    }

    if (dryRun) {
        console.log(JSON.stringify({
            dryRun: true,
            totalInput: normalized.length,
            insertCount: inserts.length,
            updateCount: updates.length,
            sampleInsert: inserts[0] || null,
            sampleUpdate: updates[0] || null,
        }, null, 2));
        return;
    }

    if (inserts.length) {
        const { error } = await supabase.from('portfolio_videos').insert(inserts);
        if (error) throw new Error(`Insert failed: ${error.message}`);
    }

    for (const row of updates) {
        const { id, ...payload } = row;
        const { error } = await supabase.from('portfolio_videos').update(payload).eq('id', id);
        if (error) throw new Error(`Update failed for id ${id}: ${error.message}`);
    }

    console.log(JSON.stringify({
        dryRun: false,
        totalInput: normalized.length,
        insertCount: inserts.length,
        updateCount: updates.length,
    }, null, 2));
}

main().catch((err) => {
    console.error(`[videos:upsert] ${err.message}`);
    process.exit(1);
});

