import { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, Typography, Link } from "@mui/material";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useFetchUser from "../../Hooks/fetchUser";
import { addRecentUsers, setOnlineUser } from "../../redux/userSlice";
import socket from "../../Hooks/socket";

function HomePage() {
  const [search, setSearch] = useState("");
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState(null);
  const [users, setUsers] = useState([]);
  const currentUserId = useSelector((state) => state.userSlice.userId);
  const token = useSelector((state) => state.userSlice.token);
  const isAuthenticated = useSelector(
    (state) => state.userSlice.isAuthenticated
  );
  const onlineUsers = useSelector((state) => state.userSlice.onlineUsers);
  const username = useSelector((state) => state.userSlice.username);
  const fetchUser = useFetchUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
    navigate("/RoomPage");
  };

  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substr(2, 8);
    dispatch(setRoomId(newRoomId));
    setGeneratedRoomId(newRoomId);
  };

  const handleBtnSendMessage = (user) => {
    dispatch(addRecentUsers(user));
    navigate(`/MessagePage/${currentUserId}/${user._id}`);
  };

  useEffect(() => {
    const getUser = async () => {
      if (!token || !currentUserId) return;
      try {
        const listOfUsers = await fetchUser();
        if (listOfUsers) setUsers(listOfUsers);
      } catch (error) {
        console.log("err fetching user", error);
      }
    };

    if (username) {
      socket.emit("register", username);
    }

    getUser();
  }, [token, currentUserId]);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f7f9fc" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
        <Box
          sx={{
            backgroundColor: "#e3f2fd",
            color: "black",
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            👋 Welcome to Our Chat App
          </Typography>
          {!isAuthenticated && (
            <Box>
              <Link href="/SignUp" underline="hover" sx={{ mx: 1 }}>
                Sign Up
              </Link>
              <Link href="/LoginPage" underline="hover" sx={{ mx: 1 }}>
                Log In
              </Link>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={12} md={8}>
            {/* Search Box */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <TextField
                label="Search Users"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: "70%" }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2, textTransform: "none" }}
              >
                Search
              </Button>
            </Box>

            {/* Create Room Card */}
            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 3,
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Create a Room
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Start a private conversation by creating a room.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={generateRoomId}
              >
                Generate Room ID
              </Button>
              {generatedRoomId && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#f1f1f1",
                    borderRadius: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Room ID: {generatedRoomId}
                </Box>
              )}
            </Box>

            {/* Join Room Card */}
            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Join a Room
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Enter a Room ID to connect with others.
              </Typography>
              <TextField
                label="Room ID"
                variant="outlined"
                fullWidth
                value={roomId}
                onChange={handleRoomIdChange}
              />
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
              >
                Join Room
              </Button>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Other Users
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Start chatting with someone new.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f9f9f9",
                        p: 2,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#e0f7fa",
                        },
                      }}
                    >
                      <Typography>
                        {user.username}{" "}
                        {onlineUsers.includes(user.username) ? " 🟢 " : " 🔴 "}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleBtnSendMessage(user)}
                      >
                        Message
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No users available.
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
