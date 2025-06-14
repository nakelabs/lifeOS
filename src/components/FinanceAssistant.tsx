
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Target, Plus, Minus, PieChart, Calculator, RotateCcw, AlertTriangle, Lightbulb, Calendar, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  recorded_at: string;
}

interface BudgetItem {
  category: string;
  budget: number;
  spent: number;
}

const FinanceAssistant = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [showPaycheckManager, setShowPaycheckManager] = useState(false);
  const [monthlyPaycheck, setMonthlyPaycheck] = useState<number>(0);

  // Form states
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  // Budget form states
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  // Paycheck form state
  const [paycheckAmount, setPaycheckAmount] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchBudgets();
      fetchPaycheck();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', user?.id)
        .in('type', ['income', 'expense'])
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const validTransactions = (data || [])
        .filter(record => record.type === 'income' || record.type === 'expense')
        .map(record => ({
          id: record.id,
          type: record.type as 'income' | 'expense',
          category: record.category || 'Other',
          amount: record.amount,
          description: record.description || '',
          recorded_at: record.recorded_at || new Date().toISOString()
        }));
      
      setTransactions(validTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data: budgetData, error: budgetError } = await supabase
        .from('financial_records')
        .select('category, amount')
        .eq('user_id', user?.id)
        .eq('type', 'budget');

      if (budgetError) throw budgetError;

      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();

      const { data: expenseData, error: expenseError } = await supabase
        .from('financial_records')
        .select('category, amount')
        .eq('user_id', user?.id)
        .eq('type', 'expense')
        .gte('recorded_at', firstDay);

      if (expenseError) throw expenseError;

      const spentByCategory: { [key: string]: number } = {};
      expenseData?.forEach(expense => {
        const cat = expense.category || 'Other';
        spentByCategory[cat] = (spentByCategory[cat] || 0) + expense.amount;
      });

      const budgetItems: BudgetItem[] = budgetData?.map(budget => ({
        category: budget.category || 'Other',
        budget: budget.amount,
        spent: spentByCategory[budget.category || 'Other'] || 0
      })) || [];

      setBudgets(budgetItems);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchPaycheck = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('type', 'monthly_paycheck')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setMonthlyPaycheck(data.amount);
      }
    } catch (error) {
      console.error('Error fetching paycheck:', error);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('financial_records')
        .insert([
          {
            user_id: user?.id,
            type: transactionType,
            category,
            amount: parseFloat(amount),
            description,
            recorded_at: new Date(transactionDate).toISOString()
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });

      setAmount('');
      setCategory('');
      setDescription('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setShowAddTransaction(false);
      fetchTransactions();
      fetchBudgets();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetAmount || !budgetCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('financial_records')
        .upsert([
          {
            user_id: user?.id,
            type: 'budget',
            category: budgetCategory,
            amount: parseFloat(budgetAmount),
            description: `Budget for ${budgetCategory}`,
            recorded_at: new Date().toISOString()
          }
        ], { onConflict: 'user_id,type,category' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget updated successfully",
      });

      setBudgetAmount('');
      setBudgetCategory('');
      setShowBudgetManager(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const handleSetPaycheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paycheckAmount) {
      toast({
        title: "Error",
        description: "Please enter your monthly paycheck amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('financial_records')
        .upsert([
          {
            user_id: user?.id,
            type: 'monthly_paycheck',
            category: 'Salary',
            amount: parseFloat(paycheckAmount),
            description: 'Monthly paycheck amount',
            recorded_at: new Date().toISOString()
          }
        ], { onConflict: 'user_id,type' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Monthly paycheck set successfully",
      });

      setPaycheckAmount('');
      setShowPaycheckManager(false);
      setMonthlyPaycheck(parseFloat(paycheckAmount));
    } catch (error) {
      console.error('Error setting paycheck:', error);
      toast({
        title: "Error",
        description: "Failed to set paycheck",
        variant: "destructive",
      });
    }
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getAvailableBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getFinancialAdvice = () => {
    const advice = [];
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    
    // Check for over-budget categories
    const overBudgetCategories = budgets.filter(b => b.spent > b.budget);
    if (overBudgetCategories.length > 0) {
      advice.push({
        type: 'warning',
        title: 'Budget Alert!',
        message: `You're over budget in ${overBudgetCategories.length} categories. Consider reducing spending in: ${overBudgetCategories.map(b => b.category).join(', ')}.`
      });
    }

    // Paycheck allocation advice
    if (monthlyPaycheck > 0 && totalBudget > 0) {
      const budgetUtilization = (totalBudget / monthlyPaycheck) * 100;
      if (budgetUtilization > 90) {
        advice.push({
          type: 'warning',
          title: 'High Budget Allocation',
          message: `Your budgets use ${budgetUtilization.toFixed(1)}% of your paycheck. Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings.`
        });
      } else if (budgetUtilization < 70) {
        advice.push({
          type: 'tip',
          title: 'Room for Savings',
          message: `You're only budgeting ${budgetUtilization.toFixed(1)}% of your paycheck. Consider allocating more to savings and investments.`
        });
      }
    }

    // Spending pattern advice
    if (totalSpent > 0) {
      const spendingRate = (totalSpent / totalBudget) * 100;
      if (spendingRate > 80) {
        advice.push({
          type: 'warning',
          title: 'High Spending Rate',
          message: `You've spent ${spendingRate.toFixed(1)}% of your total budget. Consider slowing down spending for the rest of the month.`
        });
      }
    }

    return advice;
  };

  const handleResetFinance = async () => {
    if (!confirm('Are you sure you want to reset all your financial data? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('financial_records')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All financial data has been reset",
      });

      setTransactions([]);
      setBudgets([]);
      setMonthlyPaycheck(0);
      fetchTransactions();
      fetchBudgets();
    } catch (error) {
      console.error('Error resetting finance data:', error);
      toast({
        title: "Error",
        description: "Failed to reset financial data",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupTransactionsByDate = () => {
    const grouped: { [key: string]: Transaction[] } = {};
    transactions.forEach(transaction => {
      const dateKey = transaction.recorded_at.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const financialAdvice = getFinancialAdvice();
  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Finance Assistant</h1>
              <p className="text-gray-600">Smart money management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
            <Button onClick={() => setShowBudgetManager(true)} variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Manage Budget
            </Button>
            <Button onClick={() => setShowPaycheckManager(true)} variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Set Paycheck
            </Button>
            <Button onClick={handleResetFinance} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        {/* Financial Advice */}
        {financialAdvice.length > 0 && (
          <div className="mb-8 space-y-4">
            {financialAdvice.map((advice, index) => (
              <Card key={index} className={`border-0 shadow-md ${
                advice.type === 'warning' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500' :
                'bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {advice.type === 'warning' ? 
                      <AlertTriangle className="w-5 h-5 text-red-600" /> :
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    }
                    <div>
                      <h3 className="font-semibold text-gray-800">{advice.title}</h3>
                      <p className="text-sm text-gray-600">{advice.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Available Balance</p>
                  <p className="text-2xl font-bold">₦{getAvailableBalance().toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Income</p>
                  <p className="text-2xl font-bold">₦{getTotalIncome().toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Expenses</p>
                  <p className="text-2xl font-bold">₦{getTotalExpenses().toLocaleString()}</p>
                </div>
                <TrendingDown className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-500 to-teal-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Monthly Paycheck</p>
                  <p className="text-2xl font-bold">₦{monthlyPaycheck?.toLocaleString() || '0'}</p>
                </div>
                <Wallet className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <Card className="mb-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((item, index) => {
                  const percentage = (item.spent / item.budget) * 100;
                  const isOverBudget = percentage > 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{item.category}</span>
                        <span className={`text-sm ${isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          ₦{item.spent.toLocaleString()} / ₦{item.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                      />
                      {isOverBudget && (
                        <p className="text-xs text-red-600">⚠️ Over budget by ₦{(item.spent - item.budget).toLocaleString()}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions by Date */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions yet. Add your first transaction to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedTransactions)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 7)
                  .map(([date, dateTransactions]) => (
                    <div key={date} className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500 border-b pb-1">
                        {formatDate(date)}
                      </h3>
                      <div className="space-y-2">
                        {dateTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                                <p className="font-medium text-gray-800">{transaction.description || transaction.category}</p>
                                <p className="text-xs text-gray-500">{transaction.category}</p>
                              </div>
                            </div>
                            <span className={`font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select value={transactionType} onValueChange={(value: 'income' | 'expense') => setTransactionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (₦)</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">Add Transaction</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddTransaction(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Manager Modal */}
        {showBudgetManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Set Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Amount (₦)</label>
                    <Input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">Set Budget</Button>
                    <Button type="button" variant="outline" onClick={() => setShowBudgetManager(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Paycheck Manager Modal */}
        {showPaycheckManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Set Monthly Paycheck</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetPaycheck} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Paycheck Amount (₦)</label>
                    <Input
                      type="number"
                      value={paycheckAmount}
                      onChange={(e) => setPaycheckAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This helps us provide better budget allocation advice based on the 50/30/20 rule.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">Set Paycheck</Button>
                    <Button type="button" variant="outline" onClick={() => setShowPaycheckManager(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceAssistant;
