"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const DeleteServerModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "delete";

    const { server } = data;

    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/servers/${server.id}`);
            onClose();
            router.refresh();
            router.push("/");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    return <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className=" bg-white dark:text-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Delete Server
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Are you sure, you want to delete <span className="font-semibold text-indigo-500">{server?.name}</span>?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="bg-gray-100 px-6 py-4">
                <div className="flex item-center justify-between w-full" >
                    <Button variant="outline" className="dark:text-black" onClick={onClose} disabled={loading} >Cancel</Button>
                    <Button variant="primary" onClick={onClick} disabled={loading} >Confirm</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default DeleteServerModal;