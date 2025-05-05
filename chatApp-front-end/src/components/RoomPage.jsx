import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import socket from "../../Hooks/socket";
import { useSelector } from "react-redux";

const RoomPage = () => {
  const [message, setMessage] = useState("");
  const roomId = useSelector((state) => state.userSlice.roomId);
  useEffect(() => {
    socket.on("join-room", ({ roomId, roomName }) => {});
  });

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
                <Card
                  key={i}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: 3,
                    mb: 2,
                    boxShadow: 4,
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
                          cursor: "pointer",
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RoomPage;
