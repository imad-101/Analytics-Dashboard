import { ChartOptions } from "chart.js";

export const featureUsageData = {
  labels: ["Search", "Filter", "Sort", "Export", "Share"],
  datasets: [
    {
      label: "Usage Count",
      data: [1200, 800, 600, 400, 300],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const userSegmentationData = {
  labels: ["Search", "Filter", "Sort", "Export", "Share"],
  datasets: [
    {
      label: "Free Users",
      data: [800, 500, 300, 100, 50],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Paid Users",
      data: [400, 300, 300, 300, 250],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const executionTimeData = {
  labels: ["Search", "Filter", "Sort", "Export", "Share"],
  datasets: [
    {
      label: "Average Execution Time (ms)",
      data: [150, 80, 120, 200, 50],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

export const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
