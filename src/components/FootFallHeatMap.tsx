import React, { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

// Types
export interface TreeMapDataItem {
  name: string;
  value: number;
  originalValue?: number;
  color?: string;
  list?: TreeMapDataItem[];
  overallData?: {
    stores?: number;
    count?: number;
    [key: string]: any;
  };
  chartData?: any[];
  [key: string]: any;
}

export interface SimpleTreeMapProps {
  data: TreeMapDataItem[];
  colors?: string[];
  height?: number;
  onItemClick?: (item: TreeMapDataItem, index: number) => void;
  enableDrillDown?: boolean;
  showBreadcrumb?: boolean;
  formatValue?: (value: number) => string;
  threshold?: number; // Minimum percentage for visibility
}

// Default props
const defaultColors = [
  '#3f51b5', '#4CAF50', '#FF9800', '#9C27B0', '#F44336',
  '#2196F3', '#FF5722', '#795548', '#607D8B', '#E91E63'
];

const defaultFormatValue = (value: number): string => {
  if (typeof value !== "number") return "0%";
  const formatted = value.toFixed(2);
  const trimmed = formatted.replace(/\.?0+$/, "");
  return `${trimmed}%`;
};

const SimpleTreeMap: React.FC<SimpleTreeMapProps> = ({
  data,
  colors = defaultColors,
  height = 450,
  onItemClick,
  enableDrillDown = true,
  showBreadcrumb = true,
  formatValue = defaultFormatValue,
  threshold = 0.01 // 1%
}) => {
  const [currentData, setCurrentData] = useState<TreeMapDataItem[]>(data);
  const [navigationHistory, setNavigationHistory] = useState<TreeMapDataItem[][]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);

  // Reset when data changes
  useEffect(() => {
    setCurrentData(data);
    setNavigationHistory([]);
    setBreadcrumbPath([]);
  }, [data]);

  // Preprocess data to ensure minimum visibility and add colors
  const processedData = useMemo(() => {
    if (!currentData || !Array.isArray(currentData) || currentData.length === 0) {
      return [];
    }

    const totalValue = currentData.reduce((sum, item) => sum + (item.value || 0), 0);
    const minThreshold = totalValue * threshold;

    return currentData.map((item, index) => ({
      ...item,
      originalValue: item.originalValue || item.value,
      value: item.value < minThreshold ? minThreshold : item.value,
      color: item.color || colors[index % colors.length],
    }));
  }, [currentData, colors, threshold]);

  // Handle item click
  const handleItemClick = (item: TreeMapDataItem, index: number) => {
    // Call parent callback if provided
    onItemClick?.(item, index);

    // Handle drill-down
    if (enableDrillDown && item.list && Array.isArray(item.list) && item.list.length > 0) {
      setNavigationHistory(prev => [...prev, currentData]);
      setBreadcrumbPath(prev => [...prev, item.name]);
      setCurrentData(item.list);
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setCurrentData(previous);
      setNavigationHistory(prev => prev.slice(0, -1));
      setBreadcrumbPath(prev => prev.slice(0, -1));
    }
  };

  // Custom content renderer
  const renderCustomizedContent = (props: any): JSX.Element => {
    const { x, y, width, height, name, index } = props;
    const currentItem = processedData[index];
    
    if (!currentItem) return <div></div>;

    const { color, originalValue, overallData } = currentItem;
    
    // Responsive sizing
    const isLarge = width > 180 && height > 150;
    const isMedium = width > 100 && height > 100;
    const isSmall = !isLarge && !isMedium;
    
    const fontSize = isLarge ? 18 : isMedium ? 14 : 12;
    const iconSize = isLarge ? 20 : isMedium ? 16 : 14;
    const padding = isLarge ? 16 : isMedium ? 12 : 8;

    return (
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        <Box
          onClick={() => handleItemClick(currentItem, index)}
          sx={{
            backgroundColor: color,
            color: '#fff',
            padding: `${padding}px`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            gap: isSmall ? 0.5 : 1,
          }}
        >
          {/* Name and Value */}
          <Box sx={{ textAlign: 'center', mb: isSmall ? 0.5 : 1 }}>
            <Typography
              sx={{
                fontSize: `${fontSize}px`,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                mb: 0.5,
              }}
              title={name}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                fontSize: `${fontSize}px`,
                fontWeight: 700,
              }}
            >
              {formatValue(originalValue)}
            </Typography>
          </Box>

          {/* Badges - only show if there's enough space */}
          {!isSmall && overallData && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: width > height ? 'row' : 'column',
                gap: 0.5,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {overallData.stores && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: color,
                    px: 1,
                    py: 0.5,
                    borderRadius: '12px',
                    fontSize: `${fontSize * 0.75}px`,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  🏪 {overallData.stores}
                </Box>
              )}
              {overallData.count && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: color,
                    px: 1,
                    py: 0.5,
                    borderRadius: '12px',
                    fontSize: `${fontSize * 0.75}px`,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  👥 {overallData.count}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </foreignObject>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Breadcrumb */}
      {showBreadcrumb && breadcrumbPath.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={handleGoBack}
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {breadcrumbPath.join(' > ')}
          </Typography>
        </Box>
      )}

      {/* TreeMap */}
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={processedData}
          dataKey="value"
          stroke="rgba(255,255,255,0.2)"
          fill="#f5f5f5"
          content={renderCustomizedContent}
          isAnimationActive={false}
          aspectRatio={4 / 3}
        />
      </ResponsiveContainer>
    </Box>
  );
};

export default SimpleTreeMap;