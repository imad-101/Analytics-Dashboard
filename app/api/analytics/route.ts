import { NextResponse } from "next/server";

import { UserEvent } from "@/app/models/UserEvent";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    // Ensure DB connection before any model usage (safe, read-only)
    await connectToDatabase();
    console.log("Connecting to database...");
    console.log("Database connected successfully");

    // Test the connection with a simple query first
    const testCount = await UserEvent.countDocuments();
    console.log(`Found ${testCount} documents in the collection`);

    if (testCount === 0) {
      // If no data exists, return empty arrays instead of error
      return NextResponse.json({
        eventTypesDistribution: [],
        eventsOverTime: [],
        userActivityByHour: [],
        subscriptionStatus: [],
        platformEngagement: [],
        featureUsageBySubscription: [],
        environmentEngagement: [],
        userRetention: {
          avgDaysActive: 0,
          avgEventsPerUser: 0,
          avgUniqueEventTypes: 0,
          totalUsers: 0,
        },
      });
    }

    // 1. Event Types Distribution
    console.log("Fetching event types distribution...");
    const eventTypesDistribution = await UserEvent.aggregate([
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          uniqueUsers: { $size: "$uniqueUsers" },
          _id: 0,
        },
      },
      { $sort: { value: -1 } },
    ]);
    console.log("Event types distribution fetched successfully");

    // 2. Events Over Time (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const eventsOverTime = await UserEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // 3. User Activity by Hour
    const userActivityByHour = await UserEvent.aggregate([
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          hour: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          _id: 0,
        },
      },
      { $sort: { hour: 1 } },
    ]);

    // 4. Subscription Status Distribution
    const subscriptionStatus = await UserEvent.aggregate([
      {
        $group: {
          _id: "$subscriptionStatus",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          avgDaysInTrial: { $avg: "$daysInTrial" },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          avgDaysInTrial: { $round: ["$avgDaysInTrial", 1] },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 5. Platform Engagement
    const platformEngagement = await UserEvent.aggregate([
      {
        $group: {
          _id: "$metadata.platform",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          browsers: { $addToSet: "$metadata.browser" },
          devices: { $addToSet: "$metadata.device" },
        },
      },
      {
        $project: {
          platform: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          browserCount: { $size: "$browsers" },
          deviceCount: { $size: "$devices" },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 6. Feature Usage by Subscription Type
    const featureUsageBySubscription = await UserEvent.aggregate([
      {
        $group: {
          _id: {
            eventType: "$eventType",
            subscriptionType: "$subscriptionType",
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          eventType: "$_id.eventType",
          subscriptionType: "$_id.subscriptionType",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 7. User Engagement by Environment
    const environmentEngagement = await UserEvent.aggregate([
      {
        $group: {
          _id: "$metadata.environment",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          events: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          environment: "$_id",
          count: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          avgEventsPerUser: {
            $divide: ["$count", { $size: "$uniqueUsers" }],
          },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 8. User Retention Analysis
    const userRetention = await UserEvent.aggregate([
      {
        $group: {
          _id: "$userId",
          firstEvent: { $min: "$timestamp" },
          lastEvent: { $max: "$timestamp" },
          eventCount: { $sum: 1 },
          eventTypes: { $addToSet: "$eventType" },
        },
      },
      {
        $project: {
          userId: "$_id",
          daysActive: {
            $divide: [
              { $subtract: ["$lastEvent", "$firstEvent"] },
              1000 * 60 * 60 * 24,
            ],
          },
          eventCount: 1,
          uniqueEventTypes: { $size: "$eventTypes" },
          _id: 0,
        },
      },
      {
        $group: {
          _id: null,
          avgDaysActive: { $avg: "$daysActive" },
          avgEventsPerUser: { $avg: "$eventCount" },
          avgUniqueEventTypes: { $avg: "$uniqueEventTypes" },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgDaysActive: { $round: ["$avgDaysActive", 1] },
          avgEventsPerUser: { $round: ["$avgEventsPerUser", 1] },
          avgUniqueEventTypes: { $round: ["$avgUniqueEventTypes", 1] },
          totalUsers: 1,
        },
      },
    ]);

    return NextResponse.json({
      eventTypesDistribution,
      eventsOverTime,
      userActivityByHour,
      subscriptionStatus,
      platformEngagement,
      featureUsageBySubscription,
      environmentEngagement,
      userRetention: userRetention[0] || {
        avgDaysActive: 0,
        avgEventsPerUser: 0,
        avgUniqueEventTypes: 0,
        totalUsers: 0,
      },
    });
  } catch (error) {
    console.error("Detailed error in analytics route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
