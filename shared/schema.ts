import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const itineraryDays = pgTable("itinerary_days", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  weather: text("weather").notNull(),
  temperature: integer("temperature").notNull(),
  activities: jsonb("activities").notNull(),
  dining: jsonb("dining").notNull(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  mapsUrl: text("maps_url").notNull(),
});

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  mealType: text("meal_type"),
  mapsUrl: text("maps_url"),
});

export const travelProgress = pgTable("travel_progress", {
  id: serial("id").primaryKey(),
  milestoneId: text("milestone_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isCompleted: text("is_completed").default("false"),
  completedAt: text("completed_at"),
  day: integer("day"),
  category: text("category").notNull(), // 'planning', 'travel', 'activities', 'dining'
  icon: text("icon").notNull(),
  order: integer("order").notNull(),
});

export const locationMoodRatings = pgTable("location_mood_ratings", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => locations.id),
  locationName: text("location_name").notNull(),
  rating: text("rating").notNull(), // 'good', 'okay', 'horrible'
  notes: text("notes"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const insertItineraryDaySchema = createInsertSchema(itineraryDays).omit({
  id: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
});

export const insertTravelProgressSchema = createInsertSchema(travelProgress).omit({
  id: true,
});

export const insertLocationMoodRatingSchema = createInsertSchema(locationMoodRatings).omit({
  id: true,
});

export type InsertItineraryDay = z.infer<typeof insertItineraryDaySchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertTravelProgress = z.infer<typeof insertTravelProgressSchema>;
export type InsertLocationMoodRating = z.infer<typeof insertLocationMoodRatingSchema>;

export type ItineraryDay = typeof itineraryDays.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type TravelProgress = typeof travelProgress.$inferSelect;
export type LocationMoodRating = typeof locationMoodRatings.$inferSelect;
