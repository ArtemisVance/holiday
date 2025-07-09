import { 
  itineraryDays, 
  locations, 
  restaurants,
  travelProgress,
  locationMoodRatings,
  type ItineraryDay, 
  type Location, 
  type Restaurant,
  type TravelProgress,
  type LocationMoodRating,
  type InsertItineraryDay,
  type InsertLocation,
  type InsertRestaurant,
  type InsertTravelProgress,
  type InsertLocationMoodRating
} from "@shared/schema";

export interface IStorage {
  getItineraryDays(): Promise<ItineraryDay[]>;
  getLocations(): Promise<Location[]>;
  getRestaurants(): Promise<Restaurant[]>;
  createItineraryDay(day: InsertItineraryDay): Promise<ItineraryDay>;
  createLocation(location: InsertLocation): Promise<Location>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getTravelProgress(): Promise<TravelProgress[]>;
  createTravelProgress(progress: InsertTravelProgress): Promise<TravelProgress>;
  updateTravelProgress(id: number, data: Partial<TravelProgress>): Promise<TravelProgress>;
  getMoodRatings(): Promise<LocationMoodRating[]>;
  createMoodRating(rating: InsertLocationMoodRating): Promise<LocationMoodRating>;
  updateMoodRating(id: number, data: Partial<LocationMoodRating>): Promise<LocationMoodRating>;
  deleteMoodRating(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private itineraryDays: Map<number, ItineraryDay>;
  private locations: Map<number, Location>;
  private restaurants: Map<number, Restaurant>;
  private travelProgress: Map<number, TravelProgress>;
  private moodRatings: Map<number, LocationMoodRating>;
  private currentItineraryId: number;
  private currentLocationId: number;
  private currentRestaurantId: number;
  private currentProgressId: number;
  private currentMoodRatingId: number;

  constructor() {
    this.itineraryDays = new Map();
    this.locations = new Map();
    this.restaurants = new Map();
    this.travelProgress = new Map();
    this.moodRatings = new Map();
    this.currentItineraryId = 1;
    this.currentLocationId = 1;
    this.currentRestaurantId = 1;
    this.currentProgressId = 1;
    this.currentMoodRatingId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize itinerary data
    const itineraryData = [
      {
        date: "Friday, 11 July",
        day: 11,
        title: "Tresaith Beach Day",
        weather: "Partly Sunny",
        temperature: 25,
        activities: [
          { type: "arrival", description: "Arrive & settle at Gwalia Falls", mapsUrl: "https://maps.google.com/maps?q=Gwalia+Falls+Caravan+Park+Tresaith+SA43+2JL" },
          { type: "beach", description: "Relax and swim at Tresaith Beach, explore waterfall", mapsUrl: "https://maps.google.com/maps?q=Tresaith+Beach" },
          { type: "optional", description: "Optional coastal walk to Aberporth Beach", mapsUrl: "https://maps.google.com/maps?q=Aberporth+Beach" }
        ],
        dining: [
          { type: "lunch", name: "Picnic/local snacks", location: "Tresaith" },
          { type: "dinner", name: "The Ship Inn", location: "Tresaith", description: "seafood pub with sea views" }
        ]
      },
      {
        date: "Saturday, 12 July",
        day: 12,
        title: "Mwnt Beach + Dolphin Spotting",
        weather: "Hot & Sunny",
        temperature: 28,
        activities: [
          { type: "beach", description: "Day at Mwnt Beach – swim, spot dolphins", mapsUrl: "https://maps.google.com/maps?q=Mwnt+Beach" },
          { type: "hiking", description: "Hike to Mwnt Chapel for views over Cardigan Bay", mapsUrl: "https://maps.google.com/maps?q=Mwnt+Chapel" }
        ],
        dining: [
          { type: "lunch", name: "Crwst Café", location: "Cardigan", description: "Award-winning café" },
          { type: "dinner", name: "Pizzatipi", location: "Cardigan", description: "Wood-fired pizzas" }
        ]
      },
      {
        date: "Sunday, 13 July",
        day: 13,
        title: "Penbryn Beach Day",
        weather: "Very Hot",
        temperature: 29,
        activities: [
          { type: "beach", description: "Chill at Penbryn Beach – long sandy shore, sea cave", mapsUrl: "https://maps.google.com/maps?q=Penbryn+Beach" },
          { type: "cafe", description: "Ice cream at Caffi Penbryn café above beach", mapsUrl: "https://maps.google.com/maps?q=Caffi+Penbryn" }
        ],
        dining: [
          { type: "lunch", name: "Caffi Penbryn", location: "Penbryn", description: "National Trust café" },
          { type: "dinner", name: "New Golden Dragon Chinese Takeaway", location: "Cardigan", description: "Chinese takeaway" }
        ]
      },
      {
        date: "Monday, 14 July",
        day: 14,
        title: "Ynyslas Sand Dunes & Hiking",
        weather: "Showers early, clearing",
        temperature: 23,
        activities: [
          { type: "nature", description: "Walk the boardwalks through Ynyslas Sand Dunes", mapsUrl: "https://maps.google.com/maps?q=Ynyslas+Sand+Dunes" },
          { type: "hiking", description: "Hike nearby trails with sea & estuary views", mapsUrl: "https://maps.google.com/maps?q=Ynyslas+Nature+Reserve" }
        ],
        dining: [
          { type: "lunch", name: "Local café or packed lunch near dunes", location: "Ynyslas", description: "Light lunch" },
          { type: "dinner", name: "Yr Hen Printworks", location: "Cardigan", description: "small plates & creative mains" }
        ]
      },
      {
        date: "Tuesday, 15 July",
        day: 15,
        title: "Wildlife & Castle Ruins",
        weather: "Showers",
        temperature: 20,
        activities: [
          { type: "wildlife", description: "Explore Welsh Wildlife Centre, Teifi Marshes", mapsUrl: "https://maps.google.com/maps?q=Welsh+Wildlife+Centre+Teifi+Marshes" },
          { type: "castle", description: "Visit Cilgerran Castle", mapsUrl: "https://maps.google.com/maps?q=Cilgerran+Castle" }
        ],
        dining: [
          { type: "lunch", name: "Crowes Café", location: "Cardigan", description: "Local favorite" },
          { type: "dinner", name: "Bryn Berwyn Restaurant", location: "Cardigan", description: "modern countryside dining" }
        ]
      },
      {
        date: "Wednesday, 16 July",
        day: 16,
        title: "Constitution Hill Sightseeing (Aberystwyth)",
        weather: "Cloudy with light rain",
        temperature: 21,
        activities: [
          { type: "hiking", description: "Walk Constitution Hill – views over Aberystwyth & bay", mapsUrl: "https://maps.google.com/maps?q=Constitution+Hill+Aberystwyth" },
          { type: "attraction", description: "Visit Camera Obscura (if weather permits)", mapsUrl: "https://maps.google.com/maps?q=Camera+Obscura+Aberystwyth" }
        ],
        dining: [
          { type: "lunch", name: "The Glengower Hotel", location: "Aberystwyth", description: "Seafront dining" },
          { type: "dinner", name: "Fisherman's Rest", location: "Cardigan", description: "comfort food & seafood" }
        ]
      },
      {
        date: "Thursday, 17 July",
        day: 17,
        title: "Llangrannog Village & Beach",
        weather: "Cloudy but dry",
        temperature: 22,
        activities: [
          { type: "beach", description: "Visit Llangrannog Beach", mapsUrl: "https://maps.google.com/maps?q=Llangrannog+Beach" },
          { type: "hiking", description: "Hike to Carreg Bica sea stack & cliff views", mapsUrl: "https://maps.google.com/maps?q=Carreg+Bica+Llangrannog" }
        ],
        dining: [
          { type: "lunch", name: "The Beach Hut Café", location: "Llangrannog", description: "Beachside café" },
          { type: "dinner", name: "Harbourmaster Hotel", location: "Aberaeron", description: "Premium seafood dining" }
        ]
      },
      {
        date: "Friday, 18 July",
        day: 18,
        title: "Farewell Beach & Departure",
        weather: "Light Rain",
        temperature: 20,
        activities: [
          { type: "beach", description: "Final stroll on Tresaith or Aberporth Beach", mapsUrl: "https://maps.google.com/maps?q=Tresaith+Beach" },
          { type: "sightseeing", description: "Quick stop in Aberaeron for last views & snacks", mapsUrl: "https://maps.google.com/maps?q=Aberaeron" }
        ],
        dining: [
          { type: "lunch", name: "Bay View Restaurant", location: "Aberporth", description: "Farewell meal with coastal views" }
        ]
      }
    ];

    itineraryData.forEach(day => {
      const id = this.currentItineraryId++;
      this.itineraryDays.set(id, { ...day, id });
    });

    // Initialize locations data
    const locationsData = [
      { name: "Tresaith Beach", category: "beach", description: "Famous waterfall beach", mapsUrl: "https://maps.google.com/maps?q=Tresaith+Beach" },
      { name: "Penbryn Beach", category: "beach", description: "National Trust beach", mapsUrl: "https://maps.google.com/maps?q=Penbryn+Beach" },
      { name: "Mwnt Beach", category: "beach", description: "Grassy headland views", mapsUrl: "https://maps.google.com/maps?q=Mwnt+Beach" },
      { name: "Aberporth Beach", category: "beach", description: "Coastal village beach", mapsUrl: "https://maps.google.com/maps?q=Aberporth+Beach" },
      { name: "Cardigan Castle", category: "historic", description: "Medieval castle with gardens", mapsUrl: "https://maps.google.com/maps?q=Cardigan+Castle" },
      { name: "Cilgerran Castle", category: "historic", description: "Castle ruins with views", mapsUrl: "https://maps.google.com/maps?q=Cilgerran+Castle" },
      { name: "Mwnt Chapel", category: "historic", description: "Ancient chapel", mapsUrl: "https://maps.google.com/maps?q=Mwnt+Chapel" },
      { name: "Welsh Wildlife Centre", category: "nature", description: "Teifi Marshes nature reserve", mapsUrl: "https://maps.google.com/maps?q=Welsh+Wildlife+Centre" },
      { name: "Ynyslas Sand Dunes", category: "nature", description: "Boardwalk through dunes", mapsUrl: "https://maps.google.com/maps?q=Ynyslas+Sand+Dunes" },
      { name: "Cardigan Island Farm", category: "nature", description: "Coastal farm park", mapsUrl: "https://maps.google.com/maps?q=Cardigan+Island+Farm" },
      { name: "Cardigan Town", category: "town", description: "Historic market town", mapsUrl: "https://maps.google.com/maps?q=Cardigan+Wales" },
      { name: "Aberystwyth", category: "town", description: "University town", mapsUrl: "https://maps.google.com/maps?q=Aberystwyth" },
      { name: "New Quay", category: "town", description: "Harbour town", mapsUrl: "https://maps.google.com/maps?q=New+Quay+Wales" }
    ];

    locationsData.forEach(location => {
      const id = this.currentLocationId++;
      this.locations.set(id, { ...location, id });
    });

    // Initialize restaurants data
    const restaurantsData = [
      { name: "The Ship Inn", category: "seafood", location: "Tresaith", description: "Great seafood pub with sea views", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=The+Ship+Inn+Tresaith" },
      { name: "Fisherman's Rest", category: "seafood", location: "Cardigan", description: "Comfort food & fresh seafood", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=Fisherman's+Rest+Cardigan" },
      { name: "Harbourmaster Hotel", category: "seafood", location: "Aberaeron", description: "Premium seafood dining", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=Harbourmaster+Hotel+Aberaeron" },
      { name: "Crwst Café", category: "cafe", location: "Cardigan", description: "Award-winning brunch & doughnuts", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=Crwst+Café+Cardigan" },
      { name: "Caffi Penbryn", category: "cafe", location: "Penbryn", description: "National Trust café with coastal views", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=Caffi+Penbryn" },
      { name: "Crowes Café", category: "cafe", location: "Cardigan", description: "Local favorite", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=Crowes+Café+Cardigan" },
      { name: "Yr Hen Printworks", category: "fine-dining", location: "Cardigan", description: "Small plates & creative mains", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=Yr+Hen+Printworks+Cardigan" },
      { name: "Bryn Berwyn Restaurant", category: "fine-dining", location: "Cardigan", description: "Modern countryside dining", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=Bryn+Berwyn+Restaurant+Cardigan" },
      { name: "Pizzatipi", category: "casual", location: "Cardigan", description: "Wood-fired pizzas", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=Pizzatipi+Cardigan" },
      { name: "The Glengower Hotel", category: "hotel", location: "Aberystwyth", description: "Seafront dining", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=The+Glengower+Hotel+Aberystwyth" },
      { name: "Bay View Restaurant", category: "hotel", location: "Aberporth", description: "Coastal views", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=Bay+View+Restaurant+Aberporth" },
      { name: "New Golden Dragon Chinese Takeaway", category: "takeaway", location: "Cardigan", description: "Chinese takeaway", mealType: "dinner", mapsUrl: "https://maps.google.com/maps?q=New+Golden+Dragon+Chinese+Takeaway+Cardigan" },
      { name: "The Beach Hut Café", category: "cafe", location: "Llangrannog", description: "Beachside café", mealType: "lunch", mapsUrl: "https://maps.google.com/maps?q=The+Beach+Hut+Café+Llangrannog" }
    ];

    restaurantsData.forEach(restaurant => {
      const id = this.currentRestaurantId++;
      this.restaurants.set(id, { ...restaurant, id });
    });

    // Initialize travel progress data
    const progressData = [
      { milestoneId: "booking", name: "Booked accommodation", description: "Gwalia Falls Caravan Park confirmed", isCompleted: "true", completedAt: "2024-07-01T10:00:00Z", day: null, category: "planning", icon: "calendar", order: 1 },
      { milestoneId: "packing", name: "Packed for trip", description: "Clothes, toiletries, and beach gear", isCompleted: "false", completedAt: null, day: null, category: "planning", icon: "map", order: 2 },
      { milestoneId: "travel", name: "Travel to Wales", description: "Journey to Tresaith", isCompleted: "false", completedAt: null, day: 11, category: "travel", icon: "route", order: 3 },
      { milestoneId: "checkin", name: "Check in at Gwalia Falls", description: "Settle into accommodation", isCompleted: "false", completedAt: null, day: 11, category: "travel", icon: "map", order: 4 },
      { milestoneId: "beach1", name: "First beach day", description: "Tresaith Beach exploration", isCompleted: "false", completedAt: null, day: 11, category: "activities", icon: "star", order: 5 },
      { milestoneId: "cardigan", name: "Visit Cardigan", description: "Explore historic market town", isCompleted: "false", completedAt: null, day: 12, category: "activities", icon: "star", order: 6 },
      { milestoneId: "new_quay", name: "New Quay dolphin watching", description: "Boat trip to see dolphins", isCompleted: "false", completedAt: null, day: 13, category: "activities", icon: "star", order: 7 },
      { milestoneId: "aberaeron", name: "Aberaeron visit", description: "Colorful harbour town", isCompleted: "false", completedAt: null, day: 14, category: "activities", icon: "star", order: 8 },
      { milestoneId: "aberystwyth", name: "Aberystwyth day trip", description: "University town and pier", isCompleted: "false", completedAt: null, day: 15, category: "activities", icon: "star", order: 9 },
      { milestoneId: "seafood", name: "Try local seafood", description: "Dine at coastal restaurants", isCompleted: "false", completedAt: null, day: null, category: "dining", icon: "utensils", order: 10 },
      { milestoneId: "sunset", name: "Watch sunset from beach", description: "Evening at Tresaith Beach", isCompleted: "false", completedAt: null, day: null, category: "activities", icon: "camera", order: 11 },
      { milestoneId: "checkout", name: "Check out & travel home", description: "Final day departure", isCompleted: "false", completedAt: null, day: 18, category: "travel", icon: "route", order: 12 }
    ];

    progressData.forEach(progress => {
      const id = this.currentProgressId++;
      this.travelProgress.set(id, { 
        ...progress, 
        id,
        description: progress.description || null,
        day: progress.day || null,
        isCompleted: progress.isCompleted || null,
        completedAt: progress.completedAt || null
      });
    });
  }

  async getItineraryDays(): Promise<ItineraryDay[]> {
    return Array.from(this.itineraryDays.values()).sort((a, b) => a.day - b.day);
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async createItineraryDay(insertDay: InsertItineraryDay): Promise<ItineraryDay> {
    const id = this.currentItineraryId++;
    const day: ItineraryDay = { ...insertDay, id };
    this.itineraryDays.set(id, day);
    return day;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const location: Location = { 
      ...insertLocation, 
      id,
      description: insertLocation.description || null
    };
    this.locations.set(id, location);
    return location;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant: Restaurant = { 
      ...insertRestaurant, 
      id,
      description: insertRestaurant.description || null,
      mealType: insertRestaurant.mealType || null,
      mapsUrl: insertRestaurant.mapsUrl || null
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async getTravelProgress(): Promise<TravelProgress[]> {
    return Array.from(this.travelProgress.values());
  }

  async createTravelProgress(insertProgress: InsertTravelProgress): Promise<TravelProgress> {
    const id = this.currentProgressId++;
    const progress: TravelProgress = { 
      ...insertProgress, 
      id,
      description: insertProgress.description || null,
      day: insertProgress.day || null,
      isCompleted: insertProgress.isCompleted || null,
      completedAt: insertProgress.completedAt || null
    };
    this.travelProgress.set(id, progress);
    return progress;
  }

  async updateTravelProgress(id: number, data: Partial<TravelProgress>): Promise<TravelProgress> {
    const progress = this.travelProgress.get(id);
    if (!progress) {
      throw new Error(`Travel progress with id ${id} not found`);
    }
    const updatedProgress = { ...progress, ...data };
    this.travelProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getMoodRatings(): Promise<LocationMoodRating[]> {
    return Array.from(this.moodRatings.values());
  }

  async createMoodRating(insertRating: InsertLocationMoodRating): Promise<LocationMoodRating> {
    const id = this.currentMoodRatingId++;
    const rating: LocationMoodRating = { 
      ...insertRating, 
      id,
      locationId: insertRating.locationId || null,
      notes: insertRating.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.moodRatings.set(id, rating);
    return rating;
  }

  async updateMoodRating(id: number, data: Partial<LocationMoodRating>): Promise<LocationMoodRating> {
    const rating = this.moodRatings.get(id);
    if (!rating) {
      throw new Error(`Mood rating with id ${id} not found`);
    }
    const updatedRating = { 
      ...rating, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    this.moodRatings.set(id, updatedRating);
    return updatedRating;
  }

  async deleteMoodRating(id: number): Promise<void> {
    this.moodRatings.delete(id);
  }
}

export const storage = new MemStorage();
