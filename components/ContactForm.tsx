'use client';

import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const nameJaRegex =  /^[ぁ-んァ-ン一-龥　]+$/;
const z2h = (s: string) =>
    s.replace(/[！-～]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/　/g, ' ');
const isValidEmail = (raw: string) => {
    const s = z2h(raw).trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(s);
};
const normalizeEmail = (raw: string) => z2h(raw).trim().toLowerCase();

export default function ContactForm(){
    const [name, setName] = useState('');
    const [emailRaw, setEmailRaw] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const email = useMemo(() => normalizeEmail(emailRaw), [emailRaw]);

    const nameOk = name.trim() !== '' && nameJaRegex.test(name.trim());
    const emailOk = isValidEmail(emailRaw);
    const commentOk = comment.trim() !== '';

    const allOk = nameOk && emailOk && commentOk && !submitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (!allOk){
            setErr('入力内容をご確認ください。');
            return;
        }
        setSubmitting(true);
        setMessage('');

    try {
        const trimmedName = name.trim();
        if (!nameJaRegex.test(trimmedName)){
            setErr('名前は日本語（ひらがな・カタカナ・漢字）のみで入力してください。');
            return;
        }

        const { error } = await supabase.from('contacts').insert([
            {
                name: trimmedName,
                email,
                comment: comment.trim(),
            },
        ]);

        if (error) {
            console.error(error);
            setMessage('送信に失敗しました。もう一度お試しください。');
        } else {
            setMessage('送信が完了しました！');
            setName('');
            setEmailRaw('');
            setComment('');
        }
    } finally {
        setSubmitting(false);
    }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4'
        >
            <h2 className='text-xl font-bold text-gray-800 text-center'>お問い合わせフォーム</h2>

            <div>
                <label className='block mb-1 font-medium text-gray-700'>お名前</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || nameJaRegex.test(value)) {
                            setName(value);
                            setErr('');
                        } else {
                            setErr('日本語（ひらがな・カタカナ・漢字）のみ入力できます。');
                        }
                    }}
                    className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200'
                    required
                />
            </div>

            <div>
                <label className='block mb-1 font-medium text-gray-700'>メールアドレス</label>
                <input
                    type="email"
                    value={emailRaw}
                    onChange={(e) => {
                        setEmailRaw(e.target.value);
                        setErr(null);
                    }}
                    className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200'
                    required
                />
            </div>

            <div>
                <label className='block mb-1 font-medium text-gray-700'>コメント</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full border rounded-md p-2 focus:ring focus:ring-blue-200'
                    rows={4}
                    required
                />
            </div>

            {err && <p className='text-center text-sm text-red-600'>{err}</p>}
            {message && <p className='text-center text-sm text-green-700'>{message}</p>}

            <button
                type="submit"
                disabled={!allOk}
                className={`w-full py-2 rounded-md text-white font-semibold transition ${
                    allOk
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                {submitting ? '送信中...' : '送信'}
            </button>
        </form>
    );
}


