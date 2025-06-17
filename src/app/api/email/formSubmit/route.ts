import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const formData = await req.json();

  const { name, grade, phone, email, moveInDate, roomType, visitTime, referrer } = formData;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "長青宿舍-預約看房通知",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #333;">感謝您的預約！</h2>
              <p style="color: #333;">請務必於預約時間準時抵達。</p>
              <p style="color: #333;">如有任何疑問，歡迎與我們聯繫：<strong>(02) 2903-0610</strong></p>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />

              <p style="color: #333;"><strong>姓名：</strong> ${name}</p>
              <p style="color: #333;"><strong>學校系級：</strong> ${grade}</p>
              <p style="color: #333;"><strong>聯絡電話：</strong> ${phone}</p>
              <p style="color: #333;"><strong>聯絡信箱：</strong> ${email}</p>
              <p style="color: #333;"><strong>期望入住日期：</strong> ${moveInDate}</p>
              <p style="color: #333;"><strong>期望房型：</strong> ${roomType}</p>
              <p style="color: #333;"><strong>預約看房時間：</strong> ${visitTime}</p>
              ${referrer ? `<p style="color: #333;"><strong>推薦人：</strong> ${referrer}</p>` : ""}

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />

              <p style="font-size: 0.9em; color: #777;">此信件為系統自動寄出，請勿直接回覆。</p>
            </div>`,
    });

    return new Response(JSON.stringify({ message: "信件已發送" }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "發送信件時發生錯誤" }), { status: 500 });
  }
}