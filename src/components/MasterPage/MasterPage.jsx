import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
import EmployeeTab from "./EmployeeTab";
import ProductSalesTab from "./ProductTab";
import RevenueTab from "./RevenueTab";

export default function MasterPage() {
  const [tab, setTab] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Not logged in</Typography>
      </Box>
    );
  }

  if (user.role !== "ADMIN" && !user.authorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" align="center" mt={25}>
          You have logged in!<br /> Wait until the Administrator provides authorization.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Master Page</Typography>
      <Paper sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Employees" />
          <Tab label="Product Sales" />
          <Tab label="Revenue" />
        </Tabs>

        {tab === 0 && <EmployeeTab user={user} />}
        {tab === 1 && <ProductSalesTab user={user} />}
        {tab === 2 && <RevenueTab user={user} />}
      </Paper>
    </Box>
  );
}
