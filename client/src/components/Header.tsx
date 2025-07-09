import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, MapPin, Calendar, Clock, Waves } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="osu-gradient w-12 h-12 rounded-full flex items-center justify-center animate-float hover-glow">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground dark:text-white hover-scale mb-2">
                Wales Holiday Adventure
              </h1>
              <p className="text-lg font-semibold bg-gradient-to-r from-osu-purple to-osu-pink bg-clip-text text-transparent mb-3">
                Your complete Wales adventure guide
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm">
                  <Calendar className="text-osu-blue" size={14} />
                  <span className="font-medium text-foreground">July 11-18, 2024</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-osu-pink/10 text-osu-pink border-osu-pink/20">
                  <Waves className="mr-1" size={12} />
                  8 Days
                </Badge>
                <Badge variant="secondary" className="text-xs bg-osu-blue/10 text-osu-blue border-osu-blue/20">
                  <Clock className="mr-1" size={12} />
                  Active
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Staying at:</span>
              <span className="font-medium text-foreground">Gwalia Falls, Tresaith</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="glass-effect hover:bg-osu-pink hover:text-white transition-all rounded-full hover-scale"
            >
              {theme === "dark" ? (
                <Sun size={18} className="animate-bounce-subtle" />
              ) : (
                <Moon size={18} className="animate-pulse-slow" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
