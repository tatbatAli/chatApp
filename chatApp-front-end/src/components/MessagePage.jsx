import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import SideBar from "./SideBar";
import Grid from "@mui/material/Grid";
import postingMessages from "../../Hooks/postingMessages";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/api";
import socket from "../../Hooks/socket";
import { markAllAsRead, setRecentUserId } from "../../redux/userSlice";
import useAutoScroll from "../../Hooks/useAutoScroll";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [recepientUsername, setRecipientUsername] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const ListMessage = useRef(null);
  const { recepient } = useParams();
  const accessT = useSelector((state) => state.userSlice.token);
  const currentUser = useSelector((state) => state.userSlice.username);
  const currentUserId = useSelector((state) => state.userSlice.userId);
  const lastUsers = useSelector((state) => state.userSlice.recentUsers);
  const onlineUsers = useSelector((state) => state.userSlice.onlineUsers);
  const recentUserId = useSelector((state) => state.userSlice.recentUserId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId || !recepient) {
      navigate(`/MessagePage/${currentUserId}/${recentUserId}`);
    }
  }, [currentUserId, recepient]);

  useEffect(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  useEffect(() => {
    setIsOnline(() => {
      console.log(onlineUsers);
      const online = onlineUsers.includes(recepientUsername);

      return online;
    });
  }, [onlineUsers, recepientUsername]);

  useEffect(() => {
    socket.on("recieved message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("recieved message");
    };
  }, [currentUser]);

  useEffect(() => {
    const getUser = async () => {
      if (!recepient) {
        return "false";
      }

      dispatch(setRecentUserId(recepient));

      try {
        const UserData = await api.get(
          `messages/${currentUserId}/${recepient}`
        );

        if (UserData.data) {
          const data = [
            {
              username: UserData.data.recepientUsername,
              recepientId: UserData.data.recepientId,
            },
          ];

          setRecipientUsername(data[0].username);
          setRecentUsers(lastUsers);
        } else {
          console.log("user not found");
        }
      } catch (error) {
        console.log("catch err");
      }
    };

    getUser();
  }, [recepient, accessT]);

  const sendingMessage = async () => {
    const date = new Date();
    const hours = ("0" + date.getHours()).slice(-2);
    const mins = ("0" + date.getMinutes()).slice(-2);
    if (!textMessage || textMessage.trim() === "") {
      alert("field is empty");
    } else {
      const messageObject = {
        senderId: currentUserId,
        sender: currentUser,
        recepientId: recepient,
        recepient: recepientUsername,
        message: textMessage,
        timeOfMessage: `${hours}:${mins}`,
        dayOfMessage: date.toLocaleDateString(),
      };

      setMessages((prevMsg) => [...prevMsg, messageObject]);
      socket.emit("send message", {
        message: messageObject,
      });
      socket.emit("sendNotification", {
        notificationMsg: messageObject,
      });
      setTextMessage("");

      try {
        const bodyMessage = await postingMessages(messageObject);
      } catch (error) {
        console.log("err sending message");
      }
    }
  };

  const handlEnter = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendingMessage();
    }
  };

  const handlChatBox = (recnetUserId) => {
    navigate(`/MessagePage/${currentUserId}/${recnetUserId._id}`);
  };

  useAutoScroll(ListMessage, messages);

  useEffect(() => {
    const chekingMessages = async () => {
      if (!recepient) {
        return false;
      }

      try {
        const response = await api.get("messages/checkMessages");
        if (response.data.hasMessages) {
          const messages = await api.get(
            `messages/${currentUserId}/${recepient}`
          );
          const fetchedData = messages.data.message;
          setMessages(fetchedData);
        }
      } catch (error) {
        console.log("cheking user err");
      }
    };

    chekingMessages();
  }, [recepient, currentUserId]);

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={2}>
        <SideBar />
      </Grid>

      <Grid item xs={10}>
        <Grid container spacing={2}>
          {/*recent users */}
          <Grid item xs={5}>
            <Stack spacing={2}>
              {recentUsers.map((user, i) => (
                <Card
                  key={i}
                  onClick={() => {
                    handlChatBox(user);
                  }}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: 3,
                    mb: 2,
                    boxShadow: 4,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardHeader
                    title={
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        Chat with {user.username}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 56,
                          height: 56,
                          fontSize: 20,
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 2,
                          p: 2,
                          flex: 1,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Be the first to send a message!
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
          {/* recent users*/}

          {/* Chat Box */}
          <Grid item xs={6}>
            <Box
              component="main"
              sx={{
                backgroundColor: "lightblue",
                borderRadius: 2,
                height: "100%",
                p: 3,
              }}
            >
              <Stack
                sx={{
                  height: "calc(100vh - 100px)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Chip
                  avatar={
                    <Avatar>{recepientUsername.charAt(0).toUpperCase()}</Avatar>
                  }
                  label={
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {recepientUsername}
                      {isOnline ? " 🟢" : " 🔴 "}
                    </Typography>
                  }
                  sx={{
                    alignSelf: "center",
                    bgcolor: "white",
                    px: 2,
                    py: 1,
                    boxShadow: 1,
                    borderRadius: 2,
                  }}
                />

                {messages.length > 0 && (
                  <List
                    ref={ListMessage}
                    sx={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: 2,
                      p: 2,
                      height: "65vh",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid>
                        <Box
                          sx={{
                            backgroundColor: "#f0f0f0",
                            borderRadius: 2,
                            p: 1,
                            m: 1,
                          }}
                        >
                          {new Date().toLocaleDateString()}
                        </Box>
                      </Grid>
                    </Grid>
                    {messages.map((item, index) => (
                      <Box key={index}>
                        {/* <Grid container spacing={1}>
                          <Grid>
                            <Box
                              sx={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 2,
                                p: 1,
                                m: 1,
                              }}
                            >
                              {item.dayOfMessage}
                            </Box>
                          </Grid>
                        </Grid> */}
                        <ListItem
                          sx={{
                            display: "flex",
                            justifyContent:
                              item.sender === currentUser
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor:
                                item.sender === currentUser
                                  ? "#1976d2"
                                  : "#eeeeee",
                              color:
                                item.sender === currentUser ? "white" : "black",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              maxWidth: "60%",
                              wordBreak: "break-word",
                              boxShadow: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {item.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign: "right",
                                mt: 0.5,
                                opacity: 0.7,
                              }}
                            >
                              {item.timeOfMessage}
                            </Typography>
                          </Box>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                )}

                {/* Message Input */}
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      backgroundColor: "white",
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Input
                      fullWidth
                      placeholder="Type a message..."
                      onKeyDown={handlEnter}
                      onChange={(e) => setTextMessage(e.target.value)}
                      value={textMessage}
                      sx={{ fontSize: "1rem" }}
                    />
                    <Button
                      onClick={sendingMessage}
                      variant="contained"
                      endIcon={<SendIcon />}
                      sx={{ borderRadius: "20px", px: 3 }}
                    >
                      Send
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          {/* chat box*/}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Messages;
