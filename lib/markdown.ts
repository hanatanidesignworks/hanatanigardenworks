import { marked } from 'marked';
import DDMPurify from 'isomorphic-dompurify';

(marked as any).setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false,
});

export function renderMarkdown(md: string): string {
    const raw = marked.parse(md || '') as string;
    const safe = DDMPurify.sanitize(raw, {
        ADD_ATTR: ['target', 'rel'],
    });
    return safe;
}