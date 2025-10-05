'use client';
import { easeInOut, motion } from 'framer-motion';
import Link from 'next/link';

type ArticleCard = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[] | null;
  created_at: string;
};


export default function Hero({ posts }: { posts: ArticleCard[] }) {

    return (
        <section className='grid grid-cols-1 sm:grid-cols-2 gap-1 max-w-[768px] mx-auto'>
            {posts?.map((post, i) => 
            <motion.article
                 key={post.id}
                 initial={{ opacity: 0, y: 16}}
                 animate={{ opacity:1, y:0 }}
                 whileHover={{
                    rotate: [0, -2, 2, -1, 1, 0],
                    transition: {
                        type: "tween",
                        duration: 0.4,
                        ease: "easeInOut"
                    }
                 }}
                 transition={{ duration: 0.35, delay: i * 0.2 }} 
                 className='flex flex-row gap-2 max-w-sm w-[350px] md:w-[370px] bg-white rounded-xl shadow-md overflow-hidden mt-4 p-4 hover:bg-gray-100'
            >
                <div className='w-[50px] h-[50px] aspect-[1/1]'>
                    <img
                        src={post.cover_url?.trim() || 'https://tnvedtpqxtghrjvzilrb.supabase.co/storage/v1/object/public/post-images/public/noimage.jpg'}
                        alt={post.title ?? 'image'}
                        className='w-[50px] h-[50px] object-cover'
                    />
                </div>
                <div>
                    <h2 className='text-lg font-bold text-gray-600'>
                    <Link href={`/posts/${encodeURIComponent(post.slug)}`}> {post.title}</Link>
                    </h2>
                    <p className='text-sm mt-2 text-blue-900'>
                        {post.excerpt ? post.excerpt.slice(0, 50) + (post.excerpt.length > 50 ? "..." : "") : ""}
                    </p>
                </div>
            </motion.article>
            )}
        </section>
    );
}