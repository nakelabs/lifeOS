import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Calculator, Lightbulb, Target, BarChart3, Bot, TrendingUp, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaycheckAllocator from './PaycheckAllocator';
import SavingsGoals from './SavingsGoals';

interface AllocationItem {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  type?: 'regular' | 'special' | 'savings';
}

const FinanceAssistant = () => {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [savedAllocations, setSavedAllocations] = useState<AllocationItem[]>([]);
  const [showAllocator, setShowAllocator] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [savingsGoals, setSavingsGoals] = useState([]);

  const handleAskAI = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate AI response (replace with actual AI integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse(`AI Response: ${question}`);
      toast({
        title: "Success",
        description: "AI response generated",
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Assistant</h1>
          <p className="text-gray-600">Take control of your finances with AI-powered insights</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Monthly Income</p>
                  <p className="text-2xl font-bold">₦{monthlyIncome.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Savings</p>
                  <p className="text-2xl font-bold">
                    ₦{savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                  </p>
                </div>
                <PiggyBank className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Allocations</p>
                  <p className="text-2xl font-bold">{savedAllocations.length}</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Goals Active</p>
                  <p className="text-2xl font-bold">
                    {savingsGoals.filter(g => (g.currentAmount / g.targetAmount) * 100 < 100).length}
                  </p>
                </div>
                <Lightbulb className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Income Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Enter your monthly income"
                    value={monthlyIncome || ''}
                    onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => setShowAllocator(true)}
                    disabled={!monthlyIncome}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Allocate
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Set your monthly income to get started with budgeting and savings goals
                </p>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            {savedAllocations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Budget Overview
                    </div>
                    <Button 
                      onClick={() => setShowAllocator(true)}
                      variant="outline" 
                      size="sm"
                    >
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Regular Expenses */}
                    {savedAllocations.filter(a => a.type === 'regular').length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Regular Expenses</h4>
                        <div className="space-y-2">
                          {savedAllocations.filter(a => a.type === 'regular').map((allocation) => (
                            <div key={allocation.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                              <span className="text-sm text-gray-700">{allocation.category}</span>
                              <span className="font-medium text-blue-700">
                                ₦{allocation.amount.toLocaleString()} ({allocation.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Purchases */}
                    {savedAllocations.filter(a => a.type === 'special').length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Special Purchases</h4>
                        <div className="space-y-2">
                          {savedAllocations.filter(a => a.type === 'special').map((allocation) => (
                            <div key={allocation.id} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                              <span className="text-sm text-gray-700">{allocation.category}</span>
                              <span className="font-medium text-purple-700">
                                ₦{allocation.amount.toLocaleString()} ({allocation.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Savings Allocations */}
                    {savedAllocations.filter(a => a.type === 'savings').length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Savings Allocations</h4>
                        <div className="space-y-2">
                          {savedAllocations.filter(a => a.type === 'savings').map((allocation) => (
                            <div key={allocation.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                              <span className="text-sm text-gray-700">{allocation.category}</span>
                              <span className="font-medium text-green-700">
                                ₦{allocation.amount.toLocaleString()} ({allocation.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  AI Financial Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about your finances: 'How much should I save?', 'Is my budget realistic?', 'Help me plan for a vacation'..."
                  rows={3}
                  className="resize-none"
                />
                <Button 
                  onClick={handleAskAI} 
                  disabled={loading || !question.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Thinking...' : 'Ask AI'}
                  <Lightbulb className="w-4 h-4 ml-2" />
                </Button>
                
                {aiResponse && (
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Bot className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-1">AI Advice</h4>
                          <p className="text-sm text-purple-700 whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Savings Goals */}
            <SavingsGoals 
              goals={savingsGoals}
              onUpdateGoals={setSavingsGoals}
            />
          </div>
        </div>

        {/* Paycheck Allocator Modal */}
        {showAllocator && (
          <PaycheckAllocator
            monthlyPaycheck={monthlyIncome}
            onClose={() => setShowAllocator(false)}
            onSaveAllocation={setSavedAllocations}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceAssistant;
