
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useUserStreaks } from "@/hooks/useUserStreaks";
import { useHealthData } from "@/hooks/useHealthData";

const ChatAssistant = ({ onBack }: { onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { profile } = useProfile();
  const { streak } = useUserStreaks();
  const { healthData } = useHealthData();
  
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello ${profile?.name || 'there'}! I'm your LifeOS AI assistant. I'm here to help you with life advice, motivation, planning, and support based on your personal goals and progress. How can I assist you today? 😊`,
      timestamp: "Just now"
    }
  ]);

  const quickPrompts = [
    "How can I save money this month?",
    "I'm feeling unmotivated, help me",
    "Plan my weekend for me",
    "Give me health tips for today",
    "How do I manage stress?",
    "Help me set goals"
  ];

  const generateIntelligentResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello ${profile?.name}! Great to chat with you. ${streak?.current_streak ? `I see you're on a ${streak.current_streak}-day streak - amazing consistency!` : ''} What would you like to talk about today?`;
    }

    // Motivation and encouragement
    if (lowerMessage.includes('unmotivated') || lowerMessage.includes('lazy') || lowerMessage.includes('discouraged')) {
      const motivationalResponses = [
        `${profile?.name}, I understand those feelings are completely normal. ${streak?.current_streak ? `Remember, you already have a ${streak.current_streak}-day streak going - that shows incredible discipline!` : 'Every small step counts.'} Here are some strategies that might help: 1) Start with just 5 minutes of your goal activity, 2) Celebrate small wins, 3) Remember your 'why' - what drives you?`,
        `Hey ${profile?.name}, feeling unmotivated happens to everyone. ${profile?.goals ? `Remember your goals: "${profile.goals}". Break them into tiny, manageable steps.` : 'Try setting one small, achievable goal for today.'} Sometimes momentum starts with just showing up, even when you don't feel like it.`,
        `${profile?.name}, motivation comes and goes, but habits stick around. ${streak?.longest_streak ? `You've had a ${streak.longest_streak}-day streak before, so you know you can do it!` : ''} Focus on building systems rather than relying on motivation. What's one small habit you could start today?`
      ];
      return motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)];
    }

    // Health-related questions
    if (lowerMessage.includes('health') || lowerMessage.includes('exercise') || lowerMessage.includes('fitness') || lowerMessage.includes('workout')) {
      const recentHealthEntries = healthData?.slice(0, 3) || [];
      let healthContext = '';
      if (recentHealthEntries.length > 0) {
        healthContext = ` I can see you've been tracking your health data - that's fantastic! `;
      }
      
      return `${profile?.name}, taking care of your health is so important!${healthContext}Here are some personalized tips: 1) Start with 10-15 minutes of movement daily, 2) Stay hydrated (aim for 8 glasses of water), 3) Get 7-9 hours of sleep, 4) Include more whole foods in your diet. ${profile?.focus_areas?.includes('health') ? 'Since health is one of your focus areas, consider setting specific weekly health goals!' : ''} What aspect of health would you like to focus on?`;
    }

    // Money and finance
    if (lowerMessage.includes('money') || lowerMessage.includes('save') || lowerMessage.includes('budget') || lowerMessage.includes('finance')) {
      return `Great question about finances, ${profile?.name}! Here's a personalized approach: 1) Track your expenses for a week to understand your spending patterns, 2) Use the 50/30/20 rule (50% needs, 30% wants, 20% savings), 3) Start with saving even $1 a day - it adds up! 4) Look for subscription services you can cancel. ${profile?.focus_areas?.includes('finance') ? 'I see finance is one of your focus areas - you can use the Finance Assistant for detailed budget tracking!' : ''} Would you like specific tips for any area of spending?`;
    }

    // Goal setting and planning
    if (lowerMessage.includes('goal') || lowerMessage.includes('plan') || lowerMessage.includes('objective') || lowerMessage.includes('target')) {
      const goalResponse = profile?.goals 
        ? `I can see you already have some goals: "${profile.goals}". Let's break these down into smaller, actionable steps. `
        : 'Setting goals is powerful! ';
      
      return `${profile?.name}, ${goalResponse}Here's my SMART goal framework: Make them Specific, Measurable, Achievable, Relevant, and Time-bound. ${streak?.current_streak ? `Your current ${streak.current_streak}-day streak shows you can stick to commitments!` : ''} Start with 1-3 goals maximum. What area of life would you like to set goals for?`;
    }

    // Stress management
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return `${profile?.name}, I hear you're dealing with stress. That's completely understandable in today's world. Here are some evidence-based techniques: 1) Try the 4-7-8 breathing technique (inhale 4, hold 7, exhale 8), 2) Practice the 5-4-3-2-1 grounding technique (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste), 3) Take a 10-minute walk outside, 4) Write down 3 things you're grateful for. ${profile?.focus_areas?.includes('emotional') ? 'Since emotional wellbeing is one of your focus areas, consider using the Emotional Wellbeing section regularly!' : ''} What's the main source of your stress right now?`;
    }

    // Weekend planning
    if (lowerMessage.includes('weekend') || lowerMessage.includes('plan my') || lowerMessage.includes('what should i do')) {
      const activities = [
        'Try a new recipe or cook your favorite meal',
        'Take a nature walk or visit a local park',
        'Read a book or listen to a podcast',
        'Call a friend or family member you haven\'t spoken to in a while',
        'Organize one small area of your living space',
        'Practice a hobby or learn something new',
        'Do a digital detox for a few hours'
      ];
      
      const randomActivities = activities.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      return `${profile?.name}, here's a balanced weekend plan for you: ${randomActivities.map((activity, index) => `${index + 1}) ${activity}`).join(', ')}. ${profile?.focus_areas?.length ? `Based on your focus areas (${profile.focus_areas.join(', ')}), you might also want to dedicate some time to activities that align with these priorities.` : ''} Remember to balance productivity with relaxation!`;
    }

    // Learning and growth
    if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('skill') || lowerMessage.includes('course')) {
      return `${profile?.name}, I love that you're focused on learning and growth! ${streak?.current_streak ? `Your ${streak.current_streak}-day streak shows great commitment to self-improvement.` : ''} Here are some strategies: 1) Use the 80/20 rule - focus on the 20% that gives 80% of results, 2) Practice spaced repetition, 3) Teach someone else what you learn, 4) Set aside 20-30 minutes daily for focused learning. ${profile?.focus_areas?.includes('learning') ? 'Since learning is one of your focus areas, check out the Learning Companion for course tracking!' : ''} What would you like to learn about?`;
    }

    // Default intelligent response
    const contextualResponses = [
      `That's a thoughtful question, ${profile?.name}! Based on your profile and goals, here's my perspective: Focus on taking small, consistent actions. ${streak?.current_streak ? `You're already proving this with your ${streak.current_streak}-day streak!` : ''} Remember, progress over perfection is key.`,
      `Great point, ${profile?.name}! ${profile?.focus_areas?.length ? `Given your focus on ${profile.focus_areas.join(' and ')}, ` : ''}I'd recommend breaking this down into manageable steps. What's the first small action you could take today?`,
      `I understand what you're getting at, ${profile?.name}. ${profile?.goals ? `This relates to your goals around "${profile.goals}". ` : ''}Sometimes the best approach is to start where you are, use what you have, and do what you can. What feels most important to tackle first?`,
      `That's an interesting perspective, ${profile?.name}! ${streak?.total_active_days ? `With ${streak.total_active_days} active days under your belt, you have experience making progress. ` : ''}Consider this: every expert was once a beginner. What would taking the first step look like for you?`
    ];

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      role: "user",
      content: message,
      timestamp: "Just now"
    };

    // Generate intelligent response based on user input and profile data
    const intelligentResponse = generateIntelligentResponse(message);
    
    const aiMessage = {
      role: "assistant", 
      content: intelligentResponse,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, newUserMessage, aiMessage]);
    setMessage("");
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Assistant</h1>
              <p className="text-gray-600">Your personal life companion</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Prompts */}
        <Card className="mb-6 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 justify-start"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  <span className="text-sm">{prompt}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Ask me anything about life, goals, health, finance..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoice}
                  className={isListening ? 'bg-red-100 border-red-300' : ''}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-600" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isListening && (
              <p className="text-sm text-red-600 mt-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                Listening... Speak now
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;
