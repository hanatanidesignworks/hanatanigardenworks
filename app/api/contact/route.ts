import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, comment } = await req.json();

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.RESEND_TO!,
      subject: `【お問い合わせ】${name}様よりメッセージが届きました`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #059669; padding-bottom: 8px;">
            お問い合わせが届きました
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <th style="text-align: left; padding: 10px; background: #f3f4f6; width: 30%; border: 1px solid #e5e7eb;">
                お名前
              </th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">
                ${name}
              </td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; background: #f3f4f6; border: 1px solid #e5e7eb;">
                メールアドレス
              </th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; background: #f3f4f6; border: 1px solid #e5e7eb; vertical-align: top;">
                メッセージ
              </th>
              <td style="padding: 10px; border: 1px solid #e5e7eb; white-space: pre-wrap;">
                ${comment}
              </td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            ※ このメールはハナタニガーデンワークスのお問い合わせフォームから自動送信されています。
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact API error:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
