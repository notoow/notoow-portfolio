import { createSupabaseClient, extractVideoId, parseArgs } from './videos-common.mjs';

const args = parseArgs(process.argv.slice(2));
const id = args.id ? Number(args.id) : null;
const videoId = extractVideoId(args['video-id'] || '');
const url = args.url ? String(args.url).trim() : '';
const category = args.category ? String(args.category).trim() : '';
const all = Boolean(args.all);

async function main() {
    const supabase = createSupabaseClient({ write: true });

    if (!all && !id && !videoId && !url && !category) {
        console.error('Usage: npm run videos:disable -- --id 1 | --video-id XXXXX | --url https://... | --category 디자인 | --all');
        process.exit(1);
    }

    let query = supabase.from('portfolio_videos').update({ is_active: false });

    if (all) {
        query = query.neq('id', 0);
    } else if (id) {
        query = query.eq('id', id);
    } else if (videoId) {
        query = query.eq('video_id', videoId);
    } else if (url) {
        query = query.eq('url', url);
    } else if (category) {
        query = query.eq('category_tag', category);
    }

    const { data, error } = await query.select('id, category_tag, title, video_id, url, is_active');
    if (error) throw new Error(error.message);

    const rows = Array.isArray(data) ? data : [];
    console.log(JSON.stringify({
        disabledCount: rows.length,
        items: rows,
    }, null, 2));
}

main().catch((err) => {
    console.error(`[videos:disable] ${err.message}`);
    process.exit(1);
});

