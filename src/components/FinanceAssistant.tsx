
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
      console.log('Fetched budgets:', budgetItems);
      console.log('Spent by category:', spentByCategory);
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
      // Save allocations as budget records
      const budgetRecords = allocations.map(allocation => ({
        user_id: user?.id,
        type: 'budget',
        category: allocation.category,
        amount: allocation.amount,
        description: `Allocated from paycheck: ${allocation.percentage.toFixed(1)}%`,
        recorded_at: new Date().toISOString()
      }));

      // Delete existing budgets first
      const { error: deleteError } = await supabase
        .from('financial_records')
        .delete()
        .eq('user_id', user?.id)
        .eq('type', 'budget');

      if (deleteError) throw deleteError;

      // Insert new budgets
      const { error: insertError } = await supabase
        .from('financial_records')
        .insert(budgetRecords);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Paycheck allocation saved as budgets",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const financialAdvice = getFinancialAdvice();
  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-blue-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Finance Assistant</h1>
              <p className="text-gray-600 text-lg">Smart money management made simple</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowAddTransaction(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
            <Button onClick={() => setShowBudgetManager(true)} variant="outline" className="shadow-md hover:bg-gray-50">
              <Target className="w-4 h-4 mr-2" />
              Budget
            </Button>
            <Button onClick={() => setShowPaycheckManager(true)} variant="outline" className="shadow-md hover:bg-gray-50">
              <Wallet className="w-4 h-4 mr-2" />
              Paycheck
            </Button>
            <Button 
              onClick={() => setShowPaycheckAllocator(true)} 
              variant="outline"
              disabled={monthlyPaycheck === 0}
              className="bg-green-50 hover:bg-green-100 text-green-700 shadow-md disabled:opacity-50"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Allocate
            </Button>
            <Button onClick={handleResetFinance} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 shadow-md">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Paycheck Setup Alert */}
        {monthlyPaycheck === 0 && (
          <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 text-lg mb-2">Set Your Monthly Paycheck</h3>
                  <p className="text-orange-700 mb-4">
                    Set your monthly paycheck to unlock AI-powered allocation features and get personalized financial advice.
                  </p>
                  <Button 
                    onClick={() => setShowPaycheckManager(true)} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Set Paycheck Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Advice */}
        {financialAdvice.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
              Financial Insights
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {financialAdvice.map((advice, index) => (
                <Card key={index} className={`shadow-md hover:shadow-lg transition-shadow ${
                  advice.type === 'warning' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500' :
                  'bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${
                        advice.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {advice.type === 'warning' ? 
                          <AlertTriangle className="w-5 h-5 text-red-600" /> :
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{advice.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{advice.message}</p>
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-blue-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Available Balance</p>
                  <p className="text-2xl lg:text-3xl font-bold">₦{getAvailableBalance().toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Income</p>
                  <p className="text-2xl lg:text-3xl font-bold">₦{getTotalIncome().toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Expenses</p>
                  <p className="text-2xl lg:text-3xl font-bold">₦{getTotalExpenses().toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingDown className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-teal-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Monthly Paycheck</p>
                  <p className="text-2xl lg:text-3xl font-bold">₦{monthlyPaycheck?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Overview */}
          {budgets.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <PieChart className="w-5 h-5 text-blue-600" />
                  </div>
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {budgets.map((item, index) => {
                  const percentage = (item.spent / item.budget) * 100;
                  const isOverBudget = percentage > 100;
                  
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 text-lg">{item.category}</span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          ₦{item.spent.toLocaleString()} / ₦{item.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-3 ${isOverBudget ? 'bg-red-100' : 'bg-gray-200'}`}
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{percentage.toFixed(1)}% used</span>
                          {isOverBudget && (
                            <span className="text-red-600 font-medium">
                              ⚠️ Over by ₦{(item.spent - item.budget).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-4">No transactions yet</p>
                  <p className="text-gray-500">Add your first transaction to get started!</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {Object.entries(groupedTransactions)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .slice(0, 5)
                    .map(([date, dateTransactions]) => (
                      <div key={date} className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-500 border-b pb-2 mb-3">
                          {formatDate(date)}
                        </h3>
                        <div className="space-y-3">
                          {dateTransactions.slice(0, 3).map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                  {transaction.type === 'income' ? 
                                    <TrendingUp className="w-6 h-6 text-green-600" /> : 
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                  }
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-lg">{transaction.description || transaction.category}</p>
                                  <p className="text-sm text-gray-500">{transaction.category}</p>
                                </div>
                              </div>
                              <span className={`font-bold text-lg ${
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
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Add Transaction</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddTransaction(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTransaction} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select value={transactionType} onValueChange={(value: 'income' | 'expense') => setTransactionType(value)}>
                      <SelectTrigger className="h-12">
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
                      <SelectTrigger className="h-12">
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
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 h-12 text-lg">Add Transaction</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddTransaction(false)} className="flex-1 h-12">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Manager Modal */}
        {showBudgetManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Set Budget</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowBudgetManager(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBudget} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                      <SelectTrigger className="h-12">
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
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 h-12 text-lg">Set Budget</Button>
                    <Button type="button" variant="outline" onClick={() => setShowBudgetManager(false)} className="flex-1 h-12">Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Paycheck Manager Modal */}
        {showPaycheckManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Set Monthly Paycheck</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowPaycheckManager(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetPaycheck} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Paycheck Amount (₦)</label>
                    <Input
                      type="number"
                      value={paycheckAmount}
                      onChange={(e) => setPaycheckAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      required
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      This helps us provide better budget allocation advice based on the 50/30/20 rule.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 h-12 text-lg">Set Paycheck</Button>
                    <Button type="button" variant="outline" onClick={() => setShowPaycheckManager(false)} className="flex-1 h-12">Cancel</Button>
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
