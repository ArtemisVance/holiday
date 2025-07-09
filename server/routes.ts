import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all itinerary days
  app.get("/api/itinerary", async (req, res) => {
    try {
      const days = await storage.getItineraryDays();
      res.json(days);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  // Get all locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Get all restaurants
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  // Travel Progress routes
  app.get('/api/travel-progress', async (req, res) => {
    try {
      const progress = await storage.getTravelProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch travel progress' });
    }
  });

  app.patch('/api/travel-progress/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const progress = await storage.updateTravelProgress(id, req.body);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update travel progress' });
    }
  });

  // Mood Rating routes
  app.get('/api/mood-ratings', async (req, res) => {
    try {
      const ratings = await storage.getMoodRatings();
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mood ratings' });
    }
  });

  app.post('/api/mood-ratings', async (req, res) => {
    try {
      const rating = await storage.createMoodRating(req.body);
      res.json(rating);
    } catch (error) {
      res.status(400).json({ error: 'Invalid mood rating data' });
    }
  });

  app.patch('/api/mood-ratings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rating = await storage.updateMoodRating(id, req.body);
      res.json(rating);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update mood rating' });
    }
  });

  app.delete('/api/mood-ratings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMoodRating(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete mood rating' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
