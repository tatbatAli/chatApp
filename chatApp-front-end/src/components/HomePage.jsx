import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import fetchUser from "../../Hooks/fetchUser";
import { useSelector } from "react-redux";

function HomePage() {
  const [search, setSearch] = useState("");
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.userSlice.username);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleRoomIdChange = (e) => setRoomId(e.target.value);

  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substr(2, 8);
    setGeneratedRoomId(newRoomId);
  };

  const handleBtnSendMessage = (id) => {
    navigate(`/MessagePage/${id}`);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser();
        const filteredData = data.filter(
          (user) => user.username !== currentUser
        );

        if (data) {
          setUsers(filteredData);
        } else {
          console.log("data is null or undefined", filteredData);
        }
      } catch (error) {
        console.log("err fetching user", error);
      }
    };

    getUser();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            backgroundColor: "lightblue",
            color: "black",
            textAlign: "center",
            p: 2,
            mb: 3,
            borderRadius: 1,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Welcome to Our Chat App
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <TextField
                label="Search Users"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: "300px" }}
              />
              <Button variant="contained" color="primary" sx={{ ml: 2 }}>
                Search
              </Button>
            </Box>

            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 2,
                mb: 3,
                textAlign: "left",
              }}
            >
              <Typography variant="h6" fontWeight="medium" mb={2}>
                Create a Room
              </Typography>
              <Typography color="gray" mb={2}>
                Create a room to chat with your best friends and enjoy your
                time.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={generateRoomId}
              >
                Create Room
              </Button>
              {generatedRoomId && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#eee",
                    borderRadius: 1,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    Room ID: <strong>{generatedRoomId}</strong>
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "left",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="medium" mb={2}>
                Join a Room
              </Typography>
              <Typography color="gray" mb={2}>
                Enter a room ID to join an existing conversation.
              </Typography>
              <TextField
                label="Enter Room ID"
                variant="outlined"
                fullWidth
                value={roomId}
                onChange={handleRoomIdChange}
              />
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 1 }}
              >
                Join Room
              </Button>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "left",
              }}
            >
              <Typography variant="h6" fontWeight="medium" mb={2}>
                Other Users
              </Typography>
              <Typography color="gray" mb={2}>
                Send a message to other users.
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#eee",
                  p: 2,
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {users.map((user) => (
                  <Box
                    key={user._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography>{user.username}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        handleBtnSendMessage(user._id);
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
