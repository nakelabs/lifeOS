
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, DollarSign, BookOpen, Brain, MessageCircle, Shield } from "lucide-react";

const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const features = [
    {
      icon: Heart,
      title: "Health Assistant",
      description: "Track wellness, get reminders, build healthy habits"
    },
    {
      icon: DollarSign,
      title: "Finance Coach", 
      description: "Smart budgeting, savings tips, expense tracking"
    },
    {
      icon: BookOpen,
      title: "Learning Companion",
      description: "Personalized courses, progress tracking, daily lessons"
    },
    {
      icon: Brain,
      title: "Emotional Wellbeing",
      description: "Mood tracking, journaling, mindfulness exercises"
    },
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description: "Get guidance, motivation, and support anytime"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays secure and under your control"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Life<span className="text-blue-600">OS</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-4 font-light">
            Your Life. Organized. Empowered. Guided.
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            The AI-powered companion that helps you manage health, finances, learning, 
            and emotional wellbeing - all in one beautiful, intuitive platform.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Try LifeOS Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-medium rounded-xl transition-all duration-300"
            >
              Meet Your AI Assistant
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-6 opacity-90">Join thousands who've already started their journey with LifeOS</p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
