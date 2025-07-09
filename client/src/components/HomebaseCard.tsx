import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Home, Navigation, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ItineraryDay } from "@shared/schema";

const HOMEBASE = {
  name: "Gwalia Falls Caravan Park",
  address: "Tresaith SA43 2JL",
  mapsUrl: "https://maps.google.com/maps?q=Gwalia+Falls+Caravan+Park+Tresaith+SA43+2JL"
};

export function HomebaseCard() {
  const { data: itinerary } = useQuery<ItineraryDay[]>({
    queryKey: ["/api/itinerary"],
  });

  const today = new Date();
  const currentDay = itinerary?.find(day => {
    const dayDate = new Date(2024, 6, day.day); // July 2024
    return dayDate.toDateString() === today.toDateString();
  });

  const getTodaysDestinations = () => {
    if (!currentDay) return [];
    const activities = Array.isArray(currentDay.activities) ? currentDay.activities : [];
    return activities.filter((activity: any) => activity.mapsUrl).slice(0, 3);
  };

  const generateDirectionsUrl = (destination: string) => {
    return `https://maps.google.com/maps/dir/${encodeURIComponent(HOMEBASE.address)}/${encodeURIComponent(destination)}`;
  };

  const generateExploreUrl = () => {
    return `https://maps.google.com/maps/search/things+to+do+near+${encodeURIComponent(HOMEBASE.address)}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
        <CardContent className="p-0">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 osu-gradient rounded-full flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Your Homebase</h3>
              <p className="text-sm opacity-70">Your holiday retreat</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="text-osu-pink mt-1" size={18} />
              <div>
                <p className="font-medium">{HOMEBASE.name}</p>
                <p className="text-sm opacity-70">{HOMEBASE.address}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-osu-blue hover:text-white"
              >
                <a href={HOMEBASE.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={16} className="mr-2" />
                  View Location
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-osu-purple hover:text-white"
              >
                <a href={generateExploreUrl()} target="_blank" rel="noopener noreferrer">
                  <Navigation size={16} className="mr-2" />
                  Explore Nearby
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentDay && (
        <Card className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-osu-pink rounded-full flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Today's Plan</h3>
                <p className="text-sm opacity-70">{currentDay.title}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {getTodaysDestinations().map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.description}</p>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hover:bg-osu-blue hover:text-white"
                  >
                    <a
                      href={generateDirectionsUrl(activity.description)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation size={16} className="mr-1" />
                      Directions
                    </a>
                  </Button>
                </div>
              ))}
              
              {getTodaysDestinations().length === 0 && (
                <p className="text-center text-sm opacity-70 py-4">
                  No activities planned for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}