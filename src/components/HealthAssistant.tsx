
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Droplets, Moon, Activity } from "lucide-react";

const HealthAssistant = ({ onBack }: { onBack: () => void }) => {
  const healthStats = [
    { label: "Water Intake", value: "6 of 8", progress: 75, icon: Droplets, color: "blue" },
    { label: "Sleep Quality", value: "6h 30m", progress: 80, icon: Moon, color: "purple" },
    { label: "Steps Today", value: "7,500", progress: 60, icon: Activity, color: "green" },
    { label: "Heart Rate", value: "72 bpm", progress: 85, icon: Heart, color: "red" }
  ];

  const healthTips = [
    "💧 Drink a glass of water now to stay hydrated",
    "🚶‍♀️ Take a 5-minute walk to boost energy",
    "🧘‍♂️ Try deep breathing for stress relief",
    "🥗 Add some vegetables to your next meal"
  ];

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
                <p className="text-xs text-gray-500 mt-1">{stat.progress}% of daily goal</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Droplets className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-sm">Water</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Moon className="w-5 h-5 mb-1 text-purple-500" />
                <span className="text-sm">Sleep</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Activity className="w-5 h-5 mb-1 text-green-500" />
                <span className="text-sm">Exercise</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Heart className="w-5 h-5 mb-1 text-red-500" />
                <span className="text-sm">Mood</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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
