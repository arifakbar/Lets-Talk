import { v4 as uuidv4 } from 'uuid';

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, params) {
    try {
        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ msg: "Unauthorized", status: 401 });
        if (!params.params.serverId) return NextResponse.json({ msg: "Server Id is Missing", status: 400 });

        const server = await db.server.update({
            where: {
                id: params.params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4()
            }
        });

        return NextResponse.json({ server })

    } catch (err) {
        console.log("[SERVER_ID]: ", err);
        return NextResponse.json({ msg: "Internal error", status: 500 })
    }
}

