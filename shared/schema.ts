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

export type InsertItineraryDay = z.infer<typeof insertItineraryDaySchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export type ItineraryDay = typeof itineraryDays.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
