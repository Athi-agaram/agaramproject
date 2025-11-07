import React from "react";
import { Box } from "@mui/material";
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/sidebar";
import MasterPage from "../components/MasterPage";
import { Routes, Route, Navigate } from "react-router-dom";

export default function HomePage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, ml: "72px", bgcolor: "#f6f8fb" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/master" element={<MasterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
