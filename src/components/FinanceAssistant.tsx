import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Target, Plus, Minus, PieChart, Calculator, RotateCcw, AlertTriangle, Lightbulb, Calendar, Wallet, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PaycheckAllocator from "./PaycheckAllocator";

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
  type?: string;
}

interface FinancialAdvice {
  type: 'warning' | 'tip';
  title: string;
  message: string;
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
  const [showPaycheckAllocator, setShowPaycheckAllocator] = useState(false);
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
      console.log('Fetched transactions:', validTransactions);
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
        .select('category, amount, type')
        .eq('user_id', user?.id)
        .in('type', ['budget', 'special_goal', 'savings_goal']);

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
        spent: spentByCategory[budget.category || 'Other'] || 0,
        type: budget.type
      })) || [];

      setBudgets(budgetItems);
      console.log('Fetched budgets with types:', budgetItems);
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
        console.log('Fetched monthly paycheck:', data.amount);
      } else {
        console.log('No paycheck data found');
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
      // First, check if a paycheck record already exists
      const { data: existingPaycheck, error: fetchError } = await supabase
        .from('financial_records')
        .select('id')
        .eq('user_id', user?.id)
        .eq('type', 'monthly_paycheck')
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      let error;
      
      if (existingPaycheck) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('financial_records')
          .update({
            amount: parseFloat(paycheckAmount),
            description: 'Monthly paycheck amount',
            recorded_at: new Date().toISOString()
          })
          .eq('user_id', user?.id)
          .eq('type', 'monthly_paycheck');
        
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('financial_records')
          .insert([
            {
              user_id: user?.id,
              type: 'monthly_paycheck',
              category: 'Salary',
              amount: parseFloat(paycheckAmount),
              description: 'Monthly paycheck amount',
              recorded_at: new Date().toISOString()
            }
          ]);
        
        error = insertError;
      }

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

  const handleSaveAllocation = async (allocations: any[]) => {
    try {
      // Separate allocations by type
      const budgetRecords = allocations.map(allocation => ({
        user_id: user?.id,
        type: allocation.type === 'special' ? 'special_goal' : 
              allocation.type === 'savings' ? 'savings_goal' : 'budget',
        category: allocation.category,
        amount: allocation.amount,
        description: `${allocation.type === 'special' ? 'Special Goal' : 
                      allocation.type === 'savings' ? 'Savings Goal' : 'Budget'}: ${allocation.percentage.toFixed(1)}%`,
        recorded_at: new Date().toISOString()
      }));

      // Delete existing budgets, special goals, and savings goals
      const { error: deleteError } = await supabase
        .from('financial_records')
        .delete()
        .eq('user_id', user?.id)
        .in('type', ['budget', 'special_goal', 'savings_goal']);

      if (deleteError) throw deleteError;

      // Insert new allocations
      const { error: insertError } = await supabase
        .from('financial_records')
        .insert(budgetRecords);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Paycheck allocation saved successfully",
      });

      fetchBudgets();
    } catch (error) {
      console.error('Error saving allocation:', error);
      toast({
        title: "Error",
        description: "Failed to save allocation",
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

  const getFinancialAdvice = (): FinancialAdvice[] => {
    const advice: FinancialAdvice[] = [];
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalExpenses = getTotalExpenses();
    
    console.log('Financial advice calculation:', {
      totalBudget,
      totalSpent,
      monthlyPaycheck,
      totalExpenses,
      budgets
    });
    
    // Check for over-budget categories
    const overBudgetCategories = budgets.filter(b => b.spent > b.budget && b.budget > 0);
    if (overBudgetCategories.length > 0) {
      advice.push({
        type: 'warning',
        title: 'Budget Alert!',
        message: `You're over budget in ${overBudgetCategories.length} categories: ${overBudgetCategories.map(b => b.category).join(', ')}. Consider reducing spending in these areas.`
      });
    }

    // Paycheck allocation advice
    if (monthlyPaycheck > 0) {
      if (totalBudget > 0) {
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

      // Check spending against paycheck
      const spendingRate = (totalExpenses / monthlyPaycheck) * 100;
      if (spendingRate > 80) {
        advice.push({
          type: 'warning',
          title: 'High Spending Rate',
          message: `You've spent ${spendingRate.toFixed(1)}% of your monthly paycheck. Consider tracking your expenses more carefully.`
        });
      } else if (spendingRate > 0 && spendingRate < 50) {
        advice.push({
          type: 'tip',
          title: 'Great Spending Control',
          message: `You've only spent ${spendingRate.toFixed(1)}% of your paycheck. You're doing great with expense management!`
        });
      }
    }

    // Spending pattern advice for budgets
    if (totalBudget > 0 && totalSpent > 0) {
      const spendingRate = (totalSpent / totalBudget) * 100;
      if (spendingRate > 80) {
        advice.push({
          type: 'warning',
          title: 'High Budget Usage',
          message: `You've spent ${spendingRate.toFixed(1)}% of your budgeted amounts. Consider slowing down spending for the rest of the month.`
        });
      }
    }

    // General advice if no specific issues
    if (advice.length === 0) {
      if (monthlyPaycheck > 0) {
        advice.push({
          type: 'tip',
          title: 'Financial Health Check',
          message: 'Your finances look stable! Consider setting up budgets for different categories to better track your spending patterns.'
        });
      } else {
        advice.push({
          type: 'tip',
          title: 'Get Started',
          message: 'Set your monthly paycheck to get personalized financial advice and better budget recommendations.'
        });
      }
    }

    console.log('Generated financial advice:', advice);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const financialAdvice = getFinancialAdvice();
  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Assistant</h1>
              <p className="text-gray-600">Manage your money smarter</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => setShowAddTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button onClick={() => setShowBudgetManager(true)} variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Budget
            </Button>
            <Button onClick={() => setShowPaycheckManager(true)} variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Paycheck
            </Button>
            {monthlyPaycheck > 0 && (
              <Button 
                onClick={() => setShowPaycheckAllocator(true)} 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Allocate
              </Button>
            )}
          </div>
        </div>

        {/* Paycheck Setup Alert */}
        {monthlyPaycheck === 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 mb-2">Set Your Monthly Paycheck</h3>
                  <p className="text-orange-700 mb-4">
                    Get personalized financial advice and AI-powered budget allocation.
                  </p>
                  <Button 
                    onClick={() => setShowPaycheckManager(true)} 
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Set Paycheck
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Insights */}
        {financialAdvice.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
              Insights
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {financialAdvice.map((advice, index) => (
                <Card key={index} className={`${
                  advice.type === 'warning' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {advice.type === 'warning' ? 
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" /> :
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      }
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{advice.title}</h3>
                        <p className="text-sm text-gray-700">{advice.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className="text-2xl font-bold text-gray-900">₦{getAvailableBalance().toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Income</p>
                  <p className="text-2xl font-bold text-gray-900">₦{getTotalIncome().toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">₦{getTotalExpenses().toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paycheck</p>
                  <p className="text-2xl font-bold text-gray-900">₦{monthlyPaycheck?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Overview */}
          {budgets.length > 0 && (
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Regular Budgets */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Regular Expenses
                  </h4>
                  {budgets.filter(item => !item.type || item.type === 'budget').map((item, index) => {
                    const percentage = (item.spent / item.budget) * 100;
                    const isOverBudget = percentage > 100;
                    
                    return (
                      <div key={index} className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            ₦{item.spent.toLocaleString()} / ₦{item.budget.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Special Goals */}
                {budgets.filter(item => item.type === 'special_goal').length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Special Goals
                    </h4>
                    {budgets.filter(item => item.type === 'special_goal').map((item, index) => (
                      <div key={index} className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            ₦{item.budget.toLocaleString()}/month
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Savings Goals */}
                {budgets.filter(item => item.type === 'savings_goal').length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Savings Goals
                    </h4>
                    {budgets.filter(item => item.type === 'savings_goal').map((item, index) => (
                      <div key={index} className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            ₦{item.budget.toLocaleString()}/month
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white border-0 shadow-sm mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-2">No transactions yet</p>
                <p className="text-sm text-gray-500">Add your first transaction to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {Object.entries(groupedTransactions)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 5)
                  .map(([date, dateTransactions]) => (
                    <div key={date}>
                      <h3 className="text-xs font-medium text-gray-500 mb-2">
                        {formatDate(date)}
                      </h3>
                      <div className="space-y-2">
                        {dateTransactions.slice(0, 3).map((transaction) => (
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
                                <p className="font-medium text-gray-900 text-sm">{transaction.description || transaction.category}</p>
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

        {/* Reset Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleResetFinance} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Transaction</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddTransaction(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
                        <SelectItem value="income">💰 Income</SelectItem>
                        <SelectItem value="expense">💸 Expense</SelectItem>
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
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">Add Transaction</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddTransaction(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Manager Modal */}
        {showBudgetManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Set Budget</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowBudgetManager(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">Set Budget</Button>
                    <Button type="button" variant="outline" onClick={() => setShowBudgetManager(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Paycheck Manager Modal */}
        {showPaycheckManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Set Monthly Paycheck</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowPaycheckManager(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
                    <p className="text-xs text-gray-500 mt-2">
                      This helps us provide better budget allocation advice.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">Set Paycheck</Button>
                    <Button type="button" variant="outline" onClick={() => setShowPaycheckManager(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Paycheck Allocator Modal */}
        {showPaycheckAllocator && monthlyPaycheck > 0 && (
          <PaycheckAllocator
            monthlyPaycheck={monthlyPaycheck}
            onClose={() => setShowPaycheckAllocator(false)}
            onSaveAllocation={handleSaveAllocation}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceAssistant;
