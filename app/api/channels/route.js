import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {

        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ msg: "Unauthorized", status: 401 });

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) return NextResponse.json({ msg: "Server Id Missing", status: 400 });

        const { name, type } = await req.json();

        if (name === "general") {
            return NextResponse.json({ msg: "Channel name canot be general", status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        });

        return NextResponse.json({ message: "Success", server });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "[CHANNELS POST] internal error", status: 500 });
    }
}