import { 
  itineraryDays, 
  locations, 
  restaurants,
  type ItineraryDay, 
  type Location, 
  type Restaurant,
  type InsertItineraryDay,
  type InsertLocation,
  type InsertRestaurant 
} from "@shared/schema";

export interface IStorage {
  getItineraryDays(): Promise<ItineraryDay[]>;
  getLocations(): Promise<Location[]>;
  getRestaurants(): Promise<Restaurant[]>;
  createItineraryDay(day: InsertItineraryDay): Promise<ItineraryDay>;
  createLocation(location: InsertLocation): Promise<Location>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
}

export class MemStorage implements IStorage {
  private itineraryDays: Map<number, ItineraryDay>;
  private locations: Map<number, Location>;
  private restaurants: Map<number, Restaurant>;
  private currentItineraryId: number;
  private currentLocationId: number;
  private currentRestaurantId: number;

  constructor() {
    this.itineraryDays = new Map();
    this.locations = new Map();
    this.restaurants = new Map();
    this.currentItineraryId = 1;
    this.currentLocationId = 1;
    this.currentRestaurantId = 1;
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
}

export const storage = new MemStorage();
