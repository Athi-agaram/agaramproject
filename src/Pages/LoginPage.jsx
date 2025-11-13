import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser, checkUsernameExists } from "../api/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Prefill username if returning after registration
  useEffect(() => {
    const savedUsername = localStorage.getItem("recentlyRegisteredUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      localStorage.removeItem("recentlyRegisteredUsername"); // clear it after use
    }
  }, []);

  // ✅ Check username existence (debounced)
  useEffect(() => {
    if (!username.trim()) {
      setUsernameExists(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await checkUsernameExists(username.trim());
        setUsernameExists(res.data);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [username]);

  // ✅ Handle login
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await loginUser({ username, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/home");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect if username not found when focusing password box
  const handlePasswordFocus = () => {
    if (usernameExists === false) {
      navigate("/register", { state: { username } });
    }
  };

  // ✅ Handle Enter key to login
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #193b85ff 0%, #bfbfdaff 100%)",
        padding: 4,
      }}
    >
      {/* Left Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 8,
          ml: 15,
        }}
      >
        <Box
          component="img"
          src="https://scontent.fmaa3-2.fna.fbcdn.net/v/t39.30808-6/482029405_9293251904057799_4287303386032315694_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HQoY1MdNwHgQ7kNvwGy3XG-&_nc_oc=AdmMk_EKAw-EULB6gcDwm27RMExc7OBQDOvxkxqOeDpvuSwUVzHMP-GKdv4C--0ckpQ&_nc_zt=23&_nc_ht=scontent.fmaa3-2.fna&_nc_gid=2iiZ7abYdGzwuvvgRaNHFg&oh=00_AfhftGLUjtdtOYA_mNSocLAptTBdLNqReemwcO1jSaLdNg&oe=691B4FEA"
          alt="Login Visual"
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        />
      </Box>

      {/* Right Login Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              padding: 5,
              width: 300,
              height: 495,
              mb: 8,
              mr: 25,
              borderRadius: 2,
              textAlign: "center",
              alignContent: "center",
              backdropFilter: "blur(15px)",
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
              color: "white",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              sx={{ color: "#1d1561ff" }}
            >
              Login
            </Typography>

            {/* ✅ Username */}
            <TextField
              fullWidth
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              sx={{
                bgcolor: "rgba(255, 255, 255, 1)",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "grey" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "grey" },
                },
                "& .MuiInputLabel-root": { color: "grey" },
                "& .MuiInputLabel-root.Mui-focused": { color: "black" },
              }}
            />
            {usernameExists && (
              <Typography variant="body2" color="success.main" align="left">
                Username exists
              </Typography>
            )}
            {usernameExists === false && (
              <Typography variant="body2" color="error" align="left">
                Username not found*
              </Typography>
            )}

            {/* ✅ Password */}
            <TextField
              fullWidth
              placeholder="Password"
              type="password"
              value={password}
              onFocus={handlePasswordFocus}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              margin="normal"
              sx={{
                bgcolor: "rgba(255, 255, 255, 1)",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "grey" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "grey" },
                },
                "& .MuiInputLabel-root": { color: "grey" },
                "& .MuiInputLabel-root.Mui-focused": { color: "black" },
              }}
            />

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}

            {/* ✅ Login Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading || !usernameExists}
              sx={{
                mt: 3,
                borderRadius: 2,
                backgroundColor: "#1f3155ff",
                "&:hover": { backgroundColor: "#0042cc" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}
