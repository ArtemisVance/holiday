import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Smile, 
  Meh, 
  Frown, 
  MapPin, 
  Edit3, 
  Save,
  X,
  Trash2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Location, LocationMoodRating } from "@shared/schema";

const getMoodIcon = (rating: string) => {
  switch (rating) {
    case 'good': return <Smile className="text-green-500" size={24} />;
    case 'okay': return <Meh className="text-yellow-500" size={24} />;
    case 'horrible': return <Frown className="text-red-500" size={24} />;
    default: return <Meh className="text-gray-400" size={24} />;
  }
};

const getMoodColor = (rating: string) => {
  switch (rating) {
    case 'good': return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200';
    case 'okay': return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200';
    case 'horrible': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200';
    default: return 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-200';
  }
};

export function LocationMoodBoard() {
  const queryClient = useQueryClient();
  const [draggedLocation, setDraggedLocation] = useState<Location | null>(null);
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const dragRef = useRef<HTMLDivElement>(null);

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: ratings, isLoading: ratingsLoading } = useQuery<LocationMoodRating[]>({
    queryKey: ["/api/mood-ratings"],
  });

  const createRatingMutation = useMutation({
    mutationFn: async (data: { locationId: number; locationName: string; rating: string; notes?: string }) => {
      return await apiRequest("/api/mood-ratings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-ratings"] });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: async (data: { id: number; rating?: string; notes?: string }) => {
      return await apiRequest(`/api/mood-ratings/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-ratings"] });
      setEditingRating(null);
      setEditNotes("");
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/mood-ratings/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-ratings"] });
    },
  });

  const handleDragStart = (e: React.DragEvent, location: Location) => {
    setDraggedLocation(location);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", location.id.toString());
  };

  const handleDragEnd = () => {
    setDraggedLocation(null);
  };

  const handleDrop = (e: React.DragEvent, rating: string) => {
    e.preventDefault();
    if (draggedLocation) {
      const existingRating = ratings?.find(r => r.locationId === draggedLocation.id);
      
      if (existingRating) {
        updateRatingMutation.mutate({
          id: existingRating.id,
          rating: rating,
        }).catch(error => {
          console.error('Failed to update rating:', error);
        });
      } else {
        createRatingMutation.mutate({
          locationId: draggedLocation.id,
          locationName: draggedLocation.name,
          rating: rating,
        }).catch(error => {
          console.error('Failed to create rating:', error);
        });
      }
    }
    setDraggedLocation(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleEditNotes = (ratingId: number, currentNotes: string) => {
    setEditingRating(ratingId);
    setEditNotes(currentNotes || "");
  };

  const handleSaveNotes = () => {
    if (editingRating) {
      updateRatingMutation.mutate({
        id: editingRating,
        notes: editNotes,
      }).catch(error => {
        console.error('Failed to save notes:', error);
      });
    }
  };

  const handleDeleteRating = (id: number) => {
    deleteRatingMutation.mutate(id).catch(error => {
      console.error('Failed to delete rating:', error);
    });
  };

  if (locationsLoading || ratingsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card p-6 rounded-2xl">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  const unratedLocations = locations?.filter(location => 
    !ratings?.some(rating => rating.locationId === location.id)
  ) || [];

  const ratedLocations = {
    good: ratings?.filter(r => r.rating === 'good') || [],
    okay: ratings?.filter(r => r.rating === 'okay') || [],
    horrible: ratings?.filter(r => r.rating === 'horrible') || [],
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="bg-card p-6 rounded-2xl shadow-lg hover-lift animate-fade-in">
        <CardContent className="p-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-osu-pink rounded-full flex items-center justify-center animate-bounce-subtle">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground dark:text-white">
                Location Mood Board
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag locations to rate them or click on rated locations to add notes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unrated Locations */}
      <Card className="bg-card p-6 rounded-2xl shadow-lg hover-lift animate-slide-up">
        <CardContent className="p-0">
          <h4 className="text-lg font-semibold text-foreground dark:text-white mb-4">
            Unrated Locations
          </h4>
          <div className="flex flex-wrap gap-3">
            {unratedLocations.map((location) => (
              <div
                key={location.id}
                draggable
                onDragStart={(e) => handleDragStart(e, location)}
                onDragEnd={handleDragEnd}
                className="flex items-center space-x-2 bg-background/50 hover:bg-background/70 p-3 rounded-lg border border-dashed border-muted-foreground cursor-move hover:border-osu-pink transition-all hover-scale select-none"
              >
                <MapPin className="text-osu-blue" size={16} />
                <span className="text-sm font-medium text-foreground">{location.name}</span>
              </div>
            ))}
            {unratedLocations.length === 0 && (
              <p className="text-muted-foreground text-sm">All locations have been rated!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mood Rating Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([
          { key: 'good', title: 'Good', icon: 'good', color: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700' },
          { key: 'okay', title: 'Okay', icon: 'okay', color: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700' },
          { key: 'horrible', title: 'Horrible', icon: 'horrible', color: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700' },
        ] as const).map(({ key, title, icon, color }) => (
          <Card
            key={key}
            className={`bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 ${color} hover-lift animate-fade-in`}
            onDrop={(e) => handleDrop(e, key)}
            onDragOver={handleDragOver}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getMoodIcon(icon)}
                  <h4 className="text-lg font-semibold text-foreground dark:text-white">
                    {title}
                  </h4>
                </div>
                <Badge variant="secondary" className={getMoodColor(key)}>
                  {ratedLocations[key].length}
                </Badge>
              </div>
              
              <div className="space-y-3 min-h-[100px]">
                {ratedLocations[key].map((rating) => (
                  <div
                    key={rating.id}
                    className="flex items-start justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="text-osu-blue" size={14} />
                        <span className="font-medium text-foreground text-sm">
                          {rating.locationName}
                        </span>
                      </div>
                      
                      {editingRating === rating.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add your notes about this location..."
                            className="text-xs"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={handleSaveNotes}
                              disabled={updateRatingMutation.isPending}
                              className="text-xs"
                            >
                              <Save size={12} className="mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRating(null)}
                              className="text-xs"
                            >
                              <X size={12} className="mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {rating.notes && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {rating.notes}
                            </p>
                          )}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditNotes(rating.id, rating.notes || "")}
                              className="text-xs p-1 h-auto"
                            >
                              <Edit3 size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRating(rating.id)}
                              className="text-xs p-1 h-auto text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {ratedLocations[key].length === 0 && (
                  <div className="flex items-center justify-center h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      Drop locations here to rate them as "{title}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}