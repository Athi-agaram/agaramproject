// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Paper,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as ReTooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Legend,
// } from "recharts";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import PeopleIcon from "@mui/icons-material/People";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import StarIcon from "@mui/icons-material/Star";
// import { getAllUsers, getProducts, getRevenue } from "../../api/api";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4081"];

// export default function DashboardPage() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const [employeeCount, setEmployeeCount] = useState(0);
//   const [productCount, setProductCount] = useState(0);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [revenueData, setRevenueData] = useState([]);
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [topTeam, setTopTeam] = useState("-");
//   const [topProduct, setTopProduct] = useState("-");

//   const loadEmployees = useCallback(() => {
//     if (!user) return;
//     const fetch = user.role === "ADMIN" ? getAllUsers : () => Promise.resolve({ data: [] });
//     fetch()
//       .then(res => setEmployeeCount((res.data || []).length))
//       .catch(() => setEmployeeCount(0));
//   }, [user]);

//   const loadProducts = useCallback(() => {
//     if (!user) return;
//     const teamName = user.role === "ADMIN" ? "" : user.team_name;
//     getProducts(teamName)
//       .then(res => {
//         const products = res.data || [];
//         setProductCount(products.length);
//         const totalQty = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
//         setTotalQuantity(totalQty);

//         const sortedProducts = [...products].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
//         setTopProduct(sortedProducts[0]?.name || "-");
//       })
//       .catch(() => {
//         setProductCount(0);
//         setTotalQuantity(0);
//         setTopProduct("-");
//       });
//   }, [user]);

//   const loadRevenue = useCallback(() => {
//     if (!user) return;
//     const teamName = user.role === "ADMIN" ? "" : user.team_name;
//     getRevenue(teamName)
//       .then(res => {
//         const rev = res.data || [];
//         setRevenueData(rev);

//         const sortedTeams = [...rev].sort((a, b) => b.total_revenue - a.total_revenue);
//         setTopTeam(sortedTeams[0]?.team_name || "-");

//         const monthMap = {};
//         rev.forEach(item => {
//           const month = "Nov"; // placeholder if you don’t store sale dates
//           monthMap[month] = (monthMap[month] || 0) + (item.total_revenue || 0);
//         });
//         setMonthlyRevenue(Object.keys(monthMap).map(m => ({ month: m, revenue: monthMap[m] })));
//       })
//       .catch(() => {
//         setRevenueData([]);
//         setMonthlyRevenue([]);
//         setTopTeam("-");
//       });
//   }, [user]);

//   useEffect(() => {
//     loadEmployees();
//     loadProducts();
//     loadRevenue();
//   }, [loadEmployees, loadProducts, loadRevenue]);

//   if (!user) return <Typography variant="h6">Not logged in</Typography>;

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Summary Cards */}
//       <Grid container spacing={2} mb={3}>
//         {[
//           { label: "Employees", value: employeeCount, icon: <PeopleIcon />, color: "#0088FE" },
//           { label: "Products", value: productCount, icon: <InventoryIcon />, color: "#00C49F" },
//           { label: "Revenue", value: `₹${revenueData.reduce((s, r) => s + r.total_revenue, 0).toLocaleString("en-IN")}`, icon: <MonetizationOnIcon />, color: "#FFBB28" },
//           { label: "Top Team", value: topTeam, icon: <BarChartIcon />, color: "#AF19FF" },
//           { label: "Top Product", value: topProduct, icon: <StarIcon />, color: "#FF4081" },
//           { label: "Total Quantity", value: totalQuantity, icon: <InventoryIcon />, color: "#00BFA6" },
//         ].map((c, i) => (
//           <Grid item xs={12} sm={6} md={4} key={i}>
//             <Card sx={{ bgcolor: c.color, color: "#fff" }}>
//               <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 {c.icon}
//                 <Box>
//                   <Typography variant="h6">{c.label}</Typography>
//                   <Typography variant="h4">{c.value}</Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Charts */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" mb={2}>
//               Revenue by Team
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={revenueData}
//                   dataKey="total_revenue"
//                   nameKey="team_name"
//                   outerRadius={120}
//                   label
//                 >
//                   {revenueData.map((_, idx) => (
//                     <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <ReTooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" mb={2}>
//               Monthly Revenue Trend
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={monthlyRevenue}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Divider,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as ReTooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
//   BarChart,
//   Bar,
// } from "recharts";
// import { getProducts, getAllUsers } from "../../api/api";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

