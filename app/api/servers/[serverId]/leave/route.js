import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    try {
        const { serverId } = params;

        const profile = await currentProfile();
        if (!profile) return NextResponse.json({ msg: "Unauthorized", status: 401 });

        if (!serverId) return NextResponse.json({ msg: "Server Id missing", status: 400 });

        await db.server.update({
            where: {
                id: serverId,
                profileId: { //Not Admin
                    not: profile.id
                },
                members: { //Actually a part of the server (i.e., member of the server)
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

        return NextResponse.json({ msg: "Success" });
    } catch (err) {
        console.log("[LEAVE SERVER PATCH]", err);
        return NextResponse.json({ msg: "Internal error", status: 500 });
    }
}