import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import useLogout from "../../Hooks/useLogout";
import socket from "../../Hooks/socket";
import { useSelector } from "react-redux";

export default function Logout() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.userSlice.username);

  const handleLogout = async () => {
    console.log("Logging out...");

    socket.emit("logout", currentUser);
    socket.disconnect();

    try {
      const logingOut = await useLogout();
      console.log(logingOut.msg);
      navigate("/SignUp");
    } catch (error) {
      console.log("something went wrong. Try again");
    }
  };

  const handleCancel = () => {
    navigate("/HomePage");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          width: "320px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "lightblue",
            marginBottom: "16px",
          }}
        >
          ⨉
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: "8px" }}>
          Log out of your account?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          You can always log back in at any time.
        </Typography>
        <Button
          sx={{
            width: "100%",
            padding: "12px",
            backgroundColor: "lightblue",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px",
            ":hover": {
              backgroundColor: "#8EC1E8", // Lighten on hover
            },
          }}
          onClick={handleLogout}
        >
          Log out
        </Button>
        <Button
          sx={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            border: "1px solid lightblue",
            borderRadius: "8px",
            fontWeight: "bold",
            color: "lightblue",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#F0F8FF", // Lighten on hover
            },
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
