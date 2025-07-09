import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ItineraryCard } from "@/components/ItineraryCard";
import { LocationCard } from "@/components/LocationCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import { HomebaseCard } from "@/components/HomebaseCard";
import { WeatherCard } from "@/components/WeatherCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ItineraryDay, Location, Restaurant } from "@shared/schema";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("itinerary");

  const { data: itinerary, isLoading: itineraryLoading } = useQuery<ItineraryDay[]>({
    queryKey: ["/api/itinerary"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: restaurants, isLoading: restaurantsLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  const groupLocationsByCategory = (locations: Location[] | undefined) => {
    if (!locations) return {};
    return locations.reduce((acc, location) => {
      if (!acc[location.category]) acc[location.category] = [];
      acc[location.category].push(location);
      return acc;
    }, {} as Record<string, Location[]>);
  };

  const groupRestaurantsByCategory = (restaurants: Restaurant[] | undefined) => {
    if (!restaurants) return {};
    return restaurants.reduce((acc, restaurant) => {
      if (!acc[restaurant.category]) acc[restaurant.category] = [];
      acc[restaurant.category].push(restaurant);
      return acc;
    }, {} as Record<string, Restaurant[]>);
  };

  const renderItinerary = () => {
    if (itineraryLoading) {
      return (
        <div className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {itinerary?.map((day) => (
          <ItineraryCard key={day.id} day={day} />
        ))}
      </div>
    );
  };

  const renderLocations = () => {
    if (locationsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    const groupedLocations = groupLocationsByCategory(locations);
    
    const categoryTitles = {
      beach: "Beaches",
      historic: "Historic Sites",
      nature: "Nature & Wildlife",
      town: "Towns & Attractions"
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedLocations).map(([category, categoryLocations]) => (
          <Card key={category} className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover-lift animate-fade-in">
            <CardContent className="p-0">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground dark:text-white">
                  {categoryTitles[category as keyof typeof categoryTitles] || category}
                </h3>
              </div>
              <div className="space-y-3">
                {categoryLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRestaurants = () => {
    if (restaurantsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    const groupedRestaurants = groupRestaurantsByCategory(restaurants);
    
    const categoryTitles = {
      seafood: "Seafood",
      cafe: "Cafés & Bakeries",
      "fine-dining": "Fine Dining",
      casual: "Casual Dining",
      hotel: "Hotel Dining",
      specialty: "Local Specialties"
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedRestaurants).map(([category, categoryRestaurants]) => (
          <Card key={category} className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover-lift animate-fade-in">
            <CardContent className="p-0">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground dark:text-white">
                  {categoryTitles[category as keyof typeof categoryTitles] || category}
                </h3>
              </div>
              <div className="space-y-4">
                {categoryRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'itinerary':
        return {
          title: 'Holiday Itinerary',
          subtitle: 'Your complete Wales adventure guide'
        };
      case 'locations':
        return {
          title: 'Key Locations',
          subtitle: 'Explore the beautiful destinations on your journey'
        };
      case 'restaurants':
        return {
          title: 'Restaurants & Dining',
          subtitle: 'Discover amazing local cuisine throughout your journey'
        };
      case 'homebase':
        return {
          title: 'Homebase Navigation',
          subtitle: 'Your accommodation hub and nearby attractions'
        };
      case 'weather':
        return {
          title: 'Weather Forecast',
          subtitle: 'Daily weather conditions for your Wales adventure'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to your Wales holiday planner'
        };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'itinerary':
        return renderItinerary();
      case 'locations':
        return renderLocations();
      case 'restaurants':
        return renderRestaurants();
      case 'homebase':
        return <HomebaseCard />;
      case 'weather':
        return <WeatherCard />;
      default:
        return renderItinerary();
    }
  };

  const { title, subtitle } = getSectionTitle();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 text-foreground dark:text-white hover-scale">
                {title}
              </h2>
              <p className="text-lg font-semibold bg-gradient-to-r from-osu-purple to-osu-pink bg-clip-text text-transparent animate-fade-in">
                {subtitle}
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
