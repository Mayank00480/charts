import React, { useState, useCallback } from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';

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
  [key: string]: any;
}

export interface TreeMapStyling {
  // Container styling
  backgroundColor?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  
  // Text styling
  fontFamily?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  valueFontWeight?: number;
  
  // Hover effects
  hoverTransform?: string;
  hoverTransition?: string;
  
  // Icon styling
  iconSize?: number;
  
  // Badge styling
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
  badgeBorderRadius?: number;
  badgePadding?: string;
  badgeBoxShadow?: string;
  
  // Layout
  padding?: number;
  gap?: number;
  
  // Animation
  enableAnimation?: boolean;
  animationDuration?: number;
  
  // Custom formatting
  valueFormatter?: (value: number) => string;
}

export interface TreeMapProps {
  data: TreeMapDataItem[];
  height?: number;
  width?: string;
  styling?: TreeMapStyling;
  onItemClick?: (item: TreeMapDataItem, index: number) => void;
  renderCustomIcons?: (item: TreeMapDataItem, iconSize: number, color: string) => React.ReactNode;
  enableDrillDown?: boolean;
  showBadges?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FootFallHeatMap: React.FC<TreeMapProps> = ({
  data,
  height = 450,
  width = "100%",
  styling = {},
  onItemClick,
  renderCustomIcons,
  enableDrillDown = false,
  showBadges = true,
  className,
  style
}) => {
  const [processedData, setProcessedData] = useState<TreeMapDataItem[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<TreeMapDataItem[][]>([]);

  // Simple default values - no complex calculations
  const defaultValues = {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#ffffff",
    borderWidth: 1,
    fontFamily: "Noto Sans, sans-serif",
    textColor: "#ffffff",
    fontSize: 18,
    fontWeight: 500,
    valueFontWeight: 700,
    hoverTransform: "scale(1.10)",
    hoverTransition: "transform 0.5s ease-in-out",
    iconSize: 20,
    badgeBackgroundColor: "#f4f4f4",
    badgeTextColor: "#333",
    badgeBorderRadius: 10,
    badgePadding: "6px 10px",
    badgeBoxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: 16,
    gap: 8,
    enableAnimation: false,
    animationDuration: 0,
    valueFormatter: (value: number) => {
      if (typeof value !== "number") return "0%";
      const formatted = value.toFixed(2);
      const trimmed = formatted.replace(/\.?0+$/, "");
      return `${trimmed}%`;
    }
  };

  // Simple merge - use parent value or default
  const finalStyling = {
    backgroundColor: styling.backgroundColor ?? defaultValues.backgroundColor,
    borderRadius: styling.borderRadius ?? defaultValues.borderRadius,
    borderColor: styling.borderColor ?? defaultValues.borderColor,
    borderWidth: styling.borderWidth ?? defaultValues.borderWidth,
    fontFamily: styling.fontFamily ?? defaultValues.fontFamily,
    textColor: styling.textColor ?? defaultValues.textColor,
    fontSize: styling.fontSize ?? defaultValues.fontSize,
    fontWeight: styling.fontWeight ?? defaultValues.fontWeight,
    valueFontWeight: styling.valueFontWeight ?? defaultValues.valueFontWeight,
    hoverTransform: styling.hoverTransform ?? defaultValues.hoverTransform,
    hoverTransition: styling.hoverTransition ?? defaultValues.hoverTransition,
    iconSize: styling.iconSize ?? defaultValues.iconSize,
    badgeBackgroundColor: styling.badgeBackgroundColor ?? defaultValues.badgeBackgroundColor,
    badgeTextColor: styling.badgeTextColor ?? defaultValues.badgeTextColor,
    badgeBorderRadius: styling.badgeBorderRadius ?? defaultValues.badgeBorderRadius,
    badgePadding: styling.badgePadding ?? defaultValues.badgePadding,
    badgeBoxShadow: styling.badgeBoxShadow ?? defaultValues.badgeBoxShadow,
    padding: styling.padding ?? defaultValues.padding,
    gap: styling.gap ?? defaultValues.gap,
    enableAnimation: styling.enableAnimation ?? defaultValues.enableAnimation,
    animationDuration: styling.animationDuration ?? defaultValues.animationDuration,
    valueFormatter: styling.valueFormatter ?? defaultValues.valueFormatter
  };

  // Data preprocessing to ensure minimum size representation
  const preprocessData = useCallback((inputData: TreeMapDataItem[]) => {
    if (!inputData || !Array.isArray(inputData)) return [];

    const processedData = [...inputData];
    const totalValue = processedData.reduce((sum, item) => sum + item.value, 0);
    const threshold = totalValue * 0.05;

    return processedData.map((item) => ({
      ...item,
      originalValue: item.originalValue || item.value,
      value: item.value < threshold ? threshold : item.value,
    }));
  }, []);

  // Initialize processed data
  React.useEffect(() => {
    setProcessedData(preprocessData(data));
  }, [data, preprocessData]);

  const handleItemClick = useCallback((item: TreeMapDataItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
    }

    if (enableDrillDown && item.list) {
      setNavigationHistory(prev => [...prev, processedData]);
      setProcessedData(preprocessData(item.list));
    }
  }, [onItemClick, enableDrillDown, processedData, preprocessData]);

  const handleGoBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousData = navigationHistory[navigationHistory.length - 1];
      setProcessedData(previousData);
      setNavigationHistory(prev => prev.slice(0, -1));
    }
  }, [navigationHistory]);

  const renderCustomizedContent = (props: any): React.ReactElement => {
    const { x, y, width, height, name, index } = props;
    const currentItem = processedData[index];
    const color = currentItem?.color || "#0086A9";
    const originalValue = currentItem?.originalValue || currentItem?.value;

    // Simple responsive logic - no complex calculations
    const isSmall = width < 120 || height < 80;
    const adjustedFontSize = isSmall ? Math.max(finalStyling.fontSize * 0.7, 12) : finalStyling.fontSize;
    const adjustedIconSize = isSmall ? Math.max(finalStyling.iconSize * 0.8, 14) : finalStyling.iconSize;
    const adjustedPadding = isSmall ? Math.max(finalStyling.padding * 0.5, 8) : finalStyling.padding;

    const containerStyle: React.CSSProperties = {
      backgroundColor: color,
      color: finalStyling.textColor,
      padding: `${adjustedPadding}px`,
      textAlign: 'center',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: isSmall && width > height ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
      border: `${finalStyling.borderWidth}px solid ${finalStyling.borderColor}`,
      gap: `${finalStyling.gap}px`,
      borderRadius: `${finalStyling.borderRadius}px`,
      transition: finalStyling.hoverTransition,
      fontFamily: finalStyling.fontFamily
    };

    const nameStyle: React.CSSProperties = {
      fontSize: `${adjustedFontSize}px`,
      fontWeight: finalStyling.fontWeight,
      color: finalStyling.textColor,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      margin: 0
    };

    const valueStyle: React.CSSProperties = {
      fontSize: `${adjustedFontSize}px`,
      fontWeight: finalStyling.valueFontWeight,
      textAlign: 'center',
      color: finalStyling.textColor,
      margin: 0
    };

    const badgeContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: `${finalStyling.gap}px`
    };

    const badgeStyle: React.CSSProperties = {
      backgroundColor: finalStyling.badgeBackgroundColor,
      color: finalStyling.badgeTextColor,
      padding: finalStyling.badgePadding,
      borderRadius: `${finalStyling.badgeBorderRadius}px`,
      boxShadow: finalStyling.badgeBoxShadow,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    };

    const iconContainerStyle: React.CSSProperties = {
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${adjustedIconSize + 4}px`,
      height: `${adjustedIconSize + 4}px`
    };

    const badgeFontSize = Math.max(adjustedFontSize * 0.7, 10);

    return (
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ borderRadius: `${finalStyling.borderRadius}px`, overflow: 'hidden' }}
      >
        <div
          style={containerStyle}
          onClick={() => handleItemClick(currentItem, index)}
          onMouseEnter={(e) => {
            if (finalStyling.hoverTransform) {
              e.currentTarget.style.transform = finalStyling.hoverTransform;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: isSmall ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: `${finalStyling.gap}px`,
            marginBottom: isSmall ? '4px' : '8px'
          }}>
            <p style={nameStyle} title={name}>
              {name}
            </p>
            <p style={valueStyle}>
              {finalStyling.valueFormatter(originalValue)}
            </p>
          </div>

          {showBadges && currentItem?.overallData && (width > 100 && height > 60) && (
            <div style={badgeContainerStyle}>
              {currentItem.overallData.stores && (
                <div style={badgeStyle}>
                  <div style={iconContainerStyle}>
                    {renderCustomIcons ? 
                      renderCustomIcons(currentItem, adjustedIconSize, color) :
                      <span style={{ fontSize: `${adjustedIconSize}px`, color }}>🏪</span>
                    }
                  </div>
                  <span style={{ fontSize: `${badgeFontSize}px`, fontWeight: 600 }}>
                    {currentItem.overallData.stores}
                  </span>
                </div>
              )}
              
              {currentItem.overallData.count && (
                <div style={badgeStyle}>
                  <div style={iconContainerStyle}>
                    {renderCustomIcons ? 
                      renderCustomIcons(currentItem, adjustedIconSize, color) :
                      <span style={{ fontSize: `${adjustedIconSize}px`, color }}>👥</span>
                    }
                  </div>
                  <span style={{ fontSize: `${badgeFontSize}px`, fontWeight: 600 }}>
                    {currentItem.overallData.count}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    );
  };

  const containerStyle: React.CSSProperties = {
    width: width,
    ...style
  };

  return (
    <div className={className} style={containerStyle}>
      {enableDrillDown && navigationHistory.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={handleGoBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0086A9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: finalStyling.fontFamily
            }}
          >
            ← Go Back
          </button>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={processedData}
          dataKey="value"
          stroke={finalStyling.borderColor}
          fill={finalStyling.backgroundColor}
          content={renderCustomizedContent as any}
          isAnimationActive={finalStyling.enableAnimation}
          animationDuration={finalStyling.animationDuration}
          aspectRatio={4 / 3}
          style={{ borderRadius: `${finalStyling.borderRadius}px` }}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default FootFallHeatMap;