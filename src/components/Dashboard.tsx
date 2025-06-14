
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, BookOpen, Brain, MessageCircle, Settings, TrendingUp, Moon, Droplets } from "lucide-react";

const Dashboard = ({ userName = "Friend", onNavigate }: { userName?: string, onNavigate: (section: string) => void }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  const summaryCards = [
    {
      title: "Health Overview",
      value: "6h 30m sleep",
      subtitle: "Great rest last night! 💤",
      icon: Moon,
      color: "from-purple-500 to-pink-500",
      action: () => onNavigate("health")
    },
    {
      title: "Budget Snapshot", 
      value: "₦5,000",
      subtitle: "remaining for the week",
      icon: DollarSign,
      color: "from-green-500 to-blue-500",
      action: () => onNavigate("finance")
    },
    {
      title: "Learning Progress",
      value: "2 of 10",
      subtitle: "lessons complete",
      icon: BookOpen,
      color: "from-blue-500 to-purple-500",
      action: () => onNavigate("learning")
    },
    {
      title: "Wellness Check",
      value: "How are you feeling?",
      subtitle: "Daily mood check-in",
      icon: Heart,
      color: "from-pink-500 to-red-500",
      action: () => onNavigate("emotional")
    }
  ];

  const quickActions = [
    { icon: MessageCircle, label: "Chat with AI", action: () => onNavigate("chat") },
    { icon: Droplets, label: "Log Water", action: () => onNavigate("health") },
    { icon: TrendingUp, label: "Add Expense", action: () => onNavigate("finance") },
    { icon: Brain, label: "Quick Journal", action: () => onNavigate("emotional") }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-gray-600">Here's your focus today</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onNavigate("settings")}
            className="rounded-full p-3"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <Card 
              key={card.title}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm"
              onClick={card.action}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {card.value}
                </div>
                <p className="text-sm text-gray-500">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Suggestions Card */}
        <Card className="mb-8 border-0 shadow-md bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">✨ AI Suggestion</h3>
                <p className="opacity-90">Want help planning your week? I can create a personalized schedule based on your goals and habits.</p>
              </div>
              <Button 
                onClick={() => onNavigate("chat")}
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold"
              >
                Let's Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.action}
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white/80 backdrop-blur-sm"
              >
                <action.icon className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Daily Motivation */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💫 Daily Motivation</h3>
            <p className="text-gray-600 italic">"Every small step you take today builds the foundation for tomorrow's success. You've got this!"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
