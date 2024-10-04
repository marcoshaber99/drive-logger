import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerkUserId", ["clerkUserId"]),

  jobs: defineTable({
    date: v.string(),
    description: v.string(),
    price: v.number(),
    userId: v.string(),
  }).index("by_userId", ["userId"]),
});
