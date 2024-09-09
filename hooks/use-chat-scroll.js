import { useEffect, useState } from "react";

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  count,
  loadMore,
}) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    //Load Prev. Messages
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) loadMore();
    };
    topDiv?.addEventListener("scroll", handleScroll);
    return () => topDiv?.removeEventListener("scroll", handleScroll);
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    //When we get new message
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      if (!topDiv) return false;
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
