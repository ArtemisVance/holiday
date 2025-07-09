import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Waves, Castle, Leaf, Building } from "lucide-react";
import type { Location } from "@shared/schema";

type LocationCardProps = {
  location: Location;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'beach': return <Waves className="text-osu-blue" size={24} />;
    case 'historic': return <Castle className="text-osu-purple" size={24} />;
    case 'nature': return <Leaf className="text-osu-blue" size={24} />;
    case 'town': return <Building className="text-osu-purple" size={24} />;
    default: return <MapPin className="text-osu-pink" size={24} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'beach': return 'border-osu-blue';
    case 'historic': return 'border-osu-purple';
    case 'nature': return 'border-osu-blue';
    case 'town': return 'border-osu-purple';
    default: return 'border-osu-pink';
  }
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className={`border-l-4 ${getCategoryColor(location.category)} pl-4 py-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(location.category)}
          <div>
            <h4 className="font-medium">{location.name}</h4>
            {location.description && (
              <p className="text-sm opacity-70">{location.description}</p>
            )}
          </div>
        </div>
        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-osu-pink hover:text-osu-blue transition-colors"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
