"use client";

import { useState, useEffect } from "react";

import CreateServerModal from "./modal/create-server-modal";
import InviteModal from "./modal/invite-modal";
import EditServerModal from "./modal/edit-server-modal";
import MembersManageModal from "./modal/members-manage-modal";
import CreateChannelModal from "./modal/create-channel-modal";
import LeaveServerModal from "./modal/leave-server-modal";
import DeleteServerModal from "./modal/delete-server-modal";
import DeleteChannelModal from "./modal/delete-channel-modal";
import EditChannelModal from "./modal/edit-channel-modal";
import MessageFileModal from "./modal/message-file-modal";
import DeleteMessageModal from "./modal/delete-message-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersManageModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
