import { Box, Card, CardContent, Divider, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

interface DataItem {
  name: string;
  value: number;
  count: number;
}

interface ColorConfig {
  color: string;
}

interface ResponsivePieChartProps {
  data: DataItem[];
  colors: ColorConfig[];
  title?: string;
  height?: string | number;
  width?: string | number;
  showCard?: boolean;
  cardStyle?: React.CSSProperties;
  pieRadius?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  emptyStateMessage?: string;
}

const RADIAN = Math.PI / 180;

interface CustomizedLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  index?: number;
  name?: string;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: CustomizedLabelProps) => {
  // Add type guards to ensure all required values are present
  if (
    cx === undefined || 
    cy === undefined || 
    midAngle === undefined || 
    innerRadius === undefined || 
    outerRadius === undefined || 
    percent === undefined || 
    name === undefined
  ) {
    return null;
  }

  // Don't show labels if the pie is too small
  if (outerRadius < 80) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Responsive font sizes based on pie radius
  const nameFontSize = outerRadius > 120 ? 20 : 16;
  const percentFontSize = outerRadius > 120 ? 16 : 14;

  return (
    <>
      <text
        x={x}
        y={y - 15}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={nameFontSize}
        fontWeight={700}
      >
        {name}
      </text>
      <text
        x={x}
        y={y + 20}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={percentFontSize}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      name: string;
      value: number;
      count: number;
      fill?: string;
    };
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    const color = data.payload?.fill;

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: color || "#8884d8",
          padding: "10px",
          border: "1px solid #fff",
          borderRadius: "4px",
          color: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <p className="label" style={{ margin: 0, fontWeight: "800", fontSize: "11px" }}>
          {`${data.payload?.name}: ${data.payload?.count.toLocaleString()}`}
        </p>
      </div>
    );
  }

  return null;
};

const DefaultEmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "300px",
      flexDirection: "column",
    }}
  >
    <Typography sx={{ fontSize: "16px", fontWeight: "500", color: "#666", textAlign: "center" }}>
      {message}
    </Typography>
  </Box>
);

const ResponsivePieChart: React.FC<ResponsivePieChartProps> = ({
  data,
  colors,
  title = "Pie Chart",
  height = "100%",
  width = "100%",
  showCard = true,
  cardStyle = {},
  pieRadius = 150,
  showTooltip = true,
  showLegend = true,
  showLabels = true,
  emptyStateMessage = "No data available",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calculate responsive pie radius
  const responsiveRadius = isSmall ? Math.min(pieRadius, 80) : 
                          isMobile ? Math.min(pieRadius, 100) : 
                          Math.min(pieRadius, 150);

  const CustomLegend = () => {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: { xs: 2, md: 1 },
          position: { xs: 'static', md: 'absolute' },
          right: { md: 20 },
          top: { md: '50%' },
          transform: { md: 'translateY(-50%)' },
          mt: { xs: 2, md: 0 },
          px: { xs: 2, md: 0 }
        }}
      >
        {data.map((entry, index) => (
          <Box 
            key={`legend-${index}`} 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: 'row', md: 'column' }, 
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: { xs: 1, md: 0 },
              mb: { xs: 0, md: 2 },
              minWidth: { xs: 'auto', md: 'unset' }
            }}
          >
            <Typography
              sx={{
                fontWeight: "800 !important",
                fontSize: { xs: "12px", md: "13px" },
                mb: { xs: 0, md: 1 },
                fontStyle: "italic",
                order: { xs: 2, md: 1 }
              }}
            >
              {entry.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, order: { xs: 1, md: 2 } }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index]?.color || "#8884d8",
                  mb: { xs: 0, md: 1 },
                  flexShrink: 0
                }}
              />
              <Typography
                sx={{
                  fontWeight: "600 !important",
                  fontSize: { xs: "11px", md: "13px" },
                  mb: { xs: 0, md: 1 },
                  whiteSpace: 'nowrap'
                }}
              >
                {entry?.count.toLocaleString()} ({entry.value}%)
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const hasValidData = data && data.length > 0 && data.some((item) => item.value > 0);

  const chartContent = (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: { xs: 1, md: 2 } }}>
        <Typography sx={{ 
          fontSize: { xs: "16px", md: "19px" }, 
          fontWeight: "600 !important",
          textAlign: 'center',
          px: 1
        }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#D8D9E4" }} />
      {hasValidData ? (
        <Box sx={{ 
          overflow: "hidden", 
          width: { xs: '100%', md: showLegend ? '70%' : '100%' },
          height: { xs: "350px", sm: "400px", md: "430px" },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative'
        }}>
          <Box sx={{ 
            width:"100%",
            height: { xs: showLegend ? '70%' : '100%', md: '100%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={showLabels ? renderCustomizedLabel : false}
                  outerRadius={responsiveRadius}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={0}
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index]?.color || "#8884d8"}
                    />
                  ))}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
          </Box>
          {showLegend && <CustomLegend />}
        </Box>
      ) : (
         <DefaultEmptyState message={emptyStateMessage} />
      )}
    </>
  );

  if (showCard) {
    return (
      <Card
        style={{
          height,
          width,
          position: "relative",
          border: "1px solid #D8D9E4",
          ...cardStyle,
        }}
      >
        <CardContent sx={{ p: { xs: 1, md: 2 } }}>{chartContent}</CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ height, width, position: "relative", p: { xs: 1, md: 0 } }}>
      {chartContent}
    </Box>
  );
};

export default ResponsivePieChart;
