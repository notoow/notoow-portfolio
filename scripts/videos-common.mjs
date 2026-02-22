import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const CATEGORIES = new Set(['디자인', '3D', '예능']);

export function loadDotEnv(dotEnvPath = '.env') {
    const env = {};
    const fullPath = path.resolve(dotEnvPath);
    if (!fs.existsSync(fullPath)) return env;

    const text = fs.readFileSync(fullPath, 'utf8');
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq < 0) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        value = value.replace(/^['"]|['"]$/g, '');
        env[key] = value;
    }
    return env;
}

export function parseArgs(argv) {
    const out = { _: [] };
    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (!token.startsWith('--')) {
            out._.push(token);
            continue;
        }

        const key = token.slice(2);
        const next = argv[i + 1];
        if (!next || next.startsWith('--')) {
            out[key] = true;
            continue;
        }

        out[key] = next;
        i += 1;
    }
    return out;
}

export function createSupabaseClient({ write = false } = {}) {
    const dotEnv = loadDotEnv('.env');
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || dotEnv.SUPABASE_URL || dotEnv.VITE_SUPABASE_URL;

    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || dotEnv.SUPABASE_SERVICE_ROLE_KEY;
    const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || dotEnv.SUPABASE_ANON_KEY || dotEnv.VITE_SUPABASE_ANON_KEY;
    const key = write ? serviceRole : (anon || serviceRole);

    if (!url) throw new Error('Missing SUPABASE_URL or VITE_SUPABASE_URL');
    if (!key) {
        if (write) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for write access');
        throw new Error('Missing SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY)');
    }

    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

export function normalizeCategory(raw) {
    const value = String(raw || '').trim();
    if (!value) return '';
    const lower = value.toLowerCase().replace(/\s+/g, '');
    if (lower === 'design' || lower === '디자인') return '디자인';
    if (lower === '3d' || lower === '3디') return '3D';
    if (lower === '예능' || lower === 'variety') return '예능';
    return value;
}

export function extractLeadingTag(title) {
    const m = String(title || '').match(/^\s*\[([^\]]+)\]/);
    return m ? normalizeCategory(m[1]) : '';
}

export function isValidCategory(tag) {
    return CATEGORIES.has(tag);
}

export function toInt(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function extractVideoId(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

    const patterns = [
        /[?&]v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = s.match(p);
        if (m?.[1]) return m[1];
    }
    return '';
}

export function buildVideoUrl(videoId, fallbackUrl = '') {
    if (videoId) return `https://www.youtube.com/watch?v=${videoId}`;
    return fallbackUrl || '';
}

export function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuote = false;

    const pushCell = () => {
        row.push(cell);
        cell = '';
    };
    const pushRow = () => {
        if (row.length === 1 && row[0] === '') {
            row = [];
            return;
        }
        rows.push(row);
        row = [];
    };

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const next = text[i + 1];
        if (inQuote) {
            if (ch === '"' && next === '"') {
                cell += '"';
                i += 1;
            } else if (ch === '"') {
                inQuote = false;
            } else {
                cell += ch;
            }
            continue;
        }

        if (ch === '"') {
            inQuote = true;
        } else if (ch === ',') {
            pushCell();
        } else if (ch === '\n') {
            pushCell();
            pushRow();
        } else if (ch !== '\r') {
            cell += ch;
        }
    }
    pushCell();
    if (row.length) pushRow();

    if (!rows.length) return [];
    const header = rows[0].map((h) => String(h || '').trim());
    return rows.slice(1).map((r) => {
        const obj = {};
        header.forEach((h, i) => { obj[h] = String(r[i] ?? '').trim(); });
        return obj;
    });
}

export function readInputRows(filePath) {
    const fullPath = path.resolve(filePath);
    const raw = fs.readFileSync(fullPath, 'utf8');
    if (filePath.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error('JSON input must be an array');
        return parsed;
    }
    if (filePath.toLowerCase().endsWith('.csv')) {
        return parseCsv(raw);
    }
    throw new Error('Unsupported input file. Use .json or .csv');
}

