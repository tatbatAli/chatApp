import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
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
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/api";
const socket = io("http://localhost:5000");

function Messages() {
  const [messages, setMessages] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const ListMessage = useRef(null);
  const { userId } = useParams();
  const accessT = useSelector((state) => state.userSlice.token);

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("recieved message", (messages) => {
        setMessages(messages);
      });
    });

    return () => {
      // Cleanup socket events on unmount
      socket.off("recieved message");
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const UserData = await api.get(`users/userName/${userId}`);

        if (UserData.data) {
          const username = UserData.data.name;
          setCurrentUsername(username);
          setRecentUsers((prev) => {
            const update = [username, ...prev.filter((u) => u !== username)];

            return update.slice(0, 3);
          });
        } else {
          console.log("User Data err");
        }
      } catch (error) {
        console.log("catch err");
      }
    };

    getUser();
  }, [userId, accessT]);

  const sendingMessage = async () => {
    const date = new Date();
    if (!textMessage || textMessage.trim() === "") {
      alert("field is empty");
    } else {
      const messageObject = {
        user: currentUsername,
        message: textMessage,
        timeOfMessage: date.toLocaleTimeString(),
        dayOfMessage: date.toLocaleDateString(),
      };

      const conversation = [...messages, messageObject];
      setMessages(conversation);
      socket.emit("send message", conversation);
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

  useEffect(() => {
    if (ListMessage.current) {
      ListMessage.current.scrollTop = ListMessage.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const chekingMessages = async () => {
      try {
        const response = await api.get("messages/checkMessages");
        if (response.data.hasMessages) {
          const messages = await api.get("messages");
          const fetchedData = messages.data;
          setMessages(fetchedData);
        }
      } catch (error) {
        console.log("cheking user err");
      }
    };

    chekingMessages();
  }, []);

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={2}>
        <SideBar />
      </Grid>

      <Grid item xs={10}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Stack spacing={2}>
              {recentUsers.map((user, i) => (
                <Card key={i} sx={{ backgroundColor: "lightblue" }}>
                  <CardHeader title={`Chat with ${user}`} />
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "orange", width: 56, height: 56 }}>
                        {user}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          borderRadius: 5,
                          backgroundColor: "white",
                          p: 2,
                          flex: 1,
                          cursor: "pointer",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: "bolder" }}>
                          {user}
                        </Typography>
                        Be the First To Send Message!!
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

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
                    <Avatar sx={{ bgcolor: "orange" }}>
                      {currentUsername.charAt(0)}
                    </Avatar>
                  }
                  label={currentUsername}
                />

                {messages.length > 0 && (
                  <List
                    ref={ListMessage}
                    sx={{
                      backgroundColor: "white",
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                      height: "700px",
                      mt: 2,
                      borderRadius: 1,
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
                              item.user === currentUsername
                                ? "flex-end"
                                : "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#f0f0f0",
                              borderRadius: 2,
                              p: 1,
                              maxWidth: "80%",
                              wordWrap: "break-word",
                            }}
                          >
                            <ListItemText
                              primary={item.message}
                              secondary={
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    fontSize: "0.75rem",
                                    textAlign: "right",
                                  }}
                                >
                                  {item.timeOfMessage}
                                </Typography>
                              }
                              primaryTypographyProps={{
                                sx: {
                                  fontSize: "0.875rem",
                                },
                              }}
                            />
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
                      width: "100%",
                      p: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Input
                      fullWidth
                      placeholder="Enter Your Message"
                      onKeyDown={handlEnter}
                      onChange={(e) => setTextMessage(e.target.value)}
                      value={textMessage}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={sendingMessage}
                      endIcon={<SendIcon />}
                    >
                      Send
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Messages;
