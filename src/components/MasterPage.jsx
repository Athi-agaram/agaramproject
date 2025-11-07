import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, getTeamUsers, getProductSales, getRevenue, deleteUser, updateUserAuthorization } from "../api/api";

export default function MasterPage() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadData = () => {
    if (!user) return;

    // If not admin and not authorized, don't load master data
    if (user.role !== "ADMIN" && !user.authorized) {
      setLoading(false);
      return;
    }

    let teamId = user?.team_id ?? null;
    let scope = teamId ? `?teamId=${teamId}` : "";

    // Employees
    if (user.role === "ADMIN") {
      getAllUsers().then(r => setUsers(r.data || [])).catch(() => setUsers([]));
    } else if (user.role === "MANAGER" || user.role === "EMPLOYEE") {
      getTeamUsers(teamId)
        .then(r => {
          if (user.role === "EMPLOYEE") setUsers(r.data.filter(u => u.id === user.id));
          else setUsers(r.data || []);
        })
        .catch(() => setUsers([]));
    }

    // Product Sales
    if (user.role === "ADMIN") getProductSales("").then(r => setSales(r.data || [])).catch(() => setSales([]));
    else getProductSales(scope).then(r => setSales(r.data || [])).catch(() => setSales([]));

    // Revenue
    if (user.role === "ADMIN") getRevenue("").then(r => setRevenue(r.data || [])).catch(() => setRevenue([]));
    else getRevenue(scope).then(r => setRevenue(r.data || [])).catch(() => setRevenue([]));

    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await deleteUser(id);
      loadData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleAuthorizeUser = async (id, authorized) => {
    try {
      await updateUserAuthorization(id, authorized);
      loadData();
    } catch (err) {
      alert("Failed to update authorization");
    }
  };

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
          You have logged in!<br/> Wait until the Administrator provides authorization.
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

        {/* Employees */}
        {tab === 0 && (
          <Box sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Team ID</TableCell>
                  <TableCell>Authorized</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.team_id}</TableCell>
                    <TableCell>
                      {user.role === "ADMIN" && (
                        <Checkbox
                          checked={u.authorized || false}
                          onChange={(e) => handleAuthorizeUser(u.id, e.target.checked)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role === "ADMIN" && (
                        <IconButton size="small" onClick={() => handleDeleteUser(u.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Product Sales */}
        {tab === 1 && (
          <Box sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell><TableCell>Product</TableCell><TableCell>Quantity</TableCell><TableCell>Price</TableCell><TableCell>Team</TableCell><TableCell>Employee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.product_name}</TableCell>
                    <TableCell>{s.quantity}</TableCell>
                    <TableCell>{s.price_per_unit}</TableCell>
                    <TableCell>{s.team_id}</TableCell>
                    <TableCell>{s.employee_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Revenue */}
        {tab === 2 && (
          <Box sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell><TableCell>Team ID</TableCell><TableCell>Total Revenue</TableCell><TableCell>Month</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenue.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.team_id}</TableCell>
                    <TableCell>{r.total_revenue}</TableCell>
                    <TableCell>{r.month}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
