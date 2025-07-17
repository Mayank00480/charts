# 📊 Oly Charts

A collection of customizable React chart components using Recharts and MUI. Ideal for dashboards and analytics platforms.

## 📦 Installation

```bash
npm install oly-charts

# Or via Yalc (for local testing):
npx yalc add oly-charts
npm install

📈 WalkinTraffic Chart
A customizable React chart component designed to display walk-in traffic with both bar and line graphs.

✨ Features
📈 Bar and line chart combo

🎨 Fully customizable via styling prop

📅 Supports multiple time frames (Day, Week, Month, Year)

🧠 Built with TypeScript

⚛️ Responsive and interactive

🛠 Usage

import React from "react";
import { WalkinTrafficChart } from "my-oly-charts";

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

📊 TopStoresChart
A flexible and responsive horizontal bar chart component built with React, MUI, and TypeScript, used to display top store visitor distributions by dynamic segments or predefined age groups.

🚀 Features
🎨 Stacked horizontal bars for each store’s segment distribution

🧠 Toggleable age group mapping (default: ON)

💡 Dynamic labels and tooltips for clarity

📱 Fully responsive design

⚙️ Built with TypeScript & Material UI

interface StoreData {
  store: string;
  data: { name: string; data: number[] }[];
  total: number;
}

interface TopStoresChartProps {
  data: StoreData[];             // Visitor data for each store
  colors: string[];              // Color palette for segments
  title?: string;                // Optional chart title
  subtitle?: string;             // Optional chart subtitle
  useAgeGroupMapping?: boolean; // Whether to map age groups or use raw data
}

📦 Age Group Mapping (Optional)
Enabled by default via useAgeGroupMapping = true, the following groups are calculated based on naming patterns:

Infants (0–2 Years)

Kids (3–12 Years)

Teens (13–21 Years)

Youths (22–35 Years)

Mature (35+ Years)

If disabled (false), the chart will use the provided data.name fields as labels directly.

🧪 Example Usage

<TopStoresChart
  data={storeData}
  colors={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]}
  title="Top 5 Stores"
  subtitle="Visitors"
  useAgeGroupMapping={true}
/>

🌍 FootFallHeatMap
Interactive Treemap Heatmap component built with Recharts for React.
Supports drill-down, badges, custom styling, and icon rendering.

✨ Features
📊 Customizable Treemap chart

🔍 Drill-down navigation

🏷️ Optional badges for additional data

🎨 Flexible styling and theming

⚡ Fast and lightweight

🛠 Usage

import { FootFallHeatMap } from 'my-oly-charts';

const sampleData = [
  {
    name: 'North Region',
    value: 45.5,
    color: '#3f51b5', // Optional: specify color in data
    overallData: {
      stores: 25,
      count: 1250
    },
    list: [
      {
        name: 'Delhi',
        value: 25.2,
        overallData: { stores: 12, count: 650 },
        list: [
          { name: 'Mall 1', value: 15.1, overallData: { stores: 1, count: 320 } },
          { name: 'Mall 2', value: 10.1, overallData: { stores: 1, count: 330 } }
        ]
      },
      {
        name: 'Mumbai',
        value: 20.3,
        overallData: { stores: 13, count: 600 }
      }
    ]
  },
  {
    name: 'South Region',
    value: 35.2,
    color: '#4CAF50', // Optional: specify color in data
    overallData: {
      stores: 18,
      count: 920
    },
    list: [
      {
        name: 'Bangalore',
        value: 20.1,
        overallData: { stores: 10, count: 500 }
      },
      {
        name: 'Chennai',
        value: 15.1,
        overallData: { stores: 8, count: 420 }
      }
    ]
  },
  {
    name: 'East Region',
    value: 19.3,
    overallData: {
      stores: 12,
      count: 580
    },

  }
];

<FootFallHeatMap
  data={yourData}
  onItemClick={(item) => console.log(item)}
  colors={['#2196F3', '#4CAF50', '#FF9800']}
  height={500}
  enableDrillDown={true}
  showBreadcrumb={true}
/>

📘 Props

| Prop              | Type                        | Default        | Description                                    |
| ----------------- | --------------------------- | -------------- | ---------------------------------------------- |
| `data`            | `TreeMapDataItem[]`         | **Required**   | Hierarchical data to render in the tree map.   |
| `colors`          | `string[]`                  | Built-in theme | List of color hex codes used for nodes.        |
| `height`          | `number`                    | `450`          | Height of the chart container.                 |
| `onItemClick`     | `(item, index) => void`     | -              | Callback when a node is clicked.               |
| `enableDrillDown` | `boolean`                   | `true`         | Whether to enable drill-down on node click.    |
| `showBreadcrumb`  | `boolean`                   | `true`         | Display breadcrumb path when drilling down.    |
| `formatValue`     | `(value: number) => string` | `x.xx%`        | Custom formatter for node values.              |
| `threshold`       | `number`                    | `0.01` (1%)    | Minimum percent of total to ensure visibility. |

🤝 Contributing
Fork the repo

Create your feature branch: git checkout -b feature/

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/foo

Open a Pull Request