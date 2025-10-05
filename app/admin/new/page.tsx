'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { renderMarkdown } from "@/lib/markdown";
import { slugify } from '@/lib/slugify';

export default function NewPostPage() {
    const router = useRouter();
    const [loadingGate, setLoadingGate] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push('/login');
                return;
            }
            setLoadingGate(false);
        })();
    }, [router]);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [published, setPublished] = useState(true);

    const [slugTouched, setSlugTouched] = useState(false);

    const [slugExists, setSlugExists] = useState<null | boolean>(null);
    const slugCheckTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!slugTouched) {
            setSlug(slugify(title));
        }
    }, [title, slugTouched]);

    const handleSlugChange = (v: string) => {
        if (!slugTouched) setSlugTouched(true);
        setSlug(slugify(v));
    }

    useEffect(() => {
        if (!slug) {
            setSlugExists(null);
            return;
        }
        if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);

        slugCheckTimer.current = setTimeout(async () => {
            const { data, error } = await supabase
            .from('articles')
            .select('slug')
            .eq('slug', slug)
            .limit(1)
            .maybeSingle();

        if (error) {
            setSlugExists(null);
            return;
        }
        setSlugExists(!!data);
        }, 350);
    }, [slug]);

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const htmlPreview = useMemo(() => renderMarkdown(content || ''), [content]);

    if (loadingGate) return <p className="p-6">Auth checking...</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!title || !slug || !content) {
            setErrorMsg('タイトル・スラッグ・本文は必須です。');
            return;
        }
        if (slugExists) {
            setErrorMsg('このスラッグは既に使われています。別の文字列にしてください。');
            return;
        }

        setSubmitting(true);
        try {
            const tags =
            tagsText
                .split(',')
                .map(t => t.trim())
                .filter(Boolean) || [];
        
        const normalizedSlug = slug.normalize('NFC').trim();
        const { error } = await supabase
            .from('articles')
            .insert([
                {
                    title,
                    slug: normalizedSlug,
                    excerpt: excerpt || null,
                    content_md: content,
                    cover_url: coverUrl || null,
                    tags,
                    published,
                },
            ]);

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push(`/posts/${slug}`);
        }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="text-2xl font-bold">新規投稿</h1>
            <p className="mt-1 text-sm text-gray-600">
                タイトル・本文(markdown)を入力してください。
            </p>

            {errorMsg && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">タイトル*</label>
                        <input 
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="例）庭師ブログの第一歩"
                            required
                        />
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="mb-1 block text-sm font-medium">スラッグ</label>
                            <div className="flex items-center gap-2 text-xs">
                                {!slugTouched ? (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                                        自動生成
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="rounded border px-2 py-0.5 hover:bg-gray-50"
                                        onClick={() => {
                                            setSlugTouched(false);
                                            setSlug(slugify(title));
                                        }}
                                        title="タイトルから再生成"
                                    >
                                        もう一度自動にする
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <input 
                            type="text"
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="first-article または 日本語スラッグ"
                            required
                        />
                        <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                                URL: <code>/posts/{slug || 'your-slug'}</code>
                            </span>
                            {slugExists === true && (
                                <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">
                                    使用中
                                </span>
                            )}
                            {slugExists === false && slug && (
                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700">
                                    利用可
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">抜粋(excerpt)</label>
                        <input
                            type="text"
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="一覧で表示される概要文(100字程度)"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">カバー画像URL</label>
                        <input
                            type="url"
                            value={coverUrl}
                            onChange={e => setCoverUrl(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="https://..."
                        />
                    </div>

                    {/* 本文(Markdown) */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block text-sm font-medium">本文(Markdown) *</label>
                            <span className="text-xs text-gray-500">ライブプレビューは右側に表示</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`# 見出し、本文を書き始めましょう。*斜体*、 **太字**、\`コード\`、リストなどMarkdownが使えます。`}
                            className="h-72 w-full rounded-md border px-3 py-2 font-mono text-sm leading-6"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">タグ(カンマ区切り)</label>
                        <input
                            type="text"
                            value={tagsText}
                            onChange={e => setTagsText(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="庭師, Next.js, 起業"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={e => setPublished(e.target.checked)}
                    />
                        公開する（下書きの場合はオフに）
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? '投稿中...' : '投稿する'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin')}
                            className="rounded-md border px-4 py-2 hover:bg-gray-50"
                        >
                            管理画面へ戻る
                        </button>
                    </div>
                </div>

                {/* 右：ライブプレビュー　*/}
                <div className="rounded-xl border bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">プレビュー</h2>
                        {coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverUrl} alt="" className="h-10 w-16 rounded object-cover" />
                        
                        ) : (
                            <span className="text-xs text-gray-400">No image</span>
                        )}
                    </div>
                    <article
                        className="prose prose-zinc max-w-none md:prose-lg"
                        dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    />
                </div>
            </form>
        </div>
    );
}