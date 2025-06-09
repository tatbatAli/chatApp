import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Stack,
  Switch,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setImageUrl } from "../../redux/userSlice";
import api from "../api/api";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const username = useSelector((state) => state.userSlice.username);
  const email = useSelector((state) => state.userSlice.email);
  const userId = useSelector((state) => state.userSlice.userId);
  const imageUrl = useSelector((state) => state.userSlice.imageUrl);

  const handleToggleTheme = () => setDarkMode((prev) => !prev);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", userId);

    try {
      const response = await api.post("uploadImage/uploadAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("upload response:", response.data);
      const fullImageUrl = api.defaults.baseURL + response.data.image;
      console.log("full image url", fullImageUrl);
      dispatch(setImageUrl(fullImageUrl));
    } catch (error) {
      console.log("upload image err:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ display: "flex", p: 4, gap: 4 }}>
      <Box sx={{ width: "250px" }}>
        <SideBar />
      </Box>

      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Settings
        </Typography>

        {/* === Profile Settings Section === */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h6" fontWeight="bold">
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Update your personal information
          </Typography>

          <Stack spacing={2} alignItems="center" mb={3}>
            {imageUrl ? (
              <Avatar
                src={imageUrl}
                sx={{ width: 64, height: 64 }}
                imgProps={{
                  style: {
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            ) : (
              <Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64 }}>
                {username?.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Typography>{username}</Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImage}
              style={{ display: "none" }}
            />

            <Button variant="outlined" onClick={handleButtonClick}>
              Change Avatar
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h6" fontWeight="bold">
            Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Customize how the app looks
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle1">Dark Mode</Typography>
              <Typography variant="body2" color="text.secondary">
                Toggle between light and dark theme
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Brightness7 />
              <Switch checked={darkMode} onChange={handleToggleTheme} />
              <Brightness4 />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h6" fontWeight="bold">
            Security
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Manage your account security settings
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined">Change Password</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;
