
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, DollarSign, BookOpen, Brain, MessageCircle, Settings, TrendingUp, Moon, Droplets, User, Sparkles, Target } from "lucide-react";

const Dashboard = ({ userName = "Friend", onNavigate }: { userName?: string, onNavigate: (section: string) => void }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const summaryCards = [
    {
      title: "Sleep Tracker",
      value: "6h 30m",
      subtitle: "Great rest last night! 💤",
      icon: Moon,
      color: "from-indigo-500 via-purple-500 to-pink-500",
      bgAccent: "bg-indigo-50",
      action: () => onNavigate("health")
    },
    {
      title: "Weekly Budget", 
      value: "₦5,000",
      subtitle: "remaining for the week",
      icon: DollarSign,
      color: "from-emerald-500 via-green-500 to-teal-500",
      bgAccent: "bg-emerald-50",
      action: () => onNavigate("finance")
    },
    {
      title: "Learning Journey",
      value: "2 of 10",
      subtitle: "lessons complete",
      icon: BookOpen,
      color: "from-blue-500 via-cyan-500 to-teal-500",
      bgAccent: "bg-blue-50",
      action: () => onNavigate("learning")
    },
    {
      title: "Mood Check-in",
      value: "How are you feeling?",
      subtitle: "Daily wellness check",
      icon: Heart,
      color: "from-rose-500 via-pink-500 to-red-500",
      bgAccent: "bg-rose-50",
      action: () => onNavigate("emotional")
    }
  ];

  const quickActions = [
    { icon: MessageCircle, label: "AI Chat", action: () => onNavigate("chat"), color: "text-blue-600" },
    { icon: Droplets, label: "Log Water", action: () => onNavigate("health"), color: "text-cyan-600" },
    { icon: TrendingUp, label: "Add Expense", action: () => onNavigate("finance"), color: "text-green-600" },
    { icon: Brain, label: "Quick Journal", action: () => onNavigate("journal"), color: "text-purple-600" }
  ];

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
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
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
              onClick={() => onNavigate("profile")}
              className="rounded-full p-3 hover:bg-blue-50 border-blue-200 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("settings")}
              className="rounded-full p-3 hover:bg-gray-50 border-gray-200 transition-colors"
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
              className={`cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden group ${card.bgAccent}`}
              onClick={card.action}
            >
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-700 mb-1">
                      {card.title}
                    </CardTitle>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {card.value}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
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
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI Personal Assistant</h3>
                  <p className="opacity-90 text-lg">Ready to help you plan your perfect week? Let's create a personalized schedule that fits your lifestyle and goals.</p>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate("chat")}
                className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.action}
                className="h-24 flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white/80 backdrop-blur-sm group"
              >
                <action.icon className={`w-7 h-7 ${action.color} group-hover:scale-110 transition-transform duration-300`} />
                <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Daily Motivation */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Daily Inspiration</h3>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              "Every small step you take today builds the foundation for tomorrow's success. Progress isn't about perfection—it's about consistency. You've got this! 🌟"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
