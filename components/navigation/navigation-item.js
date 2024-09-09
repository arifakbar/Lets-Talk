"use client";

import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ui/action-tooltip";
import Image from "next/image";

export default function NavigationItem({ id, imageUrl, name }) {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={`absolute left-0 bg-emerald-500 rounded-r-full transition-all w-[4px] 
                            ${
                              params?.serverId !== id && "group-hover:h-[20px] "
                            }
                            ${params?.serverId === id ? "h-[36px]" : "h-[8px]"}
            `}
        />
        <div
          className={`relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden ${
            params?.serverId === id &&
            " bg-primary/10 text-primary rounded-[16px]"
          }`}
        >
          <Image src={imageUrl} fill alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
}
