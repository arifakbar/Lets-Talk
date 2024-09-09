import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { channelId } = await params;
    if (!channelId)
      return NextResponse.json({ msg: "Channel Id Missing", status: 400 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId)
      return NextResponse.json({ msg: "Server Id Missing", status: 400 });

    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ msg: "Unauthorized", status: 401 });

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json({ msg: "Channel deleted sucessfully" });
  } catch (err) {
    console.log("[CHANNEL DELETE ERROR] ", err);
    return NextResponse.json({ msg: "Internal Error", status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { channelId } = await params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const { name, type } = await req.json();

    if (!channelId)
      return NextResponse.json({ msg: "Channel Id Missing", status: 400 });

    if (!serverId)
      return NextResponse.json({ msg: "Server Id Missing", status: 400 });

    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ msg: "Unauthorized", status: 401 });

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: { name, type },
          },
        },
      },
    });

    return NextResponse.json({ msg: "Channel updated sucessfully" });
  } catch (err) {
    console.log("[CHANNEL PATCH ERRRO] ", err);
    return NextResponse.json({ msg: "Internal error", status: 500 });
  }
}
