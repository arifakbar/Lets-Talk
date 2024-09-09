"use client";

import { MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UseAvatar from "../user-avatar";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export default function ({ member, server }) {
  const params = useParams();
  const router = useRouter();

  const Icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={`group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 ${
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      }`}
    >
      <UseAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={`font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition ${
          (params.memberId === member.id) &
          "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        }`}
      >
        {member.profile.name}
      </p>
    </button>
  );
}
