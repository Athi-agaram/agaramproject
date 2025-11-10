import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { key: "dashboard", icon: <DashboardIcon />, path: "/home" },
    { key: "master", icon: <StorageIcon />, path: "/home/master" },
  ];

  return (
    <Drawer variant="permanent" anchor="left" PaperProps={{ sx: { width: 72, bgcolor: "#0d47a1", color: "white" } }}>
      <List sx={{ mt: 2 }}>
        {items.map((it) => (
          <Tooltip title={it.key[0].toUpperCase() + it.key.slice(1)} placement="right" key={it.key}>
            <ListItemButton
              sx={{
                justifyContent: "center",
                mb: 1,
                backgroundColor: location.pathname.startsWith(it.path) ? "rgba(173, 27, 27, 0.08)" : "transparent",
              }}
              onClick={() => navigate(it.path)}
            >
              <ListItemIcon sx={{ justifyContent: "center", color: "white" }}>{it.icon}</ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}
