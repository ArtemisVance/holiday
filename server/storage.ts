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
        title: "Arrival & Beach Day",
        weather: "Partly Sunny",
        temperature: 25,
        activities: [
          { type: "arrival", description: "Arrive & check in at Gwalia Falls, Tresaith", mapsUrl: "https://maps.google.com/maps?q=Gwalia+Falls,+Tresaith" },
          { type: "beach", description: "Relax on Tresaith Beach – explore the famous waterfall & swim", mapsUrl: "https://maps.google.com/maps?q=Tresaith+Beach" },
          { type: "optional", description: "Optional sunset walk along the coast path to Aberporth", mapsUrl: "https://maps.google.com/maps?q=Aberporth" }
        ],
        dining: [
          { type: "lunch", name: "Light bite from the beach or local shop", location: "Tresaith" },
          { type: "dinner", name: "The Ship Inn", location: "Tresaith", description: "great seafood pub with sea views" }
        ]
      },
      {
        date: "Saturday, 12 July",
        day: 12,
        title: "Dolphins & Coast Path",
        weather: "Hot & Sunny",
        temperature: 28,
        activities: [
          { type: "tour", description: "Morning dolphin-spotting boat tour", mapsUrl: "https://maps.google.com/maps?q=New+Quay+Harbour" },
          { type: "hiking", description: "Hike the Ceredigion Coast Path: Tresaith → Aberporth → Penbryn Beach", mapsUrl: "https://maps.google.com/maps?q=Ceredigion+Coast+Path" },
          { type: "beach", description: "Chill or swim at Penbryn Beach", mapsUrl: "https://maps.google.com/maps?q=Penbryn+Beach" }
        ],
        dining: [
          { type: "lunch", name: "Caffi Penbryn", location: "Penbryn", description: "National Trust café" },
          { type: "dinner", name: "Pizzatipi", location: "Cardigan", description: "Wood-fired pizzas" }
        ]
      },
      {
        date: "Sunday, 13 July",
        day: 13,
        title: "Mwnt & Family Farm Fun",
        weather: "Very Hot",
        temperature: 29,
        activities: [
          { type: "beach", description: "Visit Mwnt Beach & Chapel – walk up the grassy headland for views", mapsUrl: "https://maps.google.com/maps?q=Mwnt+Beach+Chapel" },
          { type: "farm", description: "Spend time at Cardigan Island Coastal Farm Park", mapsUrl: "https://maps.google.com/maps?q=Cardigan+Island+Coastal+Farm+Park" }
        ],
        dining: [
          { type: "lunch", name: "Crwst Café", location: "Cardigan", description: "award-winning brunch & doughnuts" },
          { type: "dinner", name: "Yr Hen Printworks", location: "Cardigan", description: "small plates & creative mains" }
        ]
      },
      {
        date: "Monday, 14 July",
        day: 14,
        title: "Cardigan Castle & Town",
        weather: "Showers early, sunny later",
        temperature: 23,
        activities: [
          { type: "castle", description: "Tour Cardigan Castle & gardens", mapsUrl: "https://maps.google.com/maps?q=Cardigan+Castle" },
          { type: "culture", description: "Explore shops or catch a show at Theatr Mwldan", mapsUrl: "https://maps.google.com/maps?q=Theatr+Mwldan+Cardigan" }
        ],
        dining: [
          { type: "lunch", name: "1176 Restaurant", location: "Cardigan Castle", description: "Historic castle dining" },
          { type: "dinner", name: "The Copper Pot", location: "Cardigan", description: "Traditional pub fare" }
        ]
      },
      {
        date: "Tuesday, 15 July",
        day: 15,
        title: "Wildlife & Castle Ruins",
        weather: "Showers",
        temperature: 20,
        activities: [
          { type: "wildlife", description: "Visit Welsh Wildlife Centre, Teifi Marshes – trails, visitor centre", mapsUrl: "https://maps.google.com/maps?q=Welsh+Wildlife+Centre+Teifi+Marshes" },
          { type: "castle", description: "Explore Cilgerran Castle", mapsUrl: "https://maps.google.com/maps?q=Cilgerran+Castle" }
        ],
        dining: [
          { type: "lunch", name: "Crowes Café", location: "Cardigan", description: "Local favorite" },
          { type: "dinner", name: "Bryn Berwyn Restaurant", location: "Cardigan", description: "modern countryside dining" }
        ]
      },
      {
        date: "Wednesday, 16 July",
        day: 16,
        title: "Rainy Day Retreat",
        weather: "Rain",
        temperature: 19,
        activities: [
          { type: "culture", description: "Browse Canfas Gallery and Custom House", mapsUrl: "https://maps.google.com/maps?q=Canfas+Gallery+Cardigan" },
          { type: "relaxation", description: "Warm up with a drink and books at Guildhall Market", mapsUrl: "https://maps.google.com/maps?q=Guildhall+Market+Cardigan" }
        ],
        dining: [
          { type: "lunch", name: "Crwst Bakery", location: "Cardigan", description: "Fresh baked goods" },
          { type: "dinner", name: "Fisherman's Rest", location: "Cardigan", description: "comfort food & seafood" }
        ]
      },
      {
        date: "Thursday, 17 July",
        day: 17,
        title: "Sand Dunes & Aberystwyth",
        weather: "Thunderstorms",
        temperature: 20,
        activities: [
          { type: "nature", description: "Walk the boardwalk at Ynyslas Sand Dunes", mapsUrl: "https://maps.google.com/maps?q=Ynyslas+Sand+Dunes" },
          { type: "attraction", description: "Ride the Aberystwyth Cliff Railway", mapsUrl: "https://maps.google.com/maps?q=Aberystwyth+Cliff+Railway" }
        ],
        dining: [
          { type: "lunch", name: "The Glengower Hotel", location: "Aberystwyth seafront", description: "Seafront dining" },
          { type: "dinner", name: "Harbourmaster Hotel", location: "Aberaeron", description: "Premium seafood dining" }
        ]
      },
      {
        date: "Friday, 18 July",
        day: 18,
        title: "Departure Day",
        weather: "Showers early",
        temperature: 20,
        activities: [
          { type: "beach", description: "One last morning visit to Penbryn Beach or Aberporth Beach", mapsUrl: "https://maps.google.com/maps?q=Penbryn+Beach" }
        ],
        dining: [
          { type: "lunch", name: "Bay View Hotel Restaurant", location: "Aberporth", description: "Farewell meal with coastal views" }
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
      { name: "The Ship Inn", category: "seafood", location: "Tresaith", description: "Great seafood pub with sea views", mealType: "dinner" },
      { name: "Fisherman's Rest", category: "seafood", location: "Cardigan", description: "Comfort food & fresh seafood", mealType: "dinner" },
      { name: "Harbourmaster Hotel", category: "seafood", location: "Aberaeron", description: "Premium seafood dining", mealType: "dinner" },
      { name: "Crwst Café", category: "cafe", location: "Cardigan", description: "Award-winning brunch & doughnuts", mealType: "lunch" },
      { name: "Caffi Penbryn", category: "cafe", location: "Penbryn", description: "National Trust café with coastal views", mealType: "lunch" },
      { name: "Crowes Café", category: "cafe", location: "Cardigan", description: "Local favorite", mealType: "lunch" },
      { name: "Yr Hen Printworks", category: "fine-dining", location: "Cardigan", description: "Small plates & creative mains", mealType: "dinner" },
      { name: "1176 Restaurant", category: "fine-dining", location: "Cardigan Castle", description: "Historic castle dining", mealType: "lunch" },
      { name: "Bryn Berwyn Restaurant", category: "fine-dining", location: "Cardigan", description: "Modern countryside dining", mealType: "dinner" },
      { name: "Pizzatipi", category: "casual", location: "Cardigan", description: "Wood-fired pizzas", mealType: "dinner" },
      { name: "The Copper Pot", category: "casual", location: "Cardigan", description: "Traditional pub fare", mealType: "dinner" },
      { name: "Crwst Bakery", category: "casual", location: "Cardigan", description: "Fresh baked goods & light meals", mealType: "lunch" },
      { name: "The Glengower Hotel", category: "hotel", location: "Aberystwyth", description: "Seafront dining", mealType: "lunch" },
      { name: "Bay View Hotel Restaurant", category: "hotel", location: "Aberporth", description: "Coastal views", mealType: "lunch" }
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
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant: Restaurant = { ...insertRestaurant, id };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }
}

export const storage = new MemStorage();
