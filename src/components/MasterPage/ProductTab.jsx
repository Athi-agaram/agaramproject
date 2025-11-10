import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  getProductSales,
  getTeamUsers,
  getAllUsers,
  addProduct,
  updateEmployee,
  deleteUser,
} from "../../api/api";

export default function ProductTab({ user }) {
  const [sales, setSales] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    price_per_unit: "",
    team_id: "",
    employee_id: "",
  });
  const [employees, setEmployees] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadSales = useCallback(() => {
    const teamName = user?.team_name ?? null;
    const scope = teamName ? `?teamName=${teamName}` : "";

    if (user.role === "ADMIN")
      getProductSales("")
        .then((r) => setSales(r.data || []))
        .catch(() => setSales([]));
    else
      getProductSales(scope)
        .then((r) => setSales(r.data || []))
        .catch(() => setSales([]));
  }, [user]);

  const loadEmployees = useCallback(() => {
    if (user.role === "ADMIN")
      getAllUsers().then((r) => setEmployees(r.data || []));
    else
      getTeamUsers(user.team_name).then((r) => setEmployees(r.data || []));
  }, [user]);

  useEffect(() => {
    loadSales();
    loadEmployees();
  }, [loadSales, loadEmployees]);

  const handleOpen = (row = null) => {
    if (row) {
      setForm({ ...row });
      setIsEdit(true);
      setEditId(row.id);
    } else {
      setForm({
        product_name: "",
        quantity: "",
        price_per_unit: "",
        team_id: user?.team_name || "",
        employee_id: "",
      });
      setIsEdit(false);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await addProduct({ ...form, id: editId, update: true });
      } else {
        await addProduct(form);
      }
      loadSales();
      handleClose();
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await addProduct({ id, delete: true });
      loadSales();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {(user.role === "ADMIN" || user.role === "MANAGER") && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Product
        </Button>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Employee</TableCell>
            {(user.role === "ADMIN" || user.role === "MANAGER") && (
              <TableCell>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.product_name}</TableCell>
              <TableCell>{s.quantity}</TableCell>
              <TableCell>{s.price_per_unit}</TableCell>
              <TableCell>{s.team_id}</TableCell>
              <TableCell>{s.employee_id}</TableCell>
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <TableCell>
                  <IconButton onClick={() => handleOpen(s)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(s.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Product Name"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
          />
          <TextField
            label="Price per unit"
            name="price_per_unit"
            type="number"
            value={form.price_per_unit}
            onChange={handleChange}
          />
          <TextField
            label="Team"
            name="team_id"
            value={form.team_id}
            onChange={handleChange}
          />
          <Select
            label="Employee"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">Select Employee</MenuItem>
            {employees
              .filter((e) =>
                user.role === "ADMIN"
                  ? true
                  : e.team_name === user.team_name
              )
              .map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.username}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
