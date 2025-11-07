import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirm) return alert("All fields are required");
    if (password !== confirm) return alert("Passwords do not match");

    try {
      const res = await registerUser({ username, password });

      if (res.data.includes("successfully")) {
        alert("Registration successful! Please login.");
        navigate("/"); // go to login page
      } else {
        alert(res.data || "Registration failed");
      }
    } catch (err) {
      alert(err?.response?.data || "Registration failed due to server error");
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
        <Typography variant="h5" gutterBottom>
          New User Registration
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate>
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
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
