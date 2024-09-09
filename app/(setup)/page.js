import { InitialProfile } from "@/lib/initial-profile"
import { db } from "@/lib/db";

import { redirect } from 'next/navigation';
import InitialModal from "@/components/modal/initial-modal";

export default async function SetupPage() {
  const profile = await InitialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}
