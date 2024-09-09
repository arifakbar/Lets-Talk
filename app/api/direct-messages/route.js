import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10; //Load messages 10 by 10

export async function GET(req) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile)
      return NextResponse.json({ msg: "Unauthorized", status: 401 });
    if (!conversationId)
      return NextResponse.json({ msg: "Conversation ID Missing", status: 400 });

    let messages = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH)
      nextCursor = messages[MESSAGES_BATCH - 1].id;

    return NextResponse.json({ items: messages, nextCursor });
  } catch (err) {
    console.log("[DIRECT MESSAGE GET ERROR] ", err);
    return NextResponse.json({ msg: "Internal Error", status: 500 });
  }
}
