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

  // ✅ Login handler
const handleLogin = async (e) => {
  e?.preventDefault();
  if (!username || !password) return alert("Please fill in all fields");

  try {
    const res = await loginUser({ username, password });
    const user = res.data;

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/home");
  } catch (err) {
    const msg = err?.response?.data || err.message || "Login failed";
    const msgStr = typeof msg === "string" ? msg : JSON.stringify(msg);

    if (msgStr.includes("User not found")) {
      // show registration form only if user truly doesn't exist
      setRegisterOpen(true);
    } else {
      alert(msgStr);
    }
  }
};


  // ✅ Registration handler
  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!username || !newPassword || !confirm) return alert("Please fill in all fields");
    if (newPassword !== confirm) return alert("Passwords do not match");

    try {
      const res = await registerUser({ username, password: newPassword });
      if (res.data.includes("successfully")) {
        alert("Registration successful! You can now log in.");
        setRegisterOpen(false);
        setPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        alert(res.data || "Registration failed");
      }
    } catch (err) {
      const msg = err?.response?.data || err.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ width: 420, p: 4, borderRadius: 3, textAlign: "center" }} elevation={6}>
        {!registerOpen ? (
          <>
            <Typography variant="h5" gutterBottom>Welcome Back</Typography>
            <Box component="form" onSubmit={handleLogin}>
              <TextField fullWidth label="Username" margin="normal" value={username} onChange={e=>setUsername(e.target.value)} required />
              <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e=>setPassword(e.target.value)} required />
              <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">Login</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>Create New Account</Typography>
            <Box component="form" onSubmit={handleRegister}>
              <TextField fullWidth label="Username" value={username} disabled margin="normal" />
              <TextField fullWidth label="New Password" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required margin="normal" />
              <TextField fullWidth label="Confirm Password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required margin="normal" />
              <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Button fullWidth variant="contained" type="submit">Register</Button>
                <Button fullWidth variant="outlined" onClick={()=>setRegisterOpen(false)}>Cancel</Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
