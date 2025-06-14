
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Droplets, Moon, Activity } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';
import HealthLogger from './HealthLogger';

const HealthAssistant = ({ onBack }: { onBack: () => void }) => {
  const { getTotalForToday, loading } = useHealthData();

  // Calculate real-time health stats
  const waterIntake = getTotalForToday('water');
  const waterGoal = 8;
  const waterProgress = Math.min((waterIntake / waterGoal) * 100, 100);

  const sleepHours = getTotalForToday('sleep');
  const sleepGoal = 8;
  const sleepProgress = Math.min((sleepHours / sleepGoal) * 100, 100);

  const exerciseMinutes = getTotalForToday('exercise');
  const exerciseGoal = 30;
  const exerciseProgress = Math.min((exerciseMinutes / exerciseGoal) * 100, 100);

  // For heart rate, we'll show the latest reading instead of total
  const heartRateEntries = getTotalForToday('heart_rate');
  const latestHeartRate = heartRateEntries || 0;

  const healthStats = [
    { 
      label: "Water Intake", 
      value: `${waterIntake} of ${waterGoal}`, 
      progress: waterProgress, 
      icon: Droplets, 
      color: "blue" 
    },
    { 
      label: "Sleep Hours", 
      value: `${sleepHours}h`, 
      progress: sleepProgress, 
      icon: Moon, 
      color: "purple" 
    },
    { 
      label: "Exercise Today", 
      value: `${exerciseMinutes} min`, 
      progress: exerciseProgress, 
      icon: Activity, 
      color: "green" 
    },
    { 
      label: "Heart Rate", 
      value: latestHeartRate > 0 ? `${latestHeartRate} bpm` : "No data", 
      progress: latestHeartRate > 0 ? 85 : 0, 
      icon: Heart, 
      color: "red" 
    }
  ];

  const healthTips = [
    "💧 Drink a glass of water now to stay hydrated",
    "🚶‍♀️ Take a 5-minute walk to boost energy",
    "🧘‍♂️ Try deep breathing for stress relief",
    "🥗 Add some vegetables to your next meal"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Health Assistant</h1>
            <p className="text-gray-600">Track your wellness journey</p>
          </div>
        </div>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {healthStats.map((stat, index) => (
            <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-full bg-${stat.color}-500 flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{Math.round(stat.progress)}% of daily goal</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Logger */}
        <div className="mb-8">
          <HealthLogger />
        </div>

        {/* Health Tips */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Today's Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.map((tip, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthAssistant;
