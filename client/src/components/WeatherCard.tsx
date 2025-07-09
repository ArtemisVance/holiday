import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, CloudRain, Cloud, Zap, Thermometer, Droplets, Wind } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ItineraryDay } from "@shared/schema";

const getWeatherIcon = (weather: string) => {
  if (weather.includes("Sunny") || weather.includes("Hot")) return <Sun className="text-yellow-500" size={32} />;
  if (weather.includes("Rain") || weather.includes("Showers")) return <CloudRain className="text-blue-500" size={32} />;
  if (weather.includes("Thunder")) return <Zap className="text-yellow-600" size={32} />;
  return <Cloud className="text-gray-400" size={32} />;
};

const getWeatherColor = (weather: string) => {
  if (weather.includes("Sunny") || weather.includes("Hot")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (weather.includes("Rain") || weather.includes("Showers")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (weather.includes("Thunder")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
};

const getTemperatureColor = (temp: number) => {
  if (temp >= 25) return "text-red-500";
  if (temp >= 20) return "text-orange-500";
  if (temp >= 15) return "text-yellow-500";
  return "text-blue-500";
};

const getWeatherAdvice = (weather: string, temp: number) => {
  if (weather.includes("Thunder")) return "⚡ Stay indoors, perfect for cozy activities";
  if (weather.includes("Rain") || weather.includes("Showers")) return "☔ Pack an umbrella and waterproof jacket";
  if (temp >= 28) return "🌡️ Very hot! Stay hydrated and use sun protection";
  if (temp >= 25) return "☀️ Perfect beach weather! Don't forget sunscreen";
  if (temp < 20) return "🧥 Cooler day, bring layers and a light jacket";
  return "🌤️ Pleasant weather for outdoor activities";
};

export function WeatherCard() {
  const { data: itinerary, isLoading } = useQuery<ItineraryDay[]>({
    queryKey: ["/api/itinerary"],
  });

  if (isLoading) {
    return (
      <Card className="bg-card p-6 rounded-2xl shadow-lg">
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherSummary = () => {
    if (!itinerary) return null;
    
    const temps = itinerary.map(day => day.temperature);
    const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    
    const sunnyDays = itinerary.filter(day => 
      day.weather.includes("Sunny") || day.weather.includes("Hot")
    ).length;
    
    const rainyDays = itinerary.filter(day => 
      day.weather.includes("Rain") || day.weather.includes("Showers")
    ).length;
    
    return { avgTemp, maxTemp, minTemp, sunnyDays, rainyDays };
  };

  const summary = getWeatherSummary();

  return (
    <div className="space-y-6">
      {/* Weather Summary */}
      {summary && (
        <Card className="bg-card p-6 rounded-2xl shadow-lg hover-lift animate-fade-in">
          <CardContent className="p-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-osu-blue rounded-full flex items-center justify-center animate-bounce-subtle hover-scale">
                <Thermometer className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Weather Summary</h3>
                <p className="text-sm opacity-70">8-day forecast overview</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-osu-blue">{summary.avgTemp}°C</div>
                <div className="text-sm opacity-70">Avg Temp</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-500">{summary.maxTemp}°C</div>
                <div className="text-sm opacity-70">Max Temp</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-osu-purple">{summary.sunnyDays}</div>
                <div className="text-sm opacity-70">Sunny Days</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-osu-pink">{summary.rainyDays}</div>
                <div className="text-sm opacity-70">Rainy Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Weather Details */}
      <div className="space-y-4">
        {itinerary?.map((day) => (
          <Card key={day.id} className="bg-card p-4 rounded-xl shadow-md hover:shadow-lg transition-all hover-lift animate-slide-up">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="weather-icon">
                    {getWeatherIcon(day.weather)}
                  </div>
                  <div>
                    <div className="font-semibold">{day.date}</div>
                    <div className="text-sm opacity-70">{day.title}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getTemperatureColor(day.temperature)}`}>
                    {day.temperature}°C
                  </div>
                  <Badge className={`text-xs ${getWeatherColor(day.weather)}`}>
                    {day.weather}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Wind className="text-osu-blue" size={16} />
                  <span className="text-sm opacity-80">
                    {getWeatherAdvice(day.weather, day.temperature)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}