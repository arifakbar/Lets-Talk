import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const InviteCode = async ({params}) => {
        
        const profile = await currentProfile();
        
        if(!profile) return redirectToSignIn();
        if(!params.inviteCode) return redirect("/");       
        
        const existingMemberOfServer = await db.server.findFirst({
                where:{
                        inviteCode : params.inviteCode,
                        members : {
                                some:{
                                        profileId : profile.id
                                }
                        }
                }
        });

        if(existingMemberOfServer) return redirect(`/servers/${existingMemberOfServer.id}`); //If already a member of server no need to add just redirect there.

        const addMemberToServer = await db.server.update({
                where:{
                        inviteCode : params.inviteCode
                },
                data:{
                        members:{
                                create:{
                                        profileId : profile.id
                                }
                        }
                }
        });        
        
        if(addMemberToServer) return redirect(`/servers/${addMemberToServer.id}`);
 
        return null;
}

export default InviteCode;