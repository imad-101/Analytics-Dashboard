import mongoose, { InferSchemaType, Schema } from "mongoose";

const UserEventSchema = new Schema(
  {
    // Core fields (always present)
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
      enum: [
        "keyword_search",
        "pin_explorer_by_keyword",
        "pin_explorer_by_url",
        "profile_explorer",
        "create_images_to_blog",
        "create_topic_to_blog",
        "create_title_description",
      ], //add more events as app grows
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionType: {
      type: String,
      required: true,
    },
    daysInTrial: {
      type: Number,
      required: false,
    },
    subscriptionStatus: {
      type: String,
      required: true,
    },

    // Feature-specific fields (varies by eventType)
    properties: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // Common optional fields
    metadata: {
      appVersion: String,
      environment: String,
      ipAddress: String,
      platform: String,
      browser: String,
      browserVersion: String,
      device: String,
      os: String,
      userAgent: String,
      referer: String,
      page: String,
      locale: String, // user's language/region
      timezone: String,
    },
  },
  {
    collection: "userevents",
    strict: false, // Allows for additional fields that aren't defined in the schema
  }
);

// Create compound indexes for common queries
UserEventSchema.index({ eventType: 1, timestamp: 1 });
UserEventSchema.index({ userId: 1, eventType: 1 });

// Create TTL index for automatic data expiration (optional)
// EventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days

const UserEvent =
  mongoose.models.UserEvent || mongoose.model("UserEvent", UserEventSchema);

type UserEventType = InferSchemaType<typeof UserEventSchema>;

export { UserEvent, type UserEventType };
