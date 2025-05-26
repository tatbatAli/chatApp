import { useEffect } from "react";
import socket from "../../Hooks/socket";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { addNotification } from "../../redux/userSlice";

function NotificationListener() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on("getNotification", (notifData) => {
      dispatch(addNotification(notifData));
      enqueueSnackbar(
        `🔔 ${notifData.notificationMsg.sender} sent you a message `,
        {
          variant: "info",
          autoHideDuration: 3000,
          style: { cursor: "pointer" },
          onClick: () => {
            navigate(
              `MessagePage/${notifData.notificationMsg.senderId}/${notifData.notificationMsg.recepientId}`
            );
          },
        }
      );
    });

    return () => {
      socket.off("getNotification");
    };
  }, [navigate, enqueueSnackbar, dispatch]);

  return null;
}

export default NotificationListener;
