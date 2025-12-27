'use client'

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";

type Editable = {
    title: string;
    slug: string;
    excerpt: string | null;
    cover_url: string | null;
    tags: string[];
    content_md: string;
    published: boolean;
}

export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const raw = (params.slug as string) || '';
    const slug = decodeURIComponent(raw).normalize('NFC').trim();

    const [loadingGate, setLoadingGate] = useState(true);
    const [loadingDoc, setLoadingDoc] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [articleId, setArticleId] = useState<string | null>(null);

    const [form, setForm] = useState<Editable>({
        title: '',
        slug,
        excerpt: '',
        cover_url: '',
        tags: [],
        content_md: "",
        published: true,
    });

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

    useEffect(() => {
        if (loadingGate) return;
        (async () => {
            setLoadingDoc(true);
            const { data, error } = await supabase
                .from('articles')
                .select('id, title, slug, excerpt, cover_url, tags, content_md, published')
                .eq('slug', slug)
                .maybeSingle();

            if(!data) {
                setErrorMsg('記事が見つかりませんでした');
                return;
            }

            console.log('fetched article:', data);
            console.log('fetched id:', data.id);

            setArticleId(data.id);

            if (error || !data) {
                setErrorMsg('記事が見つかりませんでした。');
            } else {
                setForm({
                    title: data.title,
                    slug: data.slug,
                    excerpt: data.excerpt,
                    cover_url: data.cover_url,
                    tags: data.tags || [],
                    content_md: data.content_md || "",
                    published: data.published,
                });
            }
            setLoadingDoc(false);
        })();
    }, [loadingGate, slug]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const { data, error } = await supabase
            .from('articles')
            .update({
                title: form.title,
                excerpt: form.excerpt,
                cover_url: form.cover_url,
                tags: form.tags,
                content_md: form.content_md,
                published: form.published,
            })
            .eq('id', articleId)
            .select('id')
            .maybeSingle();

        if (error) {
            setErrorMsg(error.message);
            return;
        }
        if (!data) {
            setErrorMsg('更新対象が0件でした（slug不一致 or 権限/RLSの可能性）');
            return;
        }

        router.push(`/posts/${encodeURIComponent(slug)}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `本当に「${form.title || 'この記事'}」を削除しますか？\nこの操作は取り消せません。`
        );
        if(!confirmDelete) return;

        const { error } = await supabase.from('articles').delete().eq('slug', slug);

        if (error) {
            alert('削除に失敗しました: ' + error.message);
            return;
        }

        alert('削除が完了しました。');
        router.push('/admin');
    };

    const htmlPreview = useMemo(() => renderMarkdown(form.content_md || ""), [form.content_md]);

    if (loadingGate || loadingDoc) return <p className="p-6">Loading...</p>;

    return (
        <div className="mx-auto max-w- 3xl p-6">
            <h1 className="text-xl font-bold">記事を編集</h1>
            {errorMsg && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleUpdate} className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">タイトル</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value})}
                        className="w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">抜粋（任意）</label>
                    <input
                        type="text"
                        value={form.excerpt ?? ''}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">カバー画像URL（任意）</label>
                    <input
                        type="url"
                        value={form.cover_url ?? ''}
                        onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-mediun">タグ（カンマ区切り）</label>
                    <input
                        type="text"
                        value={form.tags.join(', ')}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                tags: e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                            })
                        }
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="例: 庭師,Next.js,起業"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">本文＜Markdown＞</label>
                    <textarea
                        value={form.content_md}
                        onChange={(e) => setForm({ ...form, content_md: e.target.value })}
                        rows={14}
                        className="w-full rounded-md border px-3 py-2 font-mono text-sm leading-relaxed"
                        placeholder="ここにMarkdown形式で本文を入力..."
                    ></textarea>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    />
                    公開する
                </label>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                            保存
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="rounded-md border px-4 py-2 hover:bg-gray-50"
                    >
                        管理画面へ戻る
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        削除
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-md">
                <h2 className="mb-3 text-sm font-semibold text-gray-700">プレビュー</h2>
                {form.cover_url ? (
                    <img
                        src={form.cover_url}
                        alt="cover"
                        className="mb-4 h-40 w-full rounded object-cover"
                    />
                ) : (
                    <div className="mb-4 h-40 w-full rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}
                <article
                    className="prose prose-zinc max-w-none md:prose-lg"
                    dangerouslySetInnerHTML={{ __html: htmlPreview}}
                />
            </div>
            </form>
        </div>
    );
}