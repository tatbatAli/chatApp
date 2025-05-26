import { useEffect } from "react";

const useAutoScroll = (ListMessage, messages) => {
  useEffect(() => {
    if (ListMessage.current) {
      ListMessage.current.scrollTop = ListMessage.current.scrollHeight;
    }
  }, [messages]);
};

export default useAutoScroll;
