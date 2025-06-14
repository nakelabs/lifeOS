import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, DollarSign, BookOpen, Brain, MessageCircle, Settings, TrendingUp, Moon, Droplets, User, Sparkles, Target, Activity, Zap, PenTool } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';
import { useHealthGoals } from '@/hooks/useHealthGoals';

const Dashboard = ({ userName = "Friend", onNavigate }: { userName?: string, onNavigate: (section: string) => void }) => {
  const { getTotalForToday, loading: healthLoading } = useHealthData();
  const { goals, loading: goalsLoading } = useHealthGoals();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get real health data with personalized goals
  const waterIntake = getTotalForToday('water');
  const waterGoal = goals.water_goal;
  const sleepHours = getTotalForToday('sleep');
  const sleepGoal = goals.sleep_goal;
  const exerciseMinutes = getTotalForToday('exercise');
  const exerciseGoal = goals.exercise_goal;
  const heartRate = getTotalForToday('heart_rate');
  const heartRateTarget = goals.heart_rate_target;
  
  // ... keep existing code (summaryCards array)
  const summaryCards = [
    {
      title: "Water Intake",
      value: waterIntake > 0 ? `${waterIntake} glasses` : "No data",
      subtitle: waterIntake > 0 ? `${Math.max(0, waterGoal - waterIntake)} more to reach your goal! 💧` : "Start tracking your hydration",
      icon: Droplets,
      color: "from-blue-500 via-cyan-500 to-teal-500",
      bgAccent: "bg-blue-50",
      progress: Math.min((waterIntake / waterGoal) * 100, 100),
      action: () => onNavigate("health")
    },
    {
      title: "Sleep Tracker",
      value: sleepHours > 0 ? `${sleepHours}h` : "No data",
      subtitle: sleepHours > 0 ? (sleepHours >= sleepGoal * 0.9 ? "Great sleep! 😴" : "Try to get more rest") : "Log your sleep data",
      icon: Moon,
      color: "from-indigo-500 via-purple-500 to-pink-500",
      bgAccent: "bg-indigo-50",
      progress: Math.min((sleepHours / sleepGoal) * 100, 100),
      action: () => onNavigate("health")
    },
    {
      title: "Exercise Today",
      value: exerciseMinutes > 0 ? `${exerciseMinutes} min` : "No data",
      subtitle: exerciseMinutes > 0 ? (exerciseMinutes >= exerciseGoal ? "Keep up the great work! 💪" : "Almost there!") : "Start your fitness journey",
      icon: Activity,
      color: "from-green-500 via-emerald-500 to-teal-500",
      bgAccent: "bg-green-50",
      progress: Math.min((exerciseMinutes / exerciseGoal) * 100, 100),
      action: () => onNavigate("health")
    },
    {
      title: "Heart Rate",
      value: heartRate > 0 ? `${heartRate} bpm` : "No data",
      subtitle: heartRate > 0 ? `Target: ${heartRateTarget} bpm ❤️` : "Track your vitals",
      icon: Heart,
      color: "from-rose-500 via-pink-500 to-red-500",
      bgAccent: "bg-rose-50",
      progress: heartRate > 0 ? 85 : 0,
      action: () => onNavigate("health")
    }
  ];

  const quickActions = [
    { icon: BookOpen, label: "Learning", action: () => onNavigate("learning"), color: "text-blue-600" },
    { icon: MessageCircle, label: "AI Chat", action: () => onNavigate("chat"), color: "text-blue-600" },
    { icon: PenTool, label: "Journal", action: () => onNavigate("journal"), color: "text-indigo-600" },
    { icon: DollarSign, label: "Finance", action: () => onNavigate("finance"), color: "text-green-600" },
    { icon: Droplets, label: "Log Water", action: () => onNavigate("health"), color: "text-cyan-600" },
    { icon: Activity, label: "Exercise", action: () => onNavigate("health"), color: "text-green-600" },
    { icon: Target, label: "Set Goals", action: () => onNavigate("goals"), color: "text-purple-600" },
    { icon: Brain, label: "Emotional", action: () => onNavigate("emotional"), color: "text-pink-600" }
  ];

  if (healthLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar 
                className="w-16 h-16 cursor-pointer hover:ring-4 hover:ring-blue-500/20 transition-all duration-300 shadow-lg"
                onClick={() => onNavigate("profile")}
              >
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {greeting}, {userName} 👋
              </h1>
              <p className="text-gray-600 text-lg">Ready to make today amazing?</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => onNavigate("goals")}
              className="rounded-full p-3 hover:bg-purple-50 border-purple-200 transition-colors hover:scale-105"
            >
              <Target className="w-5 h-5 text-purple-600" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("profile")}
              className="rounded-full p-3 hover:bg-blue-50 border-blue-200 transition-colors hover:scale-105"
            >
              <User className="w-5 h-5 text-blue-600" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("settings")}
              className="rounded-full p-3 hover:bg-gray-50 border-gray-200 transition-colors hover:scale-105"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <Card 
              key={card.title}
              className={`cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group ${card.bgAccent} relative`}
              onClick={card.action}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className={`w-full h-full bg-gradient-to-r ${card.color}`}></div>
              </div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold text-gray-700 mb-2">
                      {card.title}
                    </CardTitle>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {card.value}
                    </div>
                    {card.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${card.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-gray-600 font-medium">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced AI Suggestions Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI Personal Assistant</h3>
                  <p className="opacity-90 text-lg">Ready to help you plan your perfect week? Let's create a personalized schedule that fits your lifestyle and goals.</p>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate("chat")}
                className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Let's Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.action}
                className="h-24 flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white/80 backdrop-blur-sm group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <action.icon className={`w-7 h-7 ${action.color} group-hover:scale-110 transition-transform duration-300 relative z-10`} />
                <span className="text-sm font-semibold text-gray-700 relative z-10">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Daily Motivation */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/20 rounded-full -mr-10 -mt-10"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Daily Inspiration</h3>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              "Every small step you take today builds the foundation for tomorrow's success. Your personalized goals are designed just for you—progress isn't about perfection, it's about consistency. You've got this! 🌟"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
