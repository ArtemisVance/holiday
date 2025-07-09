import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Utensils } from "lucide-react";

type SidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "itinerary", icon: Calendar, label: "Itinerary", gradient: "from-osu-pink to-osu-blue" },
    { id: "locations", icon: MapPin, label: "Locations", gradient: "from-osu-blue to-osu-purple" },
    { id: "restaurants", icon: Utensils, label: "Restaurants", gradient: "from-osu-purple to-osu-pink" }
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-card p-6 rounded-2xl shadow-lg sticky top-24">
        <h2 className="text-xl font-semibold mb-6 text-center">Dashboard</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full p-4 rounded-xl font-medium transition-all hover:shadow-lg hover:scale-105 ${
                activeSection === item.id
                  ? `osu-gradient text-white`
                  : `text-foreground hover:bg-osu-blue hover:text-white`
              }`}
            >
              <item.icon className="mr-3" size={18} />
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="mt-8 p-4 glass-effect rounded-xl">
          <h3 className="font-semibold mb-3 text-center">Weather Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Avg Temp:</span>
              <span className="text-osu-blue">23°C</span>
            </div>
            <div className="flex justify-between">
              <span>Sunny Days:</span>
              <span className="text-osu-purple">4/8</span>
            </div>
            <div className="flex justify-between">
              <span>Rain Days:</span>
              <span className="text-osu-pink">3/8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
