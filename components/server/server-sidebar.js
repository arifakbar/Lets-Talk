import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./server-header";

import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4" />,
};

const ServerSidebar = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: { include: { profile: true }, orderBy: { role: "asc" } },
    },
  });

  if (!server) return redirect("/");

  //Seprating channels by their type
  const textChannels = server?.channels.filter(
    (c) => c.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (c) => c.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (c) => c.type === ChannelType.VIDEO
  );

  const members = server?.members.filter((m) => m.profileId !== profile.id); //Filtering out current user

  const role = server?.members.find((m) => m.profileId === profile.id)?.role; //Find user role in the channel

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((m) => ({
                  id: m.id,
                  name: m.profile.name,
                  icon: roleIconMap[m.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              role={role}
              sectionType="channels"
              channelType={ChannelType.TEXT}
              server={server}
            />
            {textChannels.map((c) => {
              return (
                <ServerChannel
                  channel={c}
                  server={server}
                  role={role}
                  key={c.id}
                />
              );
            })}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Audio Channels"
              role={role}
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              server={server}
            />
            {audioChannels.map((c) => {
              return (
                <ServerChannel
                  channel={c}
                  server={server}
                  role={role}
                  key={c.id}
                />
              );
            })}
            {!!videoChannels?.length && (
              <div className="mb-2">
                <ServerSection
                  label="Video Channels"
                  role={role}
                  sectionType="channels"
                  channelType={ChannelType.VIDEO}
                  server={server}
                />
                {videoChannels.map((c) => {
                  return (
                    <ServerChannel
                      channel={c}
                      server={server}
                      role={role}
                      key={c.id}
                    />
                  );
                })}
              </div>
            )}
            {!!members?.length && (
              <div className="mb-2">
                <ServerSection
                  label="Members"
                  role={role}
                  sectionType="members"
                  server={server}
                />
                {members.map((m) => {
                  return <ServerMember member={m} server={server} key={m.id} />;
                })}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
