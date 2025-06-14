
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Mic, MicOff } from "lucide-react";
import { useState } from "react";

const ChatAssistant = ({ onBack }: { onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your LifeOS AI assistant. I'm here to help you with life advice, motivation, planning, and support. How can I assist you today? 😊",
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

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      role: "user",
      content: message,
      timestamp: "Just now"
    };

    // Simulate AI response
    const aiResponses = [
      "That's a great question! Let me help you with that. Based on your goals and current situation, here's what I recommend...",
      "I understand how you're feeling. It's completely normal to have these moments. Here are some strategies that might help...",
      "Absolutely! I'd be happy to help you plan that. Let's break it down into manageable steps...",
      "I'm here to support you through this. Remember, every small step counts and you're doing better than you think..."
    ];

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const aiMessage = {
      role: "assistant", 
      content: randomResponse,
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
