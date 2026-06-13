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

    // Fast return if it's not a standard message update
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

    if (String(userId) === String(ADMIN_ID) && reply) {
        // Native forwards guarantee forward_from is visible to the bot
        const targetUserId = reply.forward_from?.id;

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
            // Fallback warning if you replied to something that wasn't natively forwarded
            await tg("sendMessage", {
                chat_id: ADMIN_ID,
                text: "❌ Cannot reply. Make sure you are replying directly to the user's natively forwarded bubble.",
            });
        }

        return NextResponse.json({ ok: true });
    }

    /* ---------------- USER → ADMIN FORWARD ---------------- */
    
    // Stop the bot from forwarding admin logs back to the admin during regular chats
    if (String(userId) === String(ADMIN_ID)) {
        return NextResponse.json({ ok: true });
    }

    // 1. Send native forward to Admin
    const forwardRes = await tg("forwardMessage", {
        chat_id: ADMIN_ID,
        from_chat_id: chatId,
        message_id: message.message_id,
    });

    // 2. Thread the professional context box directly under it using secure HTML parsing
    if (forwardRes && forwardRes.ok) {
        const forwardedMessageId = forwardRes.result.message_id;
        const userName = message.from.first_name || "Unknown";
        
        const header = `☝️ <b>Above Message Detail</b>\n` +
                       `👤 <b>Sender:</b> ${userName}\n` +
                       `🆔 <b>User ID:</b> <code>${userId}</code>`;

        await tg("sendMessage", {
            chat_id: ADMIN_ID,
            text: header,
            reply_to_message_id: forwardedMessageId, 
            parse_mode: "HTML"
        });

        await tg("sendMessage", {
            chat_id: chatId, // Sends it back to the user's chat
            text: "✅ Your message has been received! An admin will review it and contact you soon.",
        });
    }

    return NextResponse.json({ ok: true });
}