// app/dashboard/page.tsx or components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
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
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  ArrowUpRight,
  Users,
  Activity,
  CreditCard,
  Clock,
  Zap,
} from "lucide-react";

// Define types for our data
interface EventTypeDistribution {
  name: string;
  value: number;
  uniqueUsers: number;
}

interface EventOverTime {
  date: string;
  count: number;
  uniqueUsers: number;
}

interface UserActivityByHour {
  hour: number;
  count: number;
  uniqueUsers: number;
}

interface SubscriptionStatus {
  status: string;
  count: number;
  uniqueUsers: number;
  avgDaysInTrial: number;
}

interface PlatformEngagement {
  platform: string;
  count: number;
  uniqueUsers: number;
  browserCount: number;
  deviceCount: number;
}

interface FeatureUsageBySubscription {
  eventType: string;
  subscriptionType: string;
  count: number;
  uniqueUsers: number;
}

interface EnvironmentEngagement {
  environment: string;
  count: number;
  uniqueUsers: number;
  avgEventsPerUser: number;
}

interface UserRetention {
  avgDaysActive: number;
  avgEventsPerUser: number;
  avgUniqueEventTypes: number;
  totalUsers: number;
}

interface DashboardData {
  eventTypesDistribution: EventTypeDistribution[];
  eventsOverTime: EventOverTime[];
  userActivityByHour: UserActivityByHour[];
  subscriptionStatus: SubscriptionStatus[];
  platformEngagement: PlatformEngagement[];
  featureUsageBySubscription: FeatureUsageBySubscription[];
  environmentEngagement: EnvironmentEngagement[];
  userRetention: UserRetention;
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8AC249",
  "#EA526F",
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || errorData.error || "Failed to fetch data"
          );
        }
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we have any data
  const hasData = Boolean(dashboardData?.eventTypesDistribution?.length);

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            No Data Available
          </h2>
          <p className="text-muted-foreground">
            Start collecting user events to see analytics
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEvents =
    dashboardData?.eventTypesDistribution.reduce(
      (acc, curr) => acc + curr.value,
      0
    ) || 0;
  const uniqueUsers = new Set(
    dashboardData?.eventTypesDistribution.map((e) => e.name)
  ).size;
  const totalSubscriptions =
    dashboardData?.subscriptionStatus.reduce(
      (acc, curr) => acc + curr.count,
      0
    ) || 0;
  const avgEventsPerUser = dashboardData?.userRetention.avgEventsPerUser || 0;
  const avgDaysActive = dashboardData?.userRetention.avgDaysActive || 0;

  const stats = [
    {
      title: "Total Events",
      value: totalEvents.toLocaleString(),
      change: "+12.3%",
      icon: Activity,
    },
    {
      title: "Unique Users",
      value: uniqueUsers.toLocaleString(),
      change: "-8.1%",
      icon: Users,
    },
    {
      title: "Total Subscriptions",
      value: totalSubscriptions.toLocaleString(),
      change: "+23.1%",
      icon: CreditCard,
    },
    {
      title: "Avg Events/User",
      value: avgEventsPerUser.toFixed(1),
      change: "+5.2%",
      icon: Zap,
    },
    {
      title: "Avg Days Active",
      value: avgDaysActive.toFixed(1),
      change: "+15.7%",
      icon: Clock,
    },
  ];

  // Prepare chart data
  const featureUsageData = {
    labels:
      dashboardData?.eventTypesDistribution.map((item) => item.name) || [],
    datasets: [
      {
        label: "Event Count",
        data:
          dashboardData?.eventTypesDistribution.map((item) => item.value) || [],
        backgroundColor: COLORS,
      },
      {
        label: "Unique Users",
        data:
          dashboardData?.eventTypesDistribution.map(
            (item) => item.uniqueUsers
          ) || [],
        backgroundColor: COLORS.map((color) => color + "80"),
      },
    ],
  };

  const eventsOverTimeData = {
    labels: dashboardData?.eventsOverTime.map((item) => item.date) || [],
    datasets: [
      {
        label: "Events",
        data: dashboardData?.eventsOverTime.map((item) => item.count) || [],
        borderColor: "#FF6384",
        tension: 0.4,
      },
      {
        label: "Unique Users",
        data:
          dashboardData?.eventsOverTime.map((item) => item.uniqueUsers) || [],
        borderColor: "#36A2EB",
        tension: 0.4,
      },
    ],
  };

  const userActivityByHourData = {
    labels:
      dashboardData?.userActivityByHour.map((item) => `${item.hour}:00`) || [],
    datasets: [
      {
        label: "Activity",
        data: dashboardData?.userActivityByHour.map((item) => item.count) || [],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Unique Users",
        data:
          dashboardData?.userActivityByHour.map((item) => item.uniqueUsers) ||
          [],
        backgroundColor: "#FF6384",
      },
    ],
  };

  const subscriptionStatusData = {
    labels: dashboardData?.subscriptionStatus.map((item) => item.status) || [],
    datasets: [
      {
        data: dashboardData?.subscriptionStatus.map((item) => item.count) || [],
        backgroundColor: COLORS,
      },
    ],
  };

  const platformEngagementData = {
    labels:
      dashboardData?.platformEngagement.map((item) => item.platform) || [],
    datasets: [
      {
        label: "Total Events",
        data: dashboardData?.platformEngagement.map((item) => item.count) || [],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Unique Users",
        data:
          dashboardData?.platformEngagement.map((item) => item.uniqueUsers) ||
          [],
        backgroundColor: "#FF6384",
      },
      {
        label: "Browser Types",
        data:
          dashboardData?.platformEngagement.map((item) => item.browserCount) ||
          [],
        backgroundColor: "#FFCE56",
      },
      {
        label: "Device Types",
        data:
          dashboardData?.platformEngagement.map((item) => item.deviceCount) ||
          [],
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  const environmentEngagementData = {
    labels:
      dashboardData?.environmentEngagement.map((item) => item.environment) ||
      [],
    datasets: [
      {
        label: "Events",
        data:
          dashboardData?.environmentEngagement.map((item) => item.count) || [],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Unique Users",
        data:
          dashboardData?.environmentEngagement.map(
            (item) => item.uniqueUsers
          ) || [],
        backgroundColor: "#FF6384",
      },
      {
        label: "Avg Events/User",
        data:
          dashboardData?.environmentEngagement.map(
            (item) => item.avgEventsPerUser
          ) || [],
        backgroundColor: "#FFCE56",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pt-0 p-6 md:p-10 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Pinsearch Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Comprehensive insights from user event data
        </p>
      </header>

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-5">
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
        <TabsList className="grid grid-cols-2 md:flex md:flex-row gap-2 bg-muted p-2 rounded-md w-full md:w-fit overflow-x-auto">
          <TabsTrigger
            value="feature-usage"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            Feature Usage
          </TabsTrigger>
          <TabsTrigger
            value="events-over-time"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            Events Over Time
          </TabsTrigger>
          <TabsTrigger
            value="user-activity"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            User Activity
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            Subscriptions
          </TabsTrigger>
          <TabsTrigger
            value="platforms"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            Platforms
          </TabsTrigger>
          <TabsTrigger
            value="environments"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap flex-grow"
          >
            Environments
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

        {/* Events Over Time Chart */}
        <TabsContent value="events-over-time">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Events Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Line options={chartOptions} data={eventsOverTimeData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity by Hour Chart */}
        <TabsContent value="user-activity">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                User Activity by Hour
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Bar options={chartOptions} data={userActivityByHourData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Status Chart */}
        <TabsContent value="subscriptions">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Subscription Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Doughnut options={chartOptions} data={subscriptionStatusData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Engagement Chart */}
        <TabsContent value="platforms">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Platform Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Bar options={chartOptions} data={platformEngagementData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environment Engagement Chart */}
        <TabsContent value="environments">
          <Card className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Environment Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <Bar options={chartOptions} data={environmentEngagementData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
