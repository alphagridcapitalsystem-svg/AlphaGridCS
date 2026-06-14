export const runtime = "nodejs";

import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_ID = process.env.ADMIN_ID!;

/* ---------------- helpers ---------------- */

async function tg(method: string, data: any) {
    try {
        const res = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        return await res.json();
    } catch (err) {
        console.error("Telegram API error:", err);
    }
}

/* ---------------- main handler ---------------- */

export async function POST(req: Request) {
    const update = await req.json();

    const message = update.message;
    const reply = message?.reply_to_message;

    if (!message) {
        return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;

    /* ---------------- /start ---------------- */

    if (text === "/start") {
        if (String(userId) === String(ADMIN_ID)) {
            await tg("sendMessage", {
                chat_id: chatId,
                text: "👋 Welcome, you are the ADMIN.",
            });
        } else {
             await tg("sendMessage", {
                chat_id: chatId,
                text: "👋 Welcome to AlphaGrid Capital System Support Bot!\n\nHere are the services of this bot:\n\n1. For Deposit verification you have to send the screenshot, your name and referral code from your profile.\n2. If you have any questions, feel free to ask the admins of AlphaGrid Capital System.",
            });
        }

        return NextResponse.json({ ok: true });
    }

    /* ---------------- ADMIN REPLY FLOW ---------------- */

    /* ---------------- ADMIN REPLY FLOW ---------------- */

    if (String(userId) === String(ADMIN_ID) && reply) {
        let targetUserId: string | null = null;

        // 1. Try native forward extraction first
        if (reply.forward_from?.id) {
            targetUserId = String(reply.forward_from.id);
        } 
        // 2. Fallback: Ultra-robust match for the digits inside the text block
        else if (reply.text) {
            // This looks specifically for "User ID:" followed by spaces and captures all numbers
            const match = reply.text.match(/User ID:\s*(\d+)/i);
            if (match && match[1]) {
                targetUserId = match[1];
            }
        }

        if (targetUserId) {
            if (text) {
                await tg("sendMessage", {
                    chat_id: targetUserId,
                    text,
                });
            }

            if (message.photo) {
                const fileId = message.photo[message.photo.length - 1].file_id;
                await tg("sendPhoto", {
                    chat_id: targetUserId,
                    photo: fileId,
                    caption: message.caption || "",
                });
            }

            if (message.document) {
                const fileId = message.document.file_id;
                await tg("sendDocument", {
                    chat_id: targetUserId,
                    document: fileId,
                    caption: message.caption || "",
                });
            }

            if (message.voice) {
                await tg("sendVoice", {
                    chat_id: targetUserId,
                    voice: message.voice.file_id,
                });
            }
        } else {
            await tg("sendMessage", {
                chat_id: ADMIN_ID,
                text: "❌ Cannot extract User ID. Ensure you reply directly to the 'Above Message Detail' data block text.",
            });
        }

        return NextResponse.json({ ok: true });
    }

    /* ---------------- USER → ADMIN FORWARD ---------------- */
    
    if (String(userId) === String(ADMIN_ID)) {
        return NextResponse.json({ ok: true });
    }

    // 1. Send native forward to Admin
    const forwardRes = await tg("forwardMessage", {
        chat_id: ADMIN_ID,
        from_chat_id: chatId,
        message_id: message.message_id,
    });

    // 2. Thread the log detail block
    if (forwardRes && forwardRes.ok) {
        const forwardedMessageId = forwardRes.result.message_id;
        const userName = message.from.first_name || "Unknown";
        
        // Formatted cleanly without standard HTML wrappers inside the code tag to keep matching strict
        const header = `☝️ <b>Above Message Detail</b>\n` +
                       `👤 <b>Sender:</b> ${userName}\n` +
                       `🆔 <b>User ID:</b> ${userId}`;

        await tg("sendMessage", {
            chat_id: ADMIN_ID,
            text: header,
            reply_to_message_id: forwardedMessageId, 
            parse_mode: "HTML"
        });

        await tg("sendMessage", {
            chat_id: chatId, 
            text: "✅ Your message has been received! An admin will review it and contact you soon.",
        });
    }

    return NextResponse.json({ ok: true });
}
