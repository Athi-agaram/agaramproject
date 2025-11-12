// import React from "react";
// import { Box } from "@mui/material";
// import Dashboard from "../components/DashboardPage/Dashboard";
// import Sidebar from "../components/sidebar";
// import MasterPage from "../components/MasterPage/MasterPage";
// import { Routes, Route, Navigate } from "react-router-dom";

// export default function HomePage() {
//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />
//       <Box component="main" sx={{ flex: 1, ml: "72px", bgcolor: "#f6f8fb" }}>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/master" element={<MasterPage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// }


// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import Dashboard from "../components/DashboardPage/Dashboard";
// import Sidebar from "../components/sidebar";
// import MasterPage from "../components/MasterPage/MasterPage";

// export default function HomePage() {
//   // ✅ Default: Dashboard (null means no master tab selected)
//   const [masterTab, setMasterTab] = useState(null);

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar setMasterTab={setMasterTab} />
//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//           ml: "72px",
//           bgcolor: "#f6f8fb",
//           p: 2,
//         }}
//       >
//         {masterTab ? <MasterPage selectedTab={masterTab} /> : <Dashboard />}
//       </Box>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/sidebar";
import MasterPage from "../components/MasterPage/MasterPage";
import Dashboard from "../components/DashboardPage/Dashboard";
import TopBar, { topBarHeight, drawerWidthCollapsed } from "../components/topbar";

export default function HomePage() {
  const [masterTab, setMasterTab] = useState(null); // ✅ null = show dashboard by default
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setMasterTab={setMasterTab} />
      <Box
        sx={{
          flex: 1,
          ml: `${drawerWidthCollapsed}px`,
          mt: `${topBarHeight}px`,
          bgcolor: "#f6f8fb",
          p: 2,
        }}
      >
        <TopBar user={user} />

        {/* ✅ Show Dashboard by default */}
        {masterTab ? <MasterPage selectedTab={masterTab} /> : <Dashboard />}
      </Box>
    </Box>
  );
}
