import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) return NextResponse.json({ message: "Unauthorized", status: 401 });

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name, imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });
        return NextResponse.json({ server, status: 200 });

    } catch (err) {
        console.log("Post Error : ", err);
        return NextResponse.json({ message: "Internal Error", status: 500 });
    }
}

