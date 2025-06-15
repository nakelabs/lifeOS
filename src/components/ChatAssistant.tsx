
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageCircle, Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useUserStreaks } from "@/hooks/useUserStreaks";
import { useHealthData } from "@/hooks/useHealthData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ChatAssistant = ({ onBack }: { onBack: () => void }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { streak } = useUserStreaks();
  const { healthData } = useHealthData();
  const { toast } = useToast();
  
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

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const newUserMessage = {
      role: "user",
      content: message,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: message,
          profile: profile,
          streak: streak,
          healthData: healthData?.slice(0, 5) // Send only recent health data to avoid payload size issues
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const aiMessage = {
        role: "assistant",
        content: data.response,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment. In the meantime, I'm still here to chat and can provide general advice based on your profile information!",
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
    toast({
      title: "Voice Feature",
      description: "Voice input coming soon!",
    });
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
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <p className="text-sm">AI is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
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
                  disabled={isLoading}
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
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoice}
                  className={isListening ? 'bg-red-100 border-red-300' : ''}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-600" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage} 
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isLoading || !message.trim()}
              >
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
