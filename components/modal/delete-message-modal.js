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
import qs from "query-string";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";

  const { socketUrl, socketQuery, id } = data;

  const onClick = async () => {
    try {
      setIsDeleting(true);
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.delete(url);
      onClose();
      setIsDeleting(false);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-white dark:text-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure, you want to delete this message? The message will be
            deleted permanently!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex item-center justify-between w-full">
            <Button
              variant="outline"
              className="dark:text-black"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={onClick} disabled={isDeleting}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
