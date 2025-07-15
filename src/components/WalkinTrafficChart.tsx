import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

export type TimeFrame = "Day" | "Week" | "Month" | "Year";

export interface DataItem {
  name: number;
  line: number;
  x_axis: string;
  [key: string]: any;
}

export interface ChartStyling {
  // Bar styling
  xAxisFontSize?: number;  // Add this
  yAxisFontSize?: number;  // Add this
  barColor?: string;
  barHoverColor?: string;
  barSize?: number;
  barOpacity?: number;
  barHoverOpacity?: number;
  
  // Line styling
  lineColor?: string;
  lineWidth?: number;
  showLineDots?: boolean;
  lineDotColor?: string;
  lineDotSize?: number;
  
  // Grid styling
  gridColor?: string;
  gridStrokeWidth?: number;
  gridDashArray?: string;
  showGrid?: boolean;
  
  // Label styling
  labelFontSize?: number;
  labelColor?: string;
  showLabels?: boolean;
  labelPosition?: "top" | "bottom" | "inside" | "outside";
  
  // Axis styling
  xAxisColor?: string;
  yAxisColor?: string;
  axisLabelColor?: string;
  
  // Chart dimensions
  minChartWidth?: number;
  barSpacing?: number;
  
  // Hover effects
  hoverOpacity?: number;
  inactiveOpacity?: number;
  
  // Tooltip styling
  tooltipStyle?: React.CSSProperties;
}

export interface WalkinTrafficChartProps {
  data: DataItem[];
  timeFrame?: TimeFrame;
  height?: number;
  title?: string;
  style?: React.CSSProperties;
  styling?: ChartStyling;
}

export const WalkinTrafficChart: React.FC<WalkinTrafficChartProps> = ({
  data,
  timeFrame = "Month",
  height = 430,
  title = "Walk-in Traffic",
  style,
  styling = {}
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [barHovered, setBarHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  // Default styling values
  const defaultStyling: Required<ChartStyling> = {
    barColor: "#0086A9",
    barHoverColor: "#006d8a",
    barSize: 33,
    barOpacity: 0.9,
    barHoverOpacity: 1,
    lineColor: "#49454F",
    lineWidth: 3,
    showLineDots: false,
    lineDotColor: "#49454F",
    lineDotSize: 4,
    gridColor: "#ccc",
    gridStrokeWidth: 1,
    gridDashArray: "3 3",
    showGrid: true,
    labelFontSize: 12,
    labelColor: "#333",
    showLabels: true,
    labelPosition: "top",
    xAxisColor: "#666",
    yAxisColor: "#666",
    axisLabelColor: "#333",
    minChartWidth: 600,
    barSpacing: 80,
    hoverOpacity: 1,
    inactiveOpacity: 0.3,
    tooltipStyle: {},
    xAxisFontSize: 12,  // Add this
    yAxisFontSize: 12,  // Add this
  };

  // Merge user styling with defaults
  const finalStyling = { ...defaultStyling, ...styling };

  useEffect(() => {
    const updateWidth = () => {
      if (cardRef.current) {
        setChartWidth(cardRef.current.clientWidth - 40);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (cardRef.current) resizeObserver.observe(cardRef.current);

    return () => {
      if (cardRef.current) resizeObserver.unobserve(cardRef.current);
    };
  }, [data]);

  const handleMouseEnter = (_: any, index: number) => {
    setBarHovered(true);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setBarHovered(false);
    setActiveIndex(null);
  };

  const processedData = React.useMemo(() => {
    return data?.map((item, index) => ({
      ...item,
      opacity: activeIndex === null ? finalStyling.barOpacity : 
                activeIndex === index ? finalStyling.hoverOpacity : 
                finalStyling.inactiveOpacity,
      fill: activeIndex === index ? finalStyling.barHoverColor : finalStyling.barColor,
    })) || [];
  }, [data, activeIndex, finalStyling]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    width: "100%",
    overflowX: "auto",
    ...style
  };

  const chartContainerStyle: React.CSSProperties = {
    width: Math.max(finalStyling.minChartWidth, processedData.length * finalStyling.barSpacing),
    height: height
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          ...finalStyling.tooltipStyle
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color 
            }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={cardRef} style={containerStyle}>
      <div style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={processedData}
            width={chartWidth}
            height={height}
            onMouseLeave={handleMouseLeave}
          >
            {finalStyling.showGrid && (
              <CartesianGrid 
                strokeDasharray={finalStyling.gridDashArray} 
                stroke={finalStyling.gridColor}
                strokeWidth={finalStyling.gridStrokeWidth}
              />
            )}
            <XAxis 
              dataKey="x_axis" 
              stroke={finalStyling.xAxisColor}
              tick={{ fill: finalStyling.axisLabelColor,fontSize: finalStyling.xAxisFontSize  }}
            />
            <YAxis 
              stroke={finalStyling.yAxisColor}
              tick={{ fill: finalStyling.axisLabelColor,fontSize: finalStyling.yAxisFontSize }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="name"
              barSize={finalStyling.barSize}
              fill={finalStyling.barColor}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fillOpacity={finalStyling.barOpacity}
            >
              {finalStyling.showLabels && (
                <LabelList 
                  dataKey="name" 
                  position={finalStyling.labelPosition}
                  fontSize={finalStyling.labelFontSize}
                  fill={finalStyling.labelColor}
                />
              )}
            </Bar>
            
            {timeFrame !== "Day" && (
              <Line
                type="monotone"
                dataKey="line"
                stroke={finalStyling.lineColor}
                strokeWidth={finalStyling.lineWidth}
                dot={finalStyling.showLineDots ? {
                  fill: finalStyling.lineDotColor,
                  r: finalStyling.lineDotSize
                } : false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WalkinTrafficChart;