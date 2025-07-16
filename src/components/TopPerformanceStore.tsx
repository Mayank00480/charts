import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

// Simplified Types
export interface StoreData {
  store: string;
  data: {
    name: string;
    data: number[];
  }[];
  total: number;
}

export interface TopStoresChartProps {
  data: StoreData[];
  colors: string[]; // Array of colors for segments
  title?: string;
  subtitle?: string;
  useAgeGroupMapping?: boolean; // Toggle for age group aggregation
}

// Custom Tooltip Component
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#FFFFFF",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15), 2px 2px 4px rgba(0, 0, 0, 0.15), -2px 2px 4px rgba(0, 0, 0, 0.15)",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 4,
    padding: "8px",
    borderTop: "10px solid #EAEAEA",
  },
}));

// Tooltip Content Component
const TooltipContent: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color,
        mr: 1,
      }}
    />
    <Box>
      <Typography component="span" sx={{ fontWeight: 400 }}>
        {label}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {" : "}{value.toLocaleString()}
      </Typography>
    </Box>
  </Box>
);

// Horizontal Bar Chart Component
const HorizontalBarChart: React.FC<{
  data: number[];
  colors: string[];
  labels: string[];
}> = ({ data, colors, labels }) => {
  const total = data.reduce((acc, curr) => acc + curr, 0);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: 10,
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      {data.map((value, index) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        const color = colors[index] || "#ccc";
        const label = labels[index] || `Segment ${index + 1}`;

        return (
          <CustomTooltip key={index} title={<TooltipContent label={label} value={value} color={color} />}>
            <Box
              sx={{
                width: `${percentage}%`,
                backgroundColor: color,
                height: "100%",
                minWidth: percentage > 0 ? "2px" : 0,
              }}
            />
          </CustomTooltip>
        );
      })}
    </Box>
  );
};

// Main Component
const TopStoresChart: React.FC<TopStoresChartProps> = ({
  data,
  colors,
  title = "Top 5 Stores",
  subtitle = "Visitors",
  useAgeGroupMapping = true
}) => {
  // Age group mapping (legacy behavior)
  const mapDataWithAgeGroups = (originalData: StoreData[]) => {
    return originalData.map((store: StoreData) => {
      const ageGroupMapping = [
        { name: "Infants (0-2 Years)", patterns: ["0-2 years old"] },
        { name: "Kids (3-12 years)", patterns: ["3-12 years old"] },
        { name: "Teens (13-21 years)", patterns: ["13-21 years old"] },
        { name: "Youths (22-35 years)", patterns: ["22-35 years old"] },
        { name: "Mature (35+ years)", patterns: ["35+ years old"] },
      ];

      const newStore = {
        store: store.store,
        data: ageGroupMapping.map((group) => ({
          name: group.name,
          data: [
            group.patterns.reduce((sum, pattern) => {
              const maleData = store.data.find((item) => 
                item.name.includes(pattern) && item.name.includes("male")
              )?.data[0] || 0;
              const femaleData = store.data.find((item) => 
                item.name.includes(pattern) && item.name.includes("female")
              )?.data[0] || 0;
              return sum + maleData + femaleData;
            }, 0),
          ],
        })),
        total: store.total,
      };

      return newStore;
    });
  };

  // Direct data mapping (new flexible behavior)
  const mapDataDirectly = (originalData: StoreData[]) => {
    return originalData.map((store: StoreData) => {
      let processedData= store.data;

      return {
        store: store.store,
        data: processedData,
        total: store.total,
      };
    });
  };

  // Choose mapping strategy
  const processedData = useAgeGroupMapping 
    ? mapDataWithAgeGroups(data)
    : mapDataDirectly(data);

  return (
    <Card 
      sx={{ 
        height: "100%", 
        position: "relative", 
        border: "1px solid #D8D9E4",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1, sm: 0 },
            mb: 2,
          }}
        >
          <Typography 
            variant="h6"
            sx={{ 
              fontSize: { xs: "16px", sm: "18px" },
              fontWeight: 600,
              color: "#000",
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 600,
              color: "#909090",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            borderBottom: "2px solid #D8D9E4",
            mb: 2,
          }}
        />

        {/* Chart Content */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            maxHeight: { xs: 250, sm: 300, md: 350 },
            pr: { xs: 2, sm: 4 },
            overflow: "auto",
            gap: 2,
          }}
        >
          {processedData &&
            processedData
              .sort((a, b) => b.total - a.total)
              .map((item, i) => {
                const chartData = item.data.map((dataItem) => dataItem.data[0]);
                
                // Generate labels dynamically
                const labels =  item.data.map((dataItem) => dataItem.name);

                return (
                  <Box 
                    key={i} 
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      minHeight: { xs: 50, sm: 60 },
                      gap: 1.5,
                    }}
                  >
                    {/* Store Name and Total */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mr: { xs: 2, sm: 4 },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontSize: { xs: "14px", sm: "16px" },
                          fontWeight: 600,
                          color: "#000",
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.store}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontSize: { xs: "14px", sm: "16px" },
                          fontWeight: 600,
                          color: "#909090",
                          minWidth: "fit-content",
                          ml: 1,
                        }}
                      >
                        {item.total.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Chart Bar */}
                    <Box sx={{ width: "100%" }}>
                      <HorizontalBarChart
                        data={chartData}
                        colors={colors}
                        labels={labels}
                      />
                    </Box>
                  </Box>
                );
              })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopStoresChart;