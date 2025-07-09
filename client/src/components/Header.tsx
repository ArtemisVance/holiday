import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, MapPin } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="osu-gradient w-10 h-10 rounded-full flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-osu-pink to-osu-blue bg-clip-text text-transparent">
                Wales Holiday
              </h1>
              <p className="text-sm opacity-70">July 11-18, 2024</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="glass-effect hover:bg-osu-pink hover:text-white transition-all rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
