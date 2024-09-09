"use client";

import qs from 'query-string'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import UseAvatar from "../user-avatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

const MembersManageModal = () => {
    const [loadingId, setLoadingId] = useState("");

    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "membersManage";

    const { server } = data;
    const router = useRouter();

    const onDelete = async (memberId) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });
            const res = await axios.delete(url);
            router.refresh();
            onOpen("membersManage", { server: res.data.server });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId, role) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({ //To pass multiple params
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });
            const res = await axios.patch(url, { role });
            router.refresh();
            onOpen("membersManage", { server: res.data.server });
        } catch (err) {
            setLoadingId("");
            console.log(err);
        } finally {
            setLoadingId("");
        }
    }

    return <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="dark:text-white bg-white text-black overflow-hidden">
            <DialogHeader className="p-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Manage Members
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    {server?.members?.length} Members
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[420px] pr-6">
                {server?.members?.map(m => {
                    return <div key={m.id} className="flex items-center gap-x-2 mb-6">
                        <UseAvatar src={m.profile.imageUrl} />
                        <div className="flex flex-col gap-y-1">
                            <div className="text-xs font-semibold flex items-center gap-x-1">
                                {m.profile.name}
                                {roleIconMap[m.role]}
                            </div>
                            <p className="text-xs text-zinc-500">
                                {m.profile.email}
                            </p>
                        </div>
                        {server.profileId !== m.profile.id && loadingId !== m.id && (
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left">
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="flex items-center dark:hover:bg-zinc-500">
                                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                                <span>Role</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem className="dark:hover:bg-zinc-500"  onClick={() => onRoleChange(m.id, "GUEST")}>
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        Guest
                                                        {m.role === "GUEST" && (
                                                            <Check className="h-4 w-4 ml-auto" />
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="dark:hover:bg-zinc-500" onClick={() => onRoleChange(m.id, "MODERATOR")}>
                                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                                        MODERATOR
                                                        {m.role === "MODERATOR" && (
                                                            <Check className="h-4 w-4 mx-2" />
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onDelete(m.id)} className="dark:hover:bg-zinc-500" >
                                            <Gavel className="h-4 w-4 mr-2" />
                                            Kick
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        {loadingId === m.id && (
                            <Loader2 className="h-4 w-4 ml-auto animate-spin text-zinc-500" />
                        )}
                    </div>
                })}
            </ScrollArea>
        </DialogContent>
    </Dialog>
}

export default MembersManageModal;