import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Utensils, Sun, CloudRain, Cloud, Zap } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";

type ItineraryCardProps = {
  day: ItineraryDay;
};

const getWeatherIcon = (weather: string) => {
  if (weather.includes("Sunny") || weather.includes("Hot")) return <Sun className="text-yellow-500" size={24} />;
  if (weather.includes("Rain") || weather.includes("Showers")) return <CloudRain className="text-gray-500" size={24} />;
  if (weather.includes("Thunder")) return <Zap className="text-yellow-600" size={24} />;
  return <Cloud className="text-gray-400" size={24} />;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'arrival': return '🏠';
    case 'beach': return '🏖️';
    case 'tour': return '🛥️';
    case 'hiking': return '🥾';
    case 'castle': return '🏰';
    case 'culture': return '🎭';
    case 'wildlife': return '🦌';
    case 'farm': return '🚜';
    case 'nature': return '🌿';
    case 'attraction': return '🎢';
    case 'relaxation': return '☕';
    default: return '📍';
  }
};

export function ItineraryCard({ day }: ItineraryCardProps) {
  const activities = Array.isArray(day.activities) ? day.activities : [];
  const dining = Array.isArray(day.dining) ? day.dining : [];

  return (
    <Card className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all animate-fade-in hover-lift">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 osu-gradient rounded-full flex items-center justify-center text-white font-bold animate-bounce-subtle hover-scale">
              {day.day - 10}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{day.date}</h3>
              <p className="text-sm opacity-70">{day.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="weather-icon">
              {getWeatherIcon(day.weather)}
            </div>
            <span className="text-lg font-medium">{day.temperature}°C</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity: any, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-lg mt-1">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                {activity.mapsUrl && (
                  <a
                    href={activity.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-osu-blue hover:text-osu-pink transition-colors text-sm inline-flex items-center gap-1"
                  >
                    <MapPin size={14} />
                    View on Maps
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
          
          {dining.length > 0 && (
            <div className="flex items-start space-x-3">
              <Utensils className="text-osu-purple mt-1" size={18} />
              <div className="flex-1">
                <p className="font-medium">Dining</p>
                <div className="text-sm opacity-70">
                  {dining.map((meal: any, index: number) => (
                    <div key={index} className="mb-1">
                      <span className="capitalize font-medium">{meal.type}: </span>
                      <span>{meal.name}</span>
                      {meal.description && <span className="text-osu-blue"> - {meal.description}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
