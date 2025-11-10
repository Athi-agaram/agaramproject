import React, { useEffect, useState, useCallback } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getRevenue } from "../../api/api";

export default function RevenueTab({ user }) {
  const [revenue, setRevenue] = useState([]);

  const loadRevenue = useCallback(() => {
    const teamName = user?.team_name ?? null;
    const scope = teamName ? `?teamName=${teamName}` : "";

    if (user.role === "ADMIN")
      getRevenue("").then((r) => setRevenue(r.data || [])).catch(() => setRevenue([]));
    else
      getRevenue(scope).then((r) => setRevenue(r.data || [])).catch(() => setRevenue([]));
  }, [user]);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  return (
    <Box sx={{ p: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Team ID</TableCell>
            <TableCell>Total Revenue</TableCell>
            <TableCell>Month</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {revenue.map((r) => (
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
  );
}
