'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type MiniPost = {
    id: number;
    title: string;
    slug: string;
    published: boolean;
    updated_at: string;
}

export default function AdminPage() {
    const router  = useRouter();
    const [ loading, setLoading ] = useState(true);
    const [ userEmail, setUserEmail ] = useState<string | null>(null);

    const [posts, setPosts] = useState<MiniPost[]>([]);
    const [listLoading, setListLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (!data.session) {
                router.push('/login');
            } else {
                setUserEmail(data.session.user.email ?? null);
                setLoading(false);

                await fetchPosts();
            }
        };

        checkSession();
    }, [router]);

    const fetchPosts = async () => {
        setListLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, slug, published, updated_at')
            .order('updated_at', { ascending: false })
            .limit(50);

    if (!error && data) setPosts(data as MiniPost[]);
    setListLoading(false);
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">管理画面</h1>
            <p className="mb-6 text-gray-700">ログイン中：{userEmail}</p>

            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/admin/new')}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    新規投稿
                </button>

                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push('/login');
                    }}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                    LOGOUT
                </button>
            </div>

            <div className="rounded-xl border bg-white mt-[50px]">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h2 className="font-semibold">投稿一覧</h2>
                    {listLoading && <span className="text-xs text-gray-500">Loading...</span>}
                </div>

                <ul className="divide-y">
                    {posts.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-4 ps-4 py-3">
                            <div className="min-w-0">
                                <p className="truncate font-medium">{p.title}</p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    /posts/{p.slug}
                                    {!p.published && (
                                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                                            Draft
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <button
                                    onClick={() => 
                                        router.push(`/admin/edit/${encodeURIComponent(p.slug)}`)
                                    }
                                    className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-shite hover:bg-amerald-700">
                                        編集
                                    </button>
                            </div>
                        </li>
                    ))}

                    {posts.length === 0 && !listLoading && (
                        <li className="px-4 py-6 text-sm text-gray-500">投稿がありません。</li>
                    )}
                </ul>
            </div>
        </div>
    );
}