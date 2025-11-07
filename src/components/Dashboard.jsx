import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getProductSales, getRevenue, getAllUsers, getTeamUsers } from "../api/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [totals, setTotals] = useState({ users: 0, revenue: 0 });
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    // scope based on role
    const teamScope = user?.team_id ? `?teamId=${user.team_id}` : "";
    getProductSales(teamScope).then((r) => setSales(r.data || [])).catch(()=>setSales([]));
    getRevenue(teamScope).then((r) => setRevenue(r.data || [])).catch(()=>setRevenue([]));

    const usersFetch = user?.role === "ADMIN" ? getAllUsers() : getTeamUsers(user?.team_id);
    usersFetch.then(r => setTotals(t => ({ ...t, users: (r.data || []).length }))).catch(()=>{});
    // aggregate revenue sum:
    getRevenue(teamScope).then(r => {
      const sum = (r.data || []).reduce((s, item) => s + (Number(item.total_revenue) || 0), 0);
      setTotals(t => ({ ...t, revenue: sum }));
    }).catch(()=>{});
  }, []);

  // format data for pie (sales by product)
  const pieData = sales.map(s => ({ name: s.product_name, value: Number(s.quantity) }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Role</Typography>
            <Typography variant="h6">{user?.role}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Users Visible</Typography>
            <Typography variant="h6">{totals.users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Revenue</Typography>
            <Typography variant="h6">₹ {totals.revenue}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ height: 300 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1">Product Distribution</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                  {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ height: 300 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1">Revenue by Month</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={revenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