// export default function Dashboard() {
//   const [summary, setSummary] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     totalEmployees: 0,
//     totalTeams: 0,
//   });
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [progressData, setProgressData] = useState([]);
//   const [roleData, setRoleData] = useState([]);

//   const loadDashboard = useCallback(async () => {
//     try {
//       const [productRes, userRes] = await Promise.all([
//         getProducts(""),
//         getAllUsers(),
//       ]);

//       const products = productRes.data || [];
//       const users = userRes.data || [];

//       // --- Summary Cards ---
//       const totalRevenue = products.reduce(
//         (sum, p) => sum + p.price * p.quantity,
//         0
//       );
//       const totalSales = products.length;
//       const totalEmployees = users.length;
//       const totalTeams = new Set(users.map((u) => u.team_name)).size;

//       setSummary({
//         totalRevenue,
//         totalSales,
//         totalEmployees,
//         totalTeams,
//       });

//       // --- Monthly Revenue (Line Chart) ---
//       const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ];
//       const monthlyMap = {};
//       products.forEach((p) => {
//         const m = p.sale_month || "Unknown";
//         const rev = Number(p.price) * Number(p.quantity);
//         monthlyMap[m] = (monthlyMap[m] || 0) + rev;
//       });
//       const monthlyData = months.map((m) => ({
//         month: m,
//         revenue: monthlyMap[m] || 0,
//       }));
//       setMonthlyRevenue(monthlyData);

//       // --- Progress Pie Chart ---
//       const progressMap = {};
//       products.forEach((p) => {
//         const key = p.progress || "Unknown";
//         progressMap[key] = (progressMap[key] || 0) + 1;
//       });
//       const progressArr = Object.keys(progressMap).map((key) => ({
//         name: key,
//         value: progressMap[key],
//       }));
//       setProgressData(progressArr);

//       // --- Employee Role Chart ---
//       const roleMap = {};
//       users.forEach((u) => {
//         const role = u.role || "Unknown";
//         roleMap[role] = (roleMap[role] || 0) + 1;
//       });
//       const roleArr = Object.keys(roleMap).map((role) => ({
//         role,
//         count: roleMap[role],
//       }));
//       setRoleData(roleArr);
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//     }
//   }, []);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   return (
//     <Box sx={{ p: 3, backgroundColor: "#f9fafc", minHeight: "100vh" }}>


//       {/* --- Summary Cards --- */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderLeft: "5px solid #1976d2", width: "250px" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Revenue
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 ₹{summary.totalRevenue.toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderLeft: "5px solid #2e7d32", width: "150px" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Sales
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalSales}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderLeft: "5px solid #ed6c02", width: "150px" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Employees
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalEmployees}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ borderLeft: "5px solid #6a1b9a" ,width: "150px"}}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Teams
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalTeams}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* --- Charts Section --- */}
//       <Grid container spacing={4}>
//         {/* Line Chart: Revenue Trend */}
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 2, height: 300,width: "400px" }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Monthly Revenue Trend
//             </Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <LineChart data={monthlyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#1976d2"
//                   strokeWidth={3}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Pie Chart: Product Progress */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 2, height: 300, width: "300px",ml:2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Product Progress Status
//             </Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <PieChart>
//                 <Pie
//                   data={progressData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label
//                 >
//                   {progressData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <ReTooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Bar Chart: Employee Roles */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 2,ml:4,width: "100%" ,height: 300}}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Employee Role Distribution
//             </Typography>
//             <ResponsiveContainer width="100%" height={270} ml={0}>
//               <BarChart data={roleData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="role" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#82ca9d" barSize={50} />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>
//       </Grid>


//     </Box>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as ReTooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
//   BarChart,
//   Bar,
// } from "recharts";
// import { getProducts, getAllUsers } from "../../api/api";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

// export default function Dashboard() {
//   const [summary, setSummary] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     totalEmployees: 0,
//     totalTeams: 0,
//     topTeam: "N/A",
//   });
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [progressData, setProgressData] = useState([]);
//   const [roleData, setRoleData] = useState([]);

