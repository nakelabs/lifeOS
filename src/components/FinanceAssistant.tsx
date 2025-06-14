
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";

const FinanceAssistant = ({ onBack }: { onBack: () => void }) => {
  const budgetData = [
    { category: "Food", spent: 15000, budget: 20000, color: "green" },
    { category: "Transport", spent: 8000, budget: 10000, color: "blue" },
    { category: "Entertainment", spent: 12000, budget: 15000, color: "purple" },
    { category: "Shopping", spent: 7000, budget: 8000, color: "orange" }
  ];

  const recentTransactions = [
    { description: "Grocery Shopping", amount: -3500, date: "Today", type: "expense" },
    { description: "Salary Credit", amount: 85000, date: "Yesterday", type: "income" },
    { description: "Uber Ride", amount: -1200, date: "Yesterday", type: "expense" },
    { description: "Movie Tickets", amount: -4000, date: "2 days ago", type: "expense" }
  ];

  const savingsTips = [
    "💡 Skip one soda today = ₦300 saved",
    "🚌 Use public transport = Save ₦500 daily",
    "🏠 Cook at home twice this week = Save ₦2,000",
    "📱 Review subscriptions = Potential ₦5,000/month savings"
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
            <h1 className="text-3xl font-bold text-gray-800">Finance Assistant</h1>
            <p className="text-gray-600">Smart money management</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Available Balance</p>
                  <p className="text-2xl font-bold">₦45,000</p>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">This Week's Spending</p>
                  <p className="text-2xl font-bold">₦12,500</p>
                </div>
                <TrendingDown className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Savings Goal</p>
                  <p className="text-2xl font-bold">₦8,000</p>
                </div>
                <Target className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Breakdown */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((item, index) => {
                const percentage = (item.spent / item.budget) * 100;
                const isOverBudget = percentage > 80;
                
                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className={`text-sm ${isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        ₦{item.spent.toLocaleString()} / ₦{item.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                    />
                    {isOverBudget && (
                      <p className="text-xs text-red-600">⚠️ You're spending more than planned in this category</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> : 
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Tips */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Smart Savings Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savingsTips.map((tip, index) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
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

export default FinanceAssistant;
