# 📊 Oly Charts

A customizable React chart component using Recharts and MUI, designed to display walk-in traffic with both bar and line graphs. Ideal for dashboards and analytics platforms.

## ✨ Features

- 📈 Bar and line chart combo
- 🎨 Fully customizable via `styling` prop
- 📅 Supports multiple time frames (`Day`, `Week`, `Month`, `Year`)
- 🧠 Built with TypeScript
- ⚛️ Responsive and interactive

## 📦 Installation

```bash
npm install oly-charts

Or via Yalc (for local testing):
npx yalc add oly-charts
npm install


🛠 Usage

import React from "react";
import { WalkinTrafficChart } from "oly-charts";

const data = [
  { name: 50, line: 45, x_axis: "Mon" },
  { name: 80, line: 70, x_axis: "Tue" },
  { name: 40, line: 50, x_axis: "Wed" },
  // ...
];

const chartStyling = {
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
    tooltipStyle: {
      backgroundColor: 'red',
      border: '2px solid white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  };

export default function Dashboard() {
  return (
    <div style={{ width: "100%", maxWidth: "1000px" }}>
      <WalkinTrafficChart
        data={data}
        timeFrame="Week"
        styling={chartStyling}
      />
    </div>
  );
}

🤝 Contributing
Fork the repo

Create your feature branch: git checkout -b feature/foo

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/foo

Open a Pull Request