//   const loadDashboard = useCallback(async () => {
//     try {
//       const [productRes, userRes] = await Promise.all([
//         getProducts(""),
//         getAllUsers(),
//       ]);

//       const products = productRes.data || [];
//       const users = userRes.data || [];

//       // --- Summary Cards ---
//       const totalRevenue = products.reduce(
//         (sum, p) => sum + p.price * p.quantity,
//         0
//       );
//       const totalSales = products.length;
//       const totalEmployees = users.length;
//       const totalTeams = new Set(users.map((u) => u.team_name)).size;

//       // --- Find top performing team ---
//       const teamRevenueMap = {};
//       products.forEach((p) => {
//         const team = p.team_name || "Unknown";
//         const rev = Number(p.price) * Number(p.quantity);
//         teamRevenueMap[team] = (teamRevenueMap[team] || 0) + rev;
//       });

//       const topTeam =
//         Object.keys(teamRevenueMap).length > 0
//           ? Object.entries(teamRevenueMap).sort((a, b) => b[1] - a[1])[0][0]
//           : "N/A";

//       setSummary({
//         totalRevenue,
//         totalSales,
//         totalEmployees,
//         totalTeams,
//         topTeam,
//       });

//       // --- Monthly Revenue (Line Chart) ---
//       const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ];
//       const monthlyMap = {};
//       products.forEach((p) => {
//         const m = p.sale_month || "Unknown";
//         const rev = Number(p.price) * Number(p.quantity);
//         monthlyMap[m] = (monthlyMap[m] || 0) + rev;
//       });
//       const monthlyData = months.map((m) => ({
//         month: m,
//         revenue: monthlyMap[m] || 0,
//       }));
//       setMonthlyRevenue(monthlyData);

//       // --- Progress Pie Chart ---
//       const progressMap = {};
//       products.forEach((p) => {
//         const key = p.progress || "Unknown";
//         progressMap[key] = (progressMap[key] || 0) + 1;
//       });
//       const progressArr = Object.keys(progressMap).map((key) => ({
//         name: key,
//         value: progressMap[key],
//       }));
//       setProgressData(progressArr);

//       // --- Employee Role Chart ---
//       const roleMap = {};
//       users.forEach((u) => {
//         const role = u.role || "Unknown";
//         roleMap[role] = (roleMap[role] || 0) + 1;
//       });
//       const roleArr = Object.keys(roleMap).map((role) => ({
//         role,
//         count: roleMap[role],
//       }));
//       setRoleData(roleArr);
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//     }
//   }, []);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   return (
//     <Box sx={{ p: 5, backgroundColor: "#f9fafc", minHeight: "100vh" }}>
//       {/* --- Seamless Summary Cards Row --- */}
//       <Grid
//         container
//         spacing={1}
//         sx={{
//           mb: 4,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "stretch",
//         }}
//       >
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #1976d2", height: "100%",width: "190px",ml:"2px" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Revenue
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 ₹{summary.totalRevenue.toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #c62828", height: "100%",width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Top Performing Team
//               </Typography>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 {summary.topTeam}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//                 <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #0288d1", height: "100%",width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Avg Revenue / Sale
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 ₹
//                 {summary.totalSales
//                   ? (summary.totalRevenue / summary.totalSales).toFixed(2)
//                   : 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//                 <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #ed6c02", height: "100%",ml:2,width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Employees
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalEmployees}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>


//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #2e7d32", height: "100%",width:"190",ml:"-7" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Total Sales
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalSales}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>


//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #6a1b9a", height: "100%",width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Teams
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                 {summary.totalTeams}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>




//       </Grid>

//       {/* --- Charts Section --- */}
//       <Grid container spacing={4}>
//         {/* Line Chart: Revenue Trend */}
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 2, height: 300,width: "400px" }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Monthly Revenue Trend
//             </Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <LineChart data={monthlyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#1976d2"
//                   strokeWidth={3}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Pie Chart: Product Progress */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 2, height: 300, width: "300px",ml:2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Product Progress Status
//             </Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <PieChart>
//                 <Pie
//                   data={progressData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label
//                 >
//                   {progressData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <ReTooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Bar Chart: Employee Roles */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 2,ml:3,width: "100%" ,height: 300}}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               Employee Role Distribution
//             </Typography>
//             <ResponsiveContainer width="100%" height={270} ml={0}>
//               <BarChart data={roleData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="role" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#82ca9d" barSize={50} />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
















