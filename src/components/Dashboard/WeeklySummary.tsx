
import GlassCard from "@/components/ui-custom/GlassCard";
import { HealthLog, WeeklySummary as WeeklySummaryType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Activity, Calendar, CheckCircle2, Clock } from "lucide-react";

interface WeeklySummaryProps {
  summary: WeeklySummaryType;
  recentLogs: HealthLog[];
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary, recentLogs }) => {
  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Get most recent exercise and food log
  const latestExercise = recentLogs.find(log => log.category === 'exercise');
  const latestFood = recentLogs.find(log => log.category === 'food');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-medium tracking-tight">Weekly Summary</h2>
        <p className="text-muted-foreground flex items-center mt-1">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDateRange(summary.startDate, summary.endDate)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard animationDelay={0} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Exercise Sessions</h3>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex items-end">
            <div className="text-3xl font-bold">{summary.exerciseCount}</div>
            <div className="text-muted-foreground ml-1 mb-1 text-sm">/ week</div>
          </div>
        </GlassCard>

        <GlassCard animationDelay={1} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Avg. Duration</h3>
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex items-end">
            <div className="text-3xl font-bold">{summary.averageExerciseDuration.toFixed(0)}</div>
            <div className="text-muted-foreground ml-1 mb-1 text-sm">mins</div>
          </div>
        </GlassCard>

        <GlassCard animationDelay={2} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Food Logs</h3>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex items-end">
            <div className="text-3xl font-bold">{summary.foodLogCount}</div>
            <div className="text-muted-foreground ml-1 mb-1 text-sm">/ week</div>
          </div>
        </GlassCard>

        <GlassCard animationDelay={3} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Exercise Types</h3>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="space-y-1.5">
              {Object.entries(summary.exerciseTypes).map(([type, count], index) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type}</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    index % 4 === 0 ? "bg-blue-100 text-blue-700" :
                    index % 4 === 1 ? "bg-green-100 text-green-700" :
                    index % 4 === 2 ? "bg-purple-100 text-purple-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <h3 className="text-xl font-medium mt-8">Recent Activity</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latestExercise && (
          <GlassCard animationDelay={4} className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                Latest Exercise
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(latestExercise.timestamp).toLocaleString('en-US', { 
                  hour: 'numeric', 
                  minute: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className="text-sm text-balance">{latestExercise.rawMessage}</p>
            <div className="flex space-x-3 text-xs">
              {latestExercise.processed.exercise?.duration && (
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {latestExercise.processed.exercise.duration} mins
                </div>
              )}
              {latestExercise.processed.exercise?.type && (
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full capitalize">
                  {latestExercise.processed.exercise.type}
                </div>
              )}
              {latestExercise.processed.exercise?.distance && (
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {latestExercise.processed.exercise.distance} miles
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {latestFood && (
          <GlassCard animationDelay={5} className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                Latest Food Log
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(latestFood.timestamp).toLocaleString('en-US', { 
                  hour: 'numeric', 
                  minute: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className="text-sm text-balance">{latestFood.rawMessage}</p>
            {latestFood.processed.food?.description && (
              <div className="flex text-xs">
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full capitalize">
                  {latestFood.processed.food.description}
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default WeeklySummary;
