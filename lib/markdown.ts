import { marked } from 'marked';
import DDMPurify from 'isomorphic-dompurify';

marked.setOptions({
    gfm: true,
    breaks: true,
});

export function renderMarkdown(md: string): string {
    const raw = marked.parse(md || '') as string;
    const safe = DDMPurify.sanitize(raw, {
        ADD_ATTR: ['target', 'rel'],
    });
    return safe;
}