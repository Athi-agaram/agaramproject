// import React, { useEffect, useState, useCallback } from "react";
// import { Box, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
// import { getProducts } from "../../api/api";

// export default function RevenueDashboard({ user }) {
//   const [revenueData, setRevenueData] = useState([]);

//   const loadRevenue = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;

//     getProducts(teamName)
//       .then((res) => {
//         const products = Array.isArray(res.data) ? res.data : [];

//         // Group by team + month
//         const revenueMap = {}; // { team: { month: {...} } }

//         products.forEach((p) => {
//           const team = p.team_name || "Unknown";

//           const rawDate = p.sale_date || p.created_at || new Date();
//           const date = new Date(rawDate);

//           // Format month-year, fallback to "Unknown" if invalid
//           const monthYear = !isNaN(date.getTime())
//             ? date.toLocaleString("default", { month: "short", year: "numeric" })
//             : "Unknown";

//           const revenue = Number(p.price) * Number(p.quantity);

//           if (!revenueMap[team]) revenueMap[team] = {};
//           if (!revenueMap[team][monthYear]) {
//             revenueMap[team][monthYear] = { totalRevenue: 0, numSales: 0 };
//           }

//           revenueMap[team][monthYear].totalRevenue += revenue;
//           revenueMap[team][monthYear].numSales += 1;
//         });

//         // Flatten into array
//         const finalData = [];
//         Object.keys(revenueMap).forEach((team) => {
//           const months = Object.keys(revenueMap[team]).sort((a, b) => {
//             const dateA = new Date(a);
//             const dateB = new Date(b);
//             return dateA - dateB;
//           });
//           // const months=["Jan","Feb","Mar","Apr"];

//           months.forEach((month, idx) => {
//             const entry = revenueMap[team][month];
//             const avgRevenue = entry.numSales ? entry.totalRevenue / entry.numSales : 0;

//             // Growth vs previous month
//             let growth = 0;
//             if (idx > 0) {
//               const prevRevenue = revenueMap[team][months[idx - 1]].totalRevenue;
//               growth = prevRevenue ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
//             }

//             finalData.push({
//               id: finalData.length + 1,
//               team,
//               month,
//               totalRevenue: entry.totalRevenue,
//               numSales: entry.numSales,
//               avgRevenue,
//               growth,
//             });
//           });
//         });

//         setRevenueData(finalData);
//       })
//       .catch(() => setRevenueData([]));
//   }, [user]);

//   useEffect(() => {
//     loadRevenue();
//   }, [loadRevenue]);

//   return (
//     <Box sx={{ p: 2 }}>


//       <Table size="medium" sx={{ border: "1px solid #ffffffff" }}>
//         <TableHead sx={{ backgroundColor: "#ffffffff" }}>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Team Name</TableCell>
//             <TableCell>Month</TableCell>
//             <TableCell>Total Revenue</TableCell>
//             <TableCell>Number of Sales</TableCell>
//             <TableCell>Avg Revenue/Sale</TableCell>
//             <TableCell>Growth vs Prev Month</TableCell>
//             <TableCell>YTD Revenue</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {revenueData.length > 0 ? (
//             revenueData.map((r) => (
//               <TableRow key={r.id}>
//                 <TableCell>{r.id}</TableCell>
//                 <TableCell>{r.team}</TableCell>
//                 <TableCell>{r.month}</TableCell>
//                 <TableCell>₹{r.totalRevenue.toLocaleString()}</TableCell>
//                 <TableCell>{r.numSales}</TableCell>
//                 <TableCell>₹{r.avgRevenue.toFixed(2)}</TableCell>
//                 <TableCell>{r.growth.toFixed(2)}%</TableCell>
//                 <TableCell>
//                   ₹{revenueData
//                     .filter((d) => d.team === r.team && new Date(d.month) <= new Date(r.month))
//                     .reduce((sum, d) => sum + d.totalRevenue, 0)
//                     .toLocaleString()}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={8} align="center">
//                 No revenue data available
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </Box>
//   );
// }



import React, { useEffect, useState, useCallback } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getProducts } from "../../api/api";

export default function RevenueDashboard({ user }) {
  const [revenueData, setRevenueData] = useState([]);

  const Monthss = ["Nov", "Dec", "Jan", "Feb"];

  const loadRevenue = useCallback(() => {
    const teamName = user?.role === "ADMIN" ? "" : user.team_name;

    getProducts(teamName)
      .then((res) => {
        const products = Array.isArray(res.data) ? res.data : [];

        const revenueMap = {}; 

        products.forEach((p) => {
          const team = p.team_name || "Unknown";
          const rawDate = p.sale_date || p.created_at || new Date();
          const date = new Date(rawDate);

          const monthYear = !isNaN(date.getTime())
            ? date.toLocaleString("default", { month: "short", year: "numeric" })
            : "Unknown";

          const revenue = Number(p.price) * Number(p.quantity);

          if (!revenueMap[team]) revenueMap[team] = {};
          if (!revenueMap[team][monthYear]) {
            revenueMap[team][monthYear] = { totalRevenue: 0, numSales: 0 };
          }

          revenueMap[team][monthYear].totalRevenue += revenue;
          revenueMap[team][monthYear].numSales += 1;
        });

        // Flatten into array
        const finalData = [];
        Object.keys(revenueMap).forEach((team) => {
          const months = Object.keys(revenueMap[team]).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
          });

          months.forEach((month, idx) => {
            const entry = revenueMap[team][month];
            const avgRevenue = entry.numSales ? entry.totalRevenue / entry.numSales : 0;

            // Growth vs previous month
            let growth = 0;
            if (idx > 0) {
              const prevRevenue = revenueMap[team][months[idx - 1]].totalRevenue;
              growth = prevRevenue ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
            }

            finalData.push({
              id: finalData.length + 1,
              team,
              month, 
              displayMonth: Monthss[finalData.length % Monthss.length], 
              totalRevenue: entry.totalRevenue,
              numSales: entry.numSales,
              avgRevenue,
              growth,
            });
          });
        });

        setRevenueData(finalData);
      })
      .catch(() => setRevenueData([]));
  }, [user]);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  return (
    <Box sx={{ p: 2 }}>
      <Table size="medium" sx={{ border: "1px solid #ffffffff" }}>
        <TableHead sx={{ backgroundColor: "#ffffffff" }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Team Name</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Total Revenue</TableCell>
            <TableCell>Number of Sales</TableCell>
            <TableCell>Avg Revenue/Sale</TableCell>
            <TableCell>Growth vs Prev Month</TableCell>
            <TableCell>YTD Revenue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {revenueData.length > 0 ? (
            revenueData.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.team}</TableCell>
                <TableCell>{r.displayMonth}</TableCell>
                <TableCell>₹{r.totalRevenue.toLocaleString()}</TableCell>
                <TableCell>{r.numSales}</TableCell>
                <TableCell>₹{r.avgRevenue.toFixed(2)}</TableCell>
                <TableCell>{r.growth.toFixed(2)}%</TableCell>
                <TableCell>
                  ₹{revenueData
                    .filter((d) => d.team === r.team && d.id <= r.id) 
                    .reduce((sum, d) => sum + d.totalRevenue, 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No revenue data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
