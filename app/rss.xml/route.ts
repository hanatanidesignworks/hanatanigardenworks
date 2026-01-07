import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    const h = headers();
    const host = (await h).get('host') ?? 'loclahost:3000';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = `${proto}://${host}`;
    const feedUrl = `${siteUrl}/rss.xml`;

    const { data: articles, error } = await supabase
        .from('articles')
        .select('title, slug, excerpt, content_md, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        return new NextResponse(`RSS error: ${error.message}` , { status: 500 })
    }

    const now = new Date().toUTCString();

    const items = (articles ?? [])
        .map((a) => {
            const link = `${siteUrl}/posts/${a.slug}`

            const fallback = a.content_md ? stripMd(String(a.content_md)).slice(0, 180) : '';
            const desc = escapeCdata((a.excerpt ?? fallback ?? '').trim());

            const pubDate = a.created_at ? new Date(a.created_at).toUTCString() : now;

            return `
        <item>
            <title><![CDATA[${a.title}]]></title>
            <link>${link}</link>
            <guid isPermaLink="true">${link}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${desc}]]></description>
        </item>
            `
        })
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>庭師、仕事を取りに行く。</title>
        <link>${siteUrl}</link>
        <description>個人宅専門・独立5カ月目の庭師による営業と実践の記録</description>
        <language>ja</language>
        <lastBuildDate>${now}</lastBuildDate>
        <atom:link href="${feedUrl}" rel="self" type="application/rss.xml" />
        ${items}
    </channel>
</rss>`

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'no-store'
        },
    });
}

function escapeCdata(text: string) {
    return text.replaceAll(']]>', ']]]]><![CDATA[>');
}

function stripMd(md: string) {
    return md
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[[^\]]*?\]\([^)]+\)/g, '')
        .replace(/\[[^\]]*?\]\([^)]+\)/g, '$1')
        .replace(/[#>*_~\-]+/g, ' ') 
        .replace(/\s+/g, ' ')
        .trim()
}