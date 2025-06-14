
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Droplets, Moon, Activity, TrendingUp, Target } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';
import HealthLogger from './HealthLogger';

const HealthAssistant = ({ onBack }: { onBack: () => void }) => {
  const { getTotalForToday, getTodaysData, loading } = useHealthData();

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

  // For heart rate, get the latest reading
  const heartRateEntries = getTodaysData('heart_rate');
  const latestHeartRate = heartRateEntries.length > 0 ? heartRateEntries[0].value || 0 : 0;

  const healthStats = [
    { 
      label: "Water Intake", 
      value: `${waterIntake} of ${waterGoal}`, 
      progress: waterProgress, 
      icon: Droplets, 
      color: "blue",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Sleep Hours", 
      value: `${sleepHours}h of ${sleepGoal}h`, 
      progress: sleepProgress, 
      icon: Moon, 
      color: "purple",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-indigo-500"
    },
    { 
      label: "Exercise Today", 
      value: `${exerciseMinutes} of ${exerciseGoal} min`, 
      progress: exerciseProgress, 
      icon: Activity, 
      color: "green",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      label: "Heart Rate", 
      value: latestHeartRate > 0 ? `${latestHeartRate} bpm` : "No data", 
      progress: latestHeartRate > 0 ? 85 : 0, 
      icon: Heart, 
      color: "red",
      bgColor: "bg-red-50",
      gradient: "from-red-500 to-pink-500"
    }
  ];

  const healthTips = [
    { icon: "💧", tip: "Drink a glass of water now to stay hydrated", action: "water" },
    { icon: "🚶‍♀️", tip: "Take a 5-minute walk to boost energy", action: "exercise" },
    { icon: "🧘‍♂️", tip: "Try deep breathing for stress relief", action: "mindfulness" },
    { icon: "🥗", tip: "Add some vegetables to your next meal", action: "nutrition" }
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
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span>Health Assistant</span>
            </h1>
            <p className="text-gray-600 ml-13">Track your wellness journey</p>
          </div>
        </div>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {healthStats.map((stat, index) => (
            <Card key={stat.label} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.bgColor} relative overflow-hidden group`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className={`w-full h-full bg-gradient-to-r ${stat.gradient}`}></div>
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-800 mb-3">
                  {stat.value}
                </div>
                <div className="space-y-2">
                  <Progress value={stat.progress} className="h-3" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{Math.round(stat.progress)}% of daily goal</p>
                    {stat.progress >= 100 && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                        Goal reached! 🎉
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Logger */}
        <div className="mb-8">
          <HealthLogger />
        </div>

        {/* Health Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-gray-700" />
              <CardTitle className="text-lg font-semibold text-gray-800">Today's Health Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthTips.map((tip, index) => (
                <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105 group">
                  <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">{tip.icon}</span>
                  <span className="text-sm text-gray-700 font-medium">{tip.tip}</span>
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
