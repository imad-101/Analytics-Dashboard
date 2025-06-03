// app/dashboard/page.tsx or components/Dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  featureUsageData,
  userSegmentationData,
  executionTimeData,
  chartOptions,
} from "@/lib/dummyData";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          📊 Pinsearch Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Visual insights from raw event data collected from your users.
        </p>
      </header>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="feature-usage" className="w-full space-y-4">
        <TabsList className="flex gap-2 bg-muted p-2 rounded-md w-fit">
          <TabsTrigger
            value="feature-usage"
            className="px-4 py-2 text-sm font-medium"
          >
            Feature Usage
          </TabsTrigger>
          <TabsTrigger
            value="user-segmentation"
            className="px-4 py-2 text-sm font-medium"
          >
            Free vs Paid Users
          </TabsTrigger>
          <TabsTrigger
            value="execution-time"
            className="px-4 py-2 text-sm font-medium"
          >
            Function Performance
          </TabsTrigger>
        </TabsList>

        {/* Feature Usage Chart */}
        <TabsContent value="feature-usage">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Feature Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Bar options={chartOptions} data={featureUsageData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Free vs Paid Users Chart */}
        <TabsContent value="user-segmentation">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Free vs Paid User Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Bar options={chartOptions} data={userSegmentationData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Time Chart */}
        <TabsContent value="execution-time">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Function Execution Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Line options={chartOptions} data={executionTimeData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