import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { getProducts, getAllUsers } from "../../api/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // --- Hooks ---
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalEmployees: 0,
    totalTeams: 0,
    topTeam: "N/A",
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  // --- Dashboard loader ---
  const loadDashboard = useCallback(async () => {
    try {
      const [productRes, userRes] = await Promise.all([
        getProducts(""),
        getAllUsers(),
      ]);

      const products = productRes.data || [];
      const users = userRes.data || [];

      // --- Summary Cards ---
      const totalRevenue = products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
      const totalSales = products.length;
      const totalEmployees = users.length;
      const totalTeams = new Set(users.map((u) => u.team_name)).size;

      // --- Top Team ---
      const teamRevenueMap = {};
      products.forEach((p) => {
        const team = p.team_name || "Unknown";
        const rev = Number(p.price) * Number(p.quantity);
        teamRevenueMap[team] = (teamRevenueMap[team] || 0) + rev;
      });
      const topTeam =
        Object.keys(teamRevenueMap).length > 0
          ? Object.entries(teamRevenueMap).sort((a, b) => b[1] - a[1])[0][0]
          : "N/A";

      setSummary({
        totalRevenue,
        totalSales,
        totalEmployees,
        totalTeams,
        topTeam,
      });

      // --- Monthly Revenue ---
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const monthlyMap = {};
      products.forEach((p) => {
        const m = p.sale_month || "Unknown";
        monthlyMap[m] = (monthlyMap[m] || 0) + Number(p.price) * Number(p.quantity);
      });
      const monthlyData = months.map((m) => ({
        month: m,
        revenue: monthlyMap[m] || 0,
      }));
      setMonthlyRevenue(monthlyData);

      // --- Progress Pie ---
      const progressMap = {};
      products.forEach((p) => {
        const key = p.progress || "Unknown";
        progressMap[key] = (progressMap[key] || 0) + 1;
      });
      const progressArr = Object.keys(progressMap).map((key) => ({
        name: key,
        value: progressMap[key],
      }));
      setProgressData(progressArr);

      // --- Employee Roles ---
      const roleMap = {};
      users.forEach((u) => {
        const role = u.role || "Unknown";
        roleMap[role] = (roleMap[role] || 0) + 1;
      });
      const roleArr = Object.keys(roleMap).map((role) => ({
        role,
        count: roleMap[role],
      }));
      setRoleData(roleArr);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }, []); // <-- no user dependency

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // --- Conditional rendering ---
  if (!user) {
    return (
      <Box sx={{ p: 3 ,height:"100px"}}>
        <Typography variant="h6">Not logged in</Typography>
      </Box>
    );
  }

  if (user.role !== "ADMIN" && !user.authorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" align="center" mt={25}>
          You have logged in!<br />
          Wait until the Administrator provides authorization.
        </Typography>
      </Box>
    );
  }

  // --- Dashboard JSX ---
  return (
    <Box sx={{ p: 5, backgroundColor: "#f9fafc", maxHeight: "70px"}}>
      {/* Summary Cards */}
      <Grid container spacing={1} sx={{ mb:3, display: "flex", justifyContent:"space-evenly", alignItems: "stretch",ml:-3 }}>
        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #1976d2", height: "100%", width: "190px", ml:"2px" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>₹{summary.totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Top Team */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #c62828", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Top Performing Team</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{summary.topTeam}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Avg Revenue / Sale */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #0288d1", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Avg Revenue / Sale</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                ₹{summary.totalSales ? (summary.totalRevenue / summary.totalSales).toFixed(2) : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Employees */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #ed6c02", height: "100%", ml:2, width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Employees</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Sales */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #2e7d32", height: "100%", width:"190", ml:"-7" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Sales</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalSales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Teams */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #6a1b9a", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Teams</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalTeams}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Line Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: 300, width: "400px" }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Monthly Revenue Trend</b></Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: 300, width: "300px", ml:2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Product Progress Status</b></Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={progressData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, ml:3, width: "100%", height: 300 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Employee Role Distribution</b></Typography>
            <ResponsiveContainer width="100%" height={270} ml={0}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
