import { createSupabaseClient, parseArgs } from './videos-common.mjs';

const args = parseArgs(process.argv.slice(2));
const category = args.category ? String(args.category).trim() : '';
const includeInactive = Boolean(args.all);
const limit = Number(args.limit || 100);

async function main() {
    const supabase = createSupabaseClient({ write: false });
    let query = supabase
        .from('portfolio_videos')
        .select('id, category_tag, title, video_id, url, video_type, is_active, sort_order, published_at')
        .order('category_tag', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);

    if (!includeInactive) query = query.eq('is_active', true);
    if (category) query = query.eq('category_tag', category);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const rows = Array.isArray(data) ? data : [];
    console.log(JSON.stringify({
        count: rows.length,
        includeInactive,
        category: category || null,
        items: rows,
    }, null, 2));
}

main().catch((err) => {
    console.error(`[videos:list] ${err.message}`);
    process.exit(1);
});

