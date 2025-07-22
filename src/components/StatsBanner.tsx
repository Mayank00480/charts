import { Box, Typography } from "@mui/material";
import React from "react";

export interface StatsBannerProps {
  title: string;
  value: string | number;
  changeText?: string;
  changePercentage?: number;
  backgroundColor?: string;
  textColor?: string;
  width?: string;
  upArrowIcon?: React.ReactNode;
  downArrowIcon?: React.ReactNode;
  neutralIcon?: React.ReactNode;
}

const StatsBanner: React.FC<StatsBannerProps> = ({
  title,
  value,
  changeText,
  changePercentage,
  backgroundColor = "#4290b1",
  textColor,
  width = "99%",
  upArrowIcon,
  downArrowIcon,
  neutralIcon,
}) => {
  const isPositiveChange = changePercentage ? changePercentage > 0 : true;

  // Default icons as simple styled divs if no custom icons provided
  const defaultUpIcon = (
    <div style={{ 
      width: 0, 
      height: 0, 
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderBottom: '8px solid #6D9F92'
    }} />
  );

  const defaultDownIcon = (
    <div style={{ 
      width: 0, 
      height: 0, 
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '8px solid #ED1C24'
    }} />
  );

  const defaultNeutralIcon = (
    <div style={{ 
      width: '8px', 
      height: '2px', 
      backgroundColor: '#6a6a6a'
    }} />
  );

  const renderIcon = () => {
    if (changePercentage !== undefined && changePercentage !== 0) {
      return isPositiveChange 
        ? (upArrowIcon || defaultUpIcon)
        : (downArrowIcon || defaultDownIcon);
    }
    return neutralIcon || defaultNeutralIcon;
  };

  return (
    <Box
      sx={{
        width: width,
        backgroundColor: backgroundColor,
        borderRadius: "100px",
        padding: "16px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: textColor || "white",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        flexWrap: "wrap",
        "@media (max-width: 800px)": {
          width: "100%",
          marginTop: "5px",
          padding: "6px 3px",
        },
      }}
    >
      <Typography
        component="div"
        sx={{
          fontWeight: 500,
          marginRight: "5px",
          color: textColor || "#FFFFFF",
          "@media (min-width: 800px)": {
            fontSize: "16px !important",
          },
          "@media (max-width: 800px)": {
            fontSize: "14px !important",
          },
          "@media (max-width: 440px)": {
            fontSize: "12px !important",
          },
        }}
      >
        {title && (
          <>
            {title}
            {":"}
          </>
        )}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontWeight: 600,
          marginRight: "18px",
          color: textColor || "#FFFFFF",
          "@media (min-width: 800px)": {
            fontSize: "16px !important",
          },
          "@media (max-width: 800px)": {
            fontSize: "14px !important",
          },
          "@media (max-width: 440px)": {
            fontSize: "11px !important",
            marginRight: "5px",
          },
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}{" "}
        {!changeText && changePercentage !== undefined && `(${changePercentage}%)`}
      </Typography>

      {changeText && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "2px 6px",
            marginRight: "8px",
            gap: "4px"
          }}
        >
          <Typography
            fontSize={"14px !important"}
            fontWeight={"600 !important"}
            color={
              changePercentage !== 0
                ? isPositiveChange
                  ? "#6D9F92"
                  : "#ED1C24"
                : "#6a6a6a"
            }
            sx={{
              "@media (max-width: 800px)": {
                fontSize: "12px !important",
              },
              "@media (max-width: 440px)": {
                fontSize: "9px !important",
              },
            }}
          >
            {changeText}
          </Typography>

          {renderIcon()}
        </Box>
      )}
    </Box>
  );
};

export default StatsBanner;