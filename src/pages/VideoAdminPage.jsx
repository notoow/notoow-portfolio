import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

const CATEGORY_OPTIONS = ['디자인', '3D', '예능'];

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
    for (const p of patterns) {
        const m = s.match(p);
        if (m?.[1]) return m[1];
    }
    return '';
}

function newDraft() {
    return {
        category_tag: '디자인',
        title: '',
        url: '',
        video_id: '',
        video_type: 'YouTube',
        description: '',
        thumbnail_url: '',
        sort_order: 0,
        is_active: true,
    };
}

export default function VideoAdminPage() {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [draft, setDraft] = useState(newDraft());

    const canUse = hasSupabaseConfig && supabase;

    const loadRows = useCallback(async () => {
        if (!canUse || !session) return;
        setLoading(true);
        setError('');
        const { data, error: dbError } = await supabase
            .from('portfolio_videos')
            .select('*')
            .order('category_tag', { ascending: true })
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (dbError) {
            setError(dbError.message);
            setRows([]);
        } else {
            setRows(Array.isArray(data) ? data : []);
        }
        setLoading(false);
    }, [canUse, session]);

    useEffect(() => {
        if (!canUse) return;
        supabase.auth.getSession().then(({ data }) => setSession(data?.session || null));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession || null);
        });
        return () => listener?.subscription?.unsubscribe?.();
    }, [canUse]);

    useEffect(() => {
        loadRows();
    }, [loadRows]);

    const grouped = useMemo(() => {
        const out = { 디자인: [], '3D': [], 예능: [] };
        for (const row of rows) {
            if (out[row.category_tag]) out[row.category_tag].push(row);
        }
        return out;
    }, [rows]);

    async function handleSignIn(e) {
        e.preventDefault();
        if (!canUse) return;
        setError('');
        setMessage('');
        const redirectTo = window.location.href;
        const { error: signError } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo },
        });
        if (signError) setError(signError.message);
        else setMessage('로그인 링크를 메일로 보냈습니다. 메일 확인 후 같은 페이지로 돌아오세요.');
    }

    async function handleSignOut() {
        if (!canUse) return;
        await supabase.auth.signOut();
        setRows([]);
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!canUse || !session) return;
        setError('');
        const videoId = extractVideoId(draft.video_id || draft.url);
        const payload = {
            ...draft,
            video_id: videoId || null,
            url: draft.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null),
            sort_order: Number(draft.sort_order) || 0,
        };

        const { error: insertError } = await supabase.from('portfolio_videos').insert(payload);
        if (insertError) {
            setError(insertError.message);
            return;
        }
        setDraft(newDraft());
        await loadRows();
    }

    async function handleSave(row) {
        if (!canUse || !session) return;
        setError('');
        const videoId = extractVideoId(row.video_id || row.url);
        const payload = {
            category_tag: row.category_tag,
            title: row.title,
            url: row.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null),
            video_id: videoId || null,
            video_type: row.video_type || 'YouTube',
            description: row.description || null,
            thumbnail_url: row.thumbnail_url || null,
            sort_order: Number(row.sort_order) || 0,
            is_active: Boolean(row.is_active),
        };
        const { error: updateError } = await supabase.from('portfolio_videos').update(payload).eq('id', row.id);
        if (updateError) {
            setError(updateError.message);
            return;
        }
        setMessage(`저장 완료: #${row.id}`);
    }

    async function handleDelete(id) {
        if (!canUse || !session) return;
        if (!window.confirm(`정말 삭제할까요? (#${id})`)) return;
        setError('');
        const { error: deleteError } = await supabase.from('portfolio_videos').delete().eq('id', id);
        if (deleteError) {
            setError(deleteError.message);
            return;
        }
        await loadRows();
    }

    function updateRow(id, key, value) {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
    }

    if (!canUse) {
        return (
            <div style={{ padding: '3rem', color: '#fff', background: '#111', minHeight: '100vh' }}>
                <h1 style={{ marginBottom: '1rem' }}>Video Admin</h1>
                <p>Supabase 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)가 필요합니다.</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0b0b0b', color: '#f3f3f3', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem' }}>Video Admin</h1>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a href="#" style={{ color: '#9aa0a6', textDecoration: 'none' }}>← 포트폴리오</a>
                        {session && <button onClick={handleSignOut}>로그아웃</button>}
                    </div>
                </div>

                {error && <p style={{ color: '#ff7f7f' }}>{error}</p>}
                {message && <p style={{ color: '#8fe388' }}>{message}</p>}

                {!session ? (
                    <form onSubmit={handleSignIn} style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="로그인 이메일"
                            required
                            style={{ flex: 1, padding: '0.7rem', background: '#161616', color: '#fff', border: '1px solid #333' }}
                        />
                        <button type="submit" style={{ padding: '0.7rem 1rem' }}>로그인 링크 보내기</button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleCreate} style={{ margin: '1.5rem 0', padding: '1rem', border: '1px solid #333', borderRadius: '10px' }}>
                            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>새 영상 추가</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <select value={draft.category_tag} onChange={(e) => setDraft((p) => ({ ...p, category_tag: e.target.value }))}>
                                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input placeholder="제목" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} required />
                                <input placeholder="유튜브 URL" value={draft.url} onChange={(e) => setDraft((p) => ({ ...p, url: e.target.value }))} />
                                <input placeholder="video_id (선택)" value={draft.video_id} onChange={(e) => setDraft((p) => ({ ...p, video_id: e.target.value }))} />
                                <input placeholder="설명" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
                                <input placeholder="썸네일 URL" value={draft.thumbnail_url} onChange={(e) => setDraft((p) => ({ ...p, thumbnail_url: e.target.value }))} />
                                <input type="number" placeholder="정렬순서" value={draft.sort_order} onChange={(e) => setDraft((p) => ({ ...p, sort_order: e.target.value }))} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft((p) => ({ ...p, is_active: e.target.checked }))} />
                                    활성
                                </label>
                            </div>
                            <button type="submit" style={{ marginTop: '0.75rem' }}>추가</button>
                        </form>

                        {loading ? (
                            <p>불러오는 중...</p>
                        ) : (
                            CATEGORY_OPTIONS.map((cat) => (
                                <section key={cat} style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '0.6rem' }}>{cat} ({grouped[cat].length})</h3>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        {grouped[cat].map((row) => (
                                            <div key={row.id} style={{ border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 100px 100px', gap: '0.5rem' }}>
                                                    <select value={row.category_tag} onChange={(e) => updateRow(row.id, 'category_tag', e.target.value)}>
                                                        {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                    <input value={row.title || ''} onChange={(e) => updateRow(row.id, 'title', e.target.value)} />
                                                    <input value={row.url || ''} onChange={(e) => updateRow(row.id, 'url', e.target.value)} />
                                                    <input type="number" value={row.sort_order || 0} onChange={(e) => updateRow(row.id, 'sort_order', e.target.value)} />
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <input type="checkbox" checked={Boolean(row.is_active)} onChange={(e) => updateRow(row.id, 'is_active', e.target.checked)} />
                                                        활성
                                                    </label>
                                                </div>
                                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleSave(row)}>저장</button>
                                                    <button onClick={() => handleDelete(row.id)} style={{ color: '#ffb3b3' }}>삭제</button>
                                                    <span style={{ color: '#8a8f98', fontSize: '0.85rem', marginLeft: '0.5rem' }}>#{row.id}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

