import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, comment } = await req.json();

    // 管理者通知メールと自動返信メールを同時送信
    const [adminResult, autoReplyResult] = await Promise.allSettled([
      // 1. 管理者への通知メール
      resend.emails.send({
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
      }),

      // 2. 問い合わせ者への自動返信メール
      resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: email,
        subject: 'お問い合わせありがとうございます｜ハナタニガーデンワークス',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="border-bottom: 2px solid #059669; padding-bottom: 8px;">
              お問い合わせありがとうございます
            </h2>
            <p>${name}様</p>
            <p>お問い合わせいただきありがとうございます。<br>以下の内容で受け付けました。</p>

            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>【お名前】</strong>${name}様</p>
              <p style="margin: 4px 0;"><strong>【メールアドレス】</strong>${email}</p>
              <p style="margin: 8px 0 4px;"><strong>【メッセージ】</strong></p>
              <p style="margin: 4px 0; white-space: pre-wrap;">${comment}</p>
            </div>

            <p>内容を確認のうえ、2〜3営業日以内にご連絡いたします。</p>

            <p style="margin-top: 32px;">
              ハナタニガーデンワークス<br>
              <a href="https://www.hanatanigardenworks.com" style="color: #059669;">
                https://www.hanatanigardenworks.com
              </a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
              ※ このメールは自動送信されています。このメールへの返信はできません。
            </p>
          </div>
        `,
      }),
    ]);

    // 管理者メール失敗時はエラーを返す
    if (adminResult.status === 'rejected' || adminResult.value.error) {
      console.error('管理者メール送信エラー:', adminResult);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // 自動返信メール失敗はログのみ（ユーザー体験を損なわない）
    if (autoReplyResult.status === 'rejected' || autoReplyResult.value.error) {
      console.error('自動返信メール送信エラー:', autoReplyResult);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact API error:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
