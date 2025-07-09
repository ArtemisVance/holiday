import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  Circle, 
  MapPin, 
  Calendar, 
  Utensils, 
  Camera, 
  Star,
  Trophy,
  Route
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { TravelProgress } from "@shared/schema";

const getMilestoneIcon = (icon: string) => {
  switch (icon) {
    case 'map': return <MapPin className="text-osu-blue" size={20} />;
    case 'calendar': return <Calendar className="text-osu-pink" size={20} />;
    case 'utensils': return <Utensils className="text-osu-purple" size={20} />;
    case 'camera': return <Camera className="text-osu-blue" size={20} />;
    case 'star': return <Star className="text-osu-pink" size={20} />;
    case 'trophy': return <Trophy className="text-osu-purple" size={20} />;
    case 'route': return <Route className="text-osu-blue" size={20} />;
    default: return <Circle className="text-osu-pink" size={20} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'planning': return 'bg-osu-pink/10 text-osu-pink border-osu-pink/20';
    case 'travel': return 'bg-osu-blue/10 text-osu-blue border-osu-blue/20';
    case 'activities': return 'bg-osu-purple/10 text-osu-purple border-osu-purple/20';
    case 'dining': return 'bg-osu-pink/10 text-osu-pink border-osu-pink/20';
    default: return 'bg-osu-blue/10 text-osu-blue border-osu-blue/20';
  }
};

export function TravelProgressTracker() {
  const queryClient = useQueryClient();
  
  const { data: milestones, isLoading } = useQuery<TravelProgress[]>({
    queryKey: ["/api/travel-progress"],
  });

  const toggleMilestoneMutation = useMutation({
    mutationFn: async (milestone: TravelProgress) => {
      const newStatus = milestone.isCompleted === "true" ? "false" : "true";
      return await apiRequest(`/api/travel-progress/${milestone.id}`, {
        method: "PATCH",
        body: JSON.stringify({ 
          isCompleted: newStatus,
          completedAt: newStatus === "true" ? new Date().toISOString() : null
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travel-progress"] });
    },
  });

  const handleToggleMilestone = (milestone: TravelProgress) => {
    toggleMilestoneMutation.mutate(milestone);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card p-6 rounded-2xl">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-6" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const completedMilestones = milestones?.filter(m => m.isCompleted === "true").length || 0;
  const totalMilestones = milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const groupedMilestones = milestones?.reduce((acc, milestone) => {
    if (!acc[milestone.category]) acc[milestone.category] = [];
    acc[milestone.category].push(milestone);
    return acc;
  }, {} as Record<string, TravelProgress[]>) || {};

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-card p-6 rounded-2xl shadow-lg hover-lift animate-fade-in">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground dark:text-white">
                Travel Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedMilestones} of {totalMilestones} milestones completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-osu-pink">
                {Math.round(progressPercentage)}%
              </div>
              <Badge variant="secondary" className="bg-osu-pink/10 text-osu-pink border-osu-pink/20">
                <Trophy className="mr-1" size={12} />
                {completedMilestones} Complete
              </Badge>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3 mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(groupedMilestones).map(([category, categoryMilestones]) => {
              const completed = categoryMilestones.filter(m => m.isCompleted === "true").length;
              const total = categoryMilestones.length;
              return (
                <div key={category} className="text-center">
                  <div className="text-lg font-semibold text-foreground">
                    {completed}/{total}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {category}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedMilestones).map(([category, categoryMilestones]) => (
          <Card key={category} className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover-lift animate-slide-up">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-foreground dark:text-white capitalize">
                  {category}
                </h4>
                <Badge variant="secondary" className={getCategoryColor(category)}>
                  {categoryMilestones.filter(m => m.isCompleted === "true").length} / {categoryMilestones.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {categoryMilestones
                  .sort((a, b) => a.order - b.order)
                  .map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleMilestone(milestone);
                        }}
                        className="p-1 h-auto hover:bg-transparent focus:outline-none transition-colors"
                        disabled={toggleMilestoneMutation.isPending}
                      >
                        {milestone.isCompleted === "true" ? (
                          <CheckCircle className="text-green-500 animate-bounce-subtle" size={24} />
                        ) : (
                          <Circle className="text-muted-foreground hover:text-osu-pink transition-colors cursor-pointer" size={24} />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2 flex-1">
                        {getMilestoneIcon(milestone.icon)}
                        <div className="flex-1">
                          <div className={`font-medium ${milestone.isCompleted === "true" ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {milestone.name}
                          </div>
                          {milestone.description && (
                            <div className="text-xs text-muted-foreground">
                              {milestone.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {milestone.day && (
                        <Badge variant="outline" className="text-xs">
                          Day {milestone.day - 10}
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}