
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PiggyBank, Plus, X, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  deadline?: string;
  category: string;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onUpdateGoals: (goals: SavingsGoal[]) => void;
}

const SavingsGoals = ({ goals, onUpdateGoals }: SavingsGoalsProps) => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Error",
        description: "Please enter goal name and target amount",
        variant: "destructive",
      });
      return;
    }

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount || 0,
      monthlyContribution: newGoal.monthlyContribution || 0,
      deadline: newGoal.deadline,
      category: newGoal.category || 'General'
    };

    onUpdateGoals([...goals, goal]);
    setNewGoal({});
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Savings goal added successfully",
    });
  };

  const updateGoal = (id: string, field: keyof SavingsGoal, value: string | number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    );
    onUpdateGoals(updatedGoals);
  };

  const addMoney = (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal && amount > 0) {
      const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      updateGoal(id, 'currentAmount', newCurrentAmount);
      
      if (newCurrentAmount >= goal.targetAmount) {
        toast({
          title: "🎉 Goal Achieved!",
          description: `Congratulations! You've reached your ${goal.name} goal!`,
        });
      } else {
        toast({
          title: "Money Added",
          description: `₦${amount.toLocaleString()} added to ${goal.name}`,
        });
      }
    }
  };

  const removeGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    onUpdateGoals(updatedGoals);
    toast({
      title: "Goal Removed",
      description: "Savings goal has been removed",
    });
  };

  const getProgress = (goal: SavingsGoal) => {
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  };

  const getMonthsToGoal = (goal: SavingsGoal) => {
    if (goal.monthlyContribution <= 0) return null;
    const remaining = goal.targetAmount - goal.currentAmount;
    return Math.ceil(remaining / goal.monthlyContribution);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <PiggyBank className="w-5 h-5 mr-2 text-green-600" />
            Savings Goals
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            variant="outline" 
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Goal Form */}
        {showAddForm && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-semibold text-blue-800">Create New Savings Goal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Goal name (e.g., Emergency Fund)"
                  value={newGoal.name || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
                <Input
                  placeholder="Category (e.g., Emergency, Vacation)"
                  value={newGoal.category || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Target amount"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  placeholder="Current amount (optional)"
                  value={newGoal.currentAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  placeholder="Monthly contribution"
                  value={newGoal.monthlyContribution || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlyContribution: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  type="date"
                  placeholder="Target date (optional)"
                  value={newGoal.deadline || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addGoal} className="bg-blue-600 hover:bg-blue-700">
                  Create Goal
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PiggyBank className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2">No savings goals yet</p>
            <p className="text-sm">Create your first savings goal to start tracking your progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const monthsToGoal = getMonthsToGoal(goal);
              const [addAmount, setAddAmount] = useState<{ [key: string]: string }>({});

              return (
                <Card key={goal.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                        <p className="text-sm text-gray-600">{goal.category}</p>
                        {goal.deadline && (
                          <p className="text-xs text-gray-500">Target: {new Date(goal.deadline).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => removeGoal(goal.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>₦{goal.currentAmount.toLocaleString()}</span>
                        <span>₦{goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Remaining</p>
                        <p className="font-semibold text-gray-900">
                          ₦{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Monthly</p>
                        <p className="font-semibold text-blue-600">
                          ₦{goal.monthlyContribution.toLocaleString()}
                        </p>
                      </div>
                      {monthsToGoal && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">Months to Goal</p>
                          <p className="font-semibold text-green-600">{monthsToGoal}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Status</p>
                        <p className={`font-semibold ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                          {progress >= 100 ? 'Completed' : 'In Progress'}
                        </p>
                      </div>
                    </div>

                    {/* Add Money Section */}
                    {progress < 100 && (
                      <div className="flex items-center space-x-2 pt-4 border-t">
                        <Input
                          type="number"
                          placeholder="Add amount"
                          value={addAmount[goal.id] || ''}
                          onChange={(e) => setAddAmount({ ...addAmount, [goal.id]: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => {
                            const amount = parseFloat(addAmount[goal.id]) || 0;
                            if (amount > 0) {
                              addMoney(goal.id, amount);
                              setAddAmount({ ...addAmount, [goal.id]: '' });
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {goals.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">Goals Summary</span>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-green-700">Total Goals</p>
                  <p className="text-lg font-bold text-green-800">{goals.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Completed</p>
                  <p className="text-lg font-bold text-green-800">
                    {goals.filter(g => getProgress(g) >= 100).length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Total Target</p>
                  <p className="text-lg font-bold text-green-800">
                    ₦{goals.reduce((sum, g) => sum + g.targetAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Total Saved</p>
                  <p className="text-lg font-bold text-green-800">
                    ₦{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsGoals;
