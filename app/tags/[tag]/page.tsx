import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export const revalidate = 60;

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag: raw } = await params;
    const tag = decodeURIComponent(raw).trim();

    const { data: articles, error } = await supabase
        .from('articles')
            .select('id, title, slug, excerpt, cover_url, tags, created_at')
        .eq('published', true)
        .overlaps('tags', [tag])
        .order('created_at', { ascending: false});

    if (error) {
    console.error(error);
    return <div>読み込みに失敗しました。</div>;
    }

    if (!articles?.length) {
        return (
            <main className='max-w-3xl mx-auto p-4'>
                <h1 className='text-2xl font-bold mb-4'>#{tag}</h1>
                <p>「{tag}」タグの記事はまだありません。</p>
            </main>
        );
    }

    return (
        <main className='max-w-3xl mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>#{tag}の記事</h1>
            <ul className='grid gap-4 md:grid-cols-2'>
                {articles.map((a) => (
                    <li
                        key={a.id}
                        className='rounded-xl shadow p-4 bg-white hover:-translate-y-[2px] transition'
                    >
                        <Link href={`/posts/${a.slug}`}>
                            {a.cover_url && (
                                <img
                                    src={a.cover_url}
                                    alt={a.title}
                                    className='w-full h-40 object-cover rounded-md mb-3'
                                />
                            )}
                            <h2 className='text-lg font-semibold line-clamp-2'>{a.title}</h2>
                            <p className='text-sm text-gray-600 line-clamp-3 mt-1'>
                                {a.excerpt}
                            </p>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {a.tags?.map((t: string) => (
                                    <Link
                                        key={t}
                                        href={`/tags/${encodeURIComponent(t)}`}
                                        className='text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded'
                                    >
                                        #{t}
                                    </Link>
                                ))}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}

