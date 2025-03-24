import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
let username;

const drawerWidth = 240;

const arrayIcon = [
  <Avatar>H</Avatar>,
  <HomeIcon />,
  <Badge badgeContent={0} color="primary">
    <MailIcon />
  </Badge>,
  <NotificationsIcon />,
  <SettingsIcon />,
];

const items = [
  { text: "", path: "/" },
  { text: "Home", path: "/HomePage" },
  { text: "Messages", path: "/MessagePage" },
  { text: "Notification", path: "/notifications" },
  { text: "Settings", path: "/settings" },
];

function SideBar() {
  const drawer = (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              color: "inherit",
              textDecoration: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>{arrayIcon[index % arrayIcon.length]}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem
        component={Link}
        to="/logout"
        sx={{
          color: "inherit",
          textDecoration: "none",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Log Out" />
      </ListItem>
    </div>
  );

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Box
            component="nav"
            sx={{
              width: { sm: drawerWidth },
              flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders"
          >
            <Drawer
              variant="permanent"
              sx={{
                "& .MuiDrawer-paper": {
                  backgroundColor: "lightblue",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SideBar;
