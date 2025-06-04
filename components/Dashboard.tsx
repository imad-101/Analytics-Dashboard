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
import { Bar, Line } from "react-chartjs-2";
import {
  featureUsageData,
  userSegmentationData,
  executionTimeData,
  barChartOptions,
  lineChartOptions,
} from "@/lib/dummyData";
import { ArrowUpRight, Users, Clock, Activity } from "lucide-react";

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

const stats = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+12.3%",
    icon: Users,
  },
  {
    title: "Avg. Response Time",
    value: "234ms",
    change: "-8.1%",
    icon: Clock,
  },
  {
    title: "Active Sessions",
    value: "1,234",
    change: "+23.1%",
    icon: Activity,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Pinsearch Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Visual insights from raw event data collected from your users.
        </p>
      </header>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <Bar options={barChartOptions} data={featureUsageData} />
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
              <Bar options={barChartOptions} data={userSegmentationData} />
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
              <Line options={lineChartOptions} data={executionTimeData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
