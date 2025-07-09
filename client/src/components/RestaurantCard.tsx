import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Fish, Utensils, Pizza, Bed, Heart } from "lucide-react";
import type { Restaurant } from "@shared/schema";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'seafood': return <Fish className="text-osu-blue" size={24} />;
    case 'cafe': return <Coffee className="text-osu-purple" size={24} />;
    case 'fine-dining': return <Utensils className="text-osu-pink" size={24} />;
    case 'casual': return <Pizza className="text-osu-blue" size={24} />;
    case 'hotel': return <Bed className="text-osu-purple" size={24} />;
    default: return <Heart className="text-osu-pink" size={24} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'seafood': return 'border-osu-blue';
    case 'cafe': return 'border-osu-purple';
    case 'fine-dining': return 'border-osu-pink';
    case 'casual': return 'border-osu-blue';
    case 'hotel': return 'border-osu-purple';
    default: return 'border-osu-pink';
  }
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className={`border-l-4 ${getCategoryColor(restaurant.category)} pl-4 py-2`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getCategoryIcon(restaurant.category)}
          <div className="flex-1">
            <h4 className="font-medium">{restaurant.name}</h4>
            <p className="text-sm opacity-70">{restaurant.location}</p>
            {restaurant.description && (
              <p className="text-sm opacity-70">{restaurant.description}</p>
            )}
            {restaurant.mealType && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {restaurant.mealType}
              </Badge>
            )}
          </div>
        </div>
        {restaurant.mapsUrl && (
          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-osu-pink hover:text-osu-blue transition-colors ml-2"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
