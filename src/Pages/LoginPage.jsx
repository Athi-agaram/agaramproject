import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();

    try {
      const res = await loginUser({ username, password });
      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      // Open registration panel if login fails (user not found or invalid password)
      setRegisterOpen(true);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({ username, password: newPassword });

      if (res.data.includes("successfully")) {
        alert("Registration successful! Please login.");
        setRegisterOpen(false);
        setPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        alert(res.data || "Registration failed");
      }
    } catch (err) {
      alert(err?.response?.data || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #e1bee7 100%)",
        p: 2,
      }}
    >
      <Paper sx={{ width: 420, p: 4, borderRadius: 3 }} elevation={6}>
        {!registerOpen ? (
          <>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                Login
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Register New User
            </Typography>
            <Box component="form" onSubmit={handleRegister} noValidate>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                value={username}
                disabled
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button fullWidth variant="contained" type="submit">
                  Register
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setRegisterOpen(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
