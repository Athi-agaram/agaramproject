import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, getTeamUsers, deleteUser, updateEmployee } from "../../api/api";

export default function EmployeeTab({ user }) {
  const [users, setUsers] = useState([]);
  
  // Hardcoded team names
  const teamOptions = ["SDMS", "LIMS", "DMS", "ELN"];
  const roleOptions = ["ADMIN", "MANAGER", "EMPLOYEE"];

  // Load users based on role
  const loadUsers = useCallback(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      getAllUsers()
        .then((r) => setUsers(r.data || []))
        .catch(() => setUsers([]));
    } else {
      getTeamUsers(user.team_name)
        .then((r) => setUsers(r.data || []))
        .catch(() => setUsers([]));
    }
  }, [user]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Can current user edit this target user?
  const canEdit = (targetUser) => {
    if (user.role === "ADMIN") return true;
    if (user.role === "MANAGER") return targetUser.team_name === user.team_name;
    return false;
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data || err.message || "Failed to delete user");
    }
  };

  // Update any field: role, teamName, authorized
  const handleUpdateField = async (id, field, value) => {
    try {
      await updateEmployee(id, { [field]: value });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, [field === "teamName" ? "team_name" : field]: value } : u
        )
      );
    } catch (err) {
      alert(err.response?.data || err.message || "Update failed");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Employee Management</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Username</b></TableCell>
            <TableCell><b>Role</b></TableCell>
            <TableCell><b>Team Name</b></TableCell>
            <TableCell><b>Authorized</b></TableCell>
            {(user.role === "ADMIN" || user.role === "MANAGER") && <TableCell><b>Actions</b></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const editable = canEdit(u);
            return (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.username}</TableCell>

                {/* Role */}
                <TableCell>
                  {editable ? (
                    <Select
                      value={u.role || ""}
                      size="small"
                      onChange={(e) => handleUpdateField(u.id, "role", e.target.value)}
                    >
                      {roleOptions.map((role) => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                      ))}
                    </Select>
                  ) : u.role}
                </TableCell>

                {/* Team Name */}
                <TableCell>
                  {editable ? (
                    <Select
                      value={u.team_name || ""}
                      size="small"
                      onChange={(e) => handleUpdateField(u.id, "teamName", e.target.value)}
                    >
                      {teamOptions.map((team) => (
                        <MenuItem key={team} value={team}>{team}</MenuItem>
                      ))}
                    </Select>
                  ) : u.team_name || "-"}
                </TableCell>

                {/* Authorized */}
                <TableCell>
                  {editable ? (
                    <Checkbox
                      checked={!!u.authorized}
                      onChange={(e) => handleUpdateField(u.id, "authorized", e.target.checked)}
                    />
                  ) : (u.authorized ? "Yes" : "No")}
                </TableCell>

                {/* Actions */}
                {(user.role === "ADMIN" || user.role === "MANAGER") && (
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={!editable}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
