import * as React from "react";
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Divider,
} from "@mui/material";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Icons
import PermIdentitySharpIcon from "@mui/icons-material/PermIdentitySharp";
import KeySharpIcon from "@mui/icons-material/KeySharp";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import QuestionMarkSharpIcon from "@mui/icons-material/QuestionMarkSharp";
import RocketLaunchSharpIcon from "@mui/icons-material/RocketLaunchSharp";
import InfoOutlineSharpIcon from "@mui/icons-material/InfoOutlineSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";

const topBarHeight = 40;
const drawerWidthCollapsed = 60;

export default function TopBar({
  username = "Administrator",
  userGroup = "Administrator",
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 🧹 Logout handler
  const handleLogout = () => {
    // Remove all cookies
    Object.keys(Cookies.get()).forEach((cookieName) =>
      Cookies.remove(cookieName)
    );
    // Close menu
    handleClose();
    // Navigate to login
    navigate("/LoginPage");
  };

  const menuItems = [
    { label: "Edit Profile", icon: <PermIdentitySharpIcon fontSize="small" /> },
    { label: "Change Password", icon: <KeySharpIcon fontSize="small" /> },
    { label: "Screen Lock", icon: <LockSharpIcon fontSize="small" /> },
    { label: "Help", icon: <QuestionMarkSharpIcon fontSize="small" /> },
    { label: "Api Docs", icon: <RocketLaunchSharpIcon fontSize="small" /> },
    { label: "About", icon: <InfoOutlineSharpIcon fontSize="small" /> },
    {
      label: "Logout",
      icon: <LogoutSharpIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: `${topBarHeight}px`,
        backgroundColor: "white",
        zIndex: 1300,
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", minHeight: `${topBarHeight}px`, px: 5 }}
      >
        {/* Left: Logo + Version */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src="http://localhost:9094/LogilabSDMS/images/SDMS_Logo.png"
            alt="logo"
            sx={{ height: 30, marginBottom: 1, ml: `${drawerWidthCollapsed + 10}px` }}
          />
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#555", ml: 1 }}>
            v7.2_20250520_01
          </Typography>
        </Box>

        {/* Right: Timezone / Domain / Site + User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 550, color: "#52526bff" }}>
                Time Zone:
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#000" }}>
                Asia/Kolkata (UTC+05:30)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 550, color: "#555" }}>
                Domain:
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#000" }}>
                SDMS
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 550, color: "#555" }}>
                Site:
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#000" }}>
                Mumbai
              </Typography>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2b2a2a" }}>
                {userGroup}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#6d6a6aff" }}>
                {username}
              </Typography>
            </Box>
            <IconButton onClick={handleClick} sx={{ color: "#c2c2c2ff", p: 0.5 }}>
              <ExpandCircleDownOutlinedIcon />
            </IconButton>

            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="bottom-end"
              style={{ zIndex: 1401, minWidth: 200 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Paper>
                  <MenuList>
                    {menuItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <MenuItem
                          onClick={item.onClick || handleClose}
                          sx={{
                            fontSize: 10,
                            color: "#5e5c5cff",
                            py: 0.1,
                            px: 2,
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Box sx={{ ml: 2, color: "#1565c0" }}>{item.icon}</Box>
                        </MenuItem>
                        {index < menuItems.length - 1 && <Divider sx={{ my: 0 }} />}
                      </React.Fragment>
                    ))}
                  </MenuList>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        </Box>
      </Toolbar>
    </Box>
  );
}

export { topBarHeight };
