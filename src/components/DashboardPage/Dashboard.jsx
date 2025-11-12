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


import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import { getAllUsers, getProducts, getRevenue } from "../../api/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4081"];
const TEST_MONTHS = ["Nov", "Dec", "Jan", "Feb"]; // Custom months

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [employeeCount, setEmployeeCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topTeam, setTopTeam] = useState("-");
  const [topProduct, setTopProduct] = useState("-");

  // Load Employees
  const loadEmployees = useCallback(() => {
    if (!user) return;
    const fetch = user.role === "ADMIN" ? getAllUsers : () => Promise.resolve({ data: [] });
    fetch()
      .then(res => setEmployeeCount((res.data || []).length))
      .catch(() => setEmployeeCount(0));
  }, [user]);

  // Load Products
  const loadProducts = useCallback(() => {
    if (!user) return;
    const teamName = user.role === "ADMIN" ? "" : user.team_name;
    getProducts(teamName)
      .then(res => {
        const products = res.data || [];
        setProductCount(products.length);
        const totalQty = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
        setTotalQuantity(totalQty);

        const sortedProducts = [...products].sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
        setTopProduct(sortedProducts[0]?.name || "-");
      })
      .catch(() => {
        setProductCount(0);
        setTotalQuantity(0);
        setTopProduct("-");
      });
  }, [user]);

  // Load Revenue
  const loadRevenue = useCallback(() => {
    if (!user) return;
    const teamName = user.role === "ADMIN" ? "" : user.team_name;
    getRevenue(teamName)
      .then(res => {
        const rev = res.data || [];

        // Normalize keys for Pie chart
        const normalizedRev = rev.map(r => ({
          team_name: r.team_name || "Unknown",
          total_revenue: r.total_revenue || r.totalRevenue || 0,
        }));

        setRevenueData(normalizedRev);

        // Top Team
        const sortedTeams = [...normalizedRev].sort((a, b) => b.total_revenue - a.total_revenue);
        setTopTeam(sortedTeams[0]?.team_name || "-");

        // Generate monthlyRevenue for the 4 custom months
        const monthMap = {};
        TEST_MONTHS.forEach(m => (monthMap[m] = 0)); // initialize all months

        normalizedRev.forEach((item, idx) => {
          const month = TEST_MONTHS[idx % TEST_MONTHS.length];
          monthMap[month] += item.total_revenue;
        });

        setMonthlyRevenue(TEST_MONTHS.map(m => ({ month: m, revenue: monthMap[m] })));
      })
      .catch(() => {
        setRevenueData([]);
        setMonthlyRevenue([]);
        setTopTeam("-");
      });
  }, [user]);

  useEffect(() => {
    loadEmployees();
    loadProducts();
    loadRevenue();
  }, [loadEmployees, loadProducts, loadRevenue]);

  if (!user) return <Typography variant="h6">Not logged in</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        {[
          { label: "Employees", value: employeeCount, icon: <PeopleIcon fontSize="large" />, color: "#0088FE" },
          { label: "Products", value: productCount, icon: <InventoryIcon fontSize="large" />, color: "#00C49F" },
          { label: "Revenue", value: `₹${revenueData.reduce((s, r) => s + r.total_revenue, 0).toLocaleString("en-IN")}`, icon: <MonetizationOnIcon fontSize="large" />, color: "#FFBB28" },
          { label: "Top Team", value: topTeam, icon: <BarChartIcon fontSize="large" />, color: "#AF19FF" },
          { label: "Top Product", value: topProduct, icon: <StarIcon fontSize="large" />, color: "#FF4081" },
          { label: "Total Quantity", value: totalQuantity, icon: <InventoryIcon fontSize="large" />, color: "#00BFA6" },
        ].map((c, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ bgcolor: c.color, color: "#fff", minHeight: 130 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                {c.icon}
                <Box>
                  <Typography variant="h6">{c.label}</Typography>
                  <Typography variant="h4">{c.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: 350 }}>
            <Typography variant="h6" mb={2}>
              Revenue by Team
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="total_revenue"
                  nameKey="team_name"
                  outerRadius={120}
                  label
                >
                  {revenueData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: 350 }}>
            <Typography variant="h6" mb={2}>
              Monthly Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
