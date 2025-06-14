
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Lightbulb, Plus, X, DollarSign, Target, Car, House } from "lucide-react";
import { useState } from "react";

interface AllocationItem {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  type?: 'regular' | 'special' | 'savings';
}

interface PaycheckAllocatorProps {
  monthlyPaycheck: number;
  onClose: () => void;
  onSaveAllocation: (allocations: AllocationItem[]) => void;
}

const PaycheckAllocator = ({ monthlyPaycheck, onClose, onSaveAllocation }: PaycheckAllocatorProps) => {
  const { toast } = useToast();
  const [allocations, setAllocations] = useState<AllocationItem[]>([]);
  const [userRequest, setUserRequest] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'regular' | 'special' | 'savings'>('regular');

  const addAllocation = (type: 'regular' | 'special' | 'savings' = 'regular') => {
    const newAllocation: AllocationItem = {
      id: Date.now().toString(),
      category: '',
      amount: 0,
      percentage: 0,
      type
    };
    setAllocations([...allocations, newAllocation]);
  };

  const updateAllocation = (id: string, field: 'category' | 'amount', value: string | number) => {
    setAllocations(allocations.map(allocation => {
      if (allocation.id === id) {
        const updated = { ...allocation, [field]: value };
        if (field === 'amount') {
          updated.percentage = monthlyPaycheck > 0 ? (Number(value) / monthlyPaycheck) * 100 : 0;
        }
        return updated;
      }
      return allocation;
    }));
  };

  const removeAllocation = (id: string) => {
    setAllocations(allocations.filter(allocation => allocation.id !== id));
  };

  const getTotalAllocated = () => {
    return allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
  };

  const getRemainingAmount = () => {
    return monthlyPaycheck - getTotalAllocated();
  };

  const getAllocationsByType = (type: 'regular' | 'special' | 'savings') => {
    return allocations.filter(allocation => allocation.type === type);
  };

  const generateAIAllocation = async () => {
    if (!userRequest.trim()) {
      toast({
        title: "Error",
        description: "Please describe how you'd like to allocate your paycheck",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const suggestion = generateAllocationSuggestion(userRequest, monthlyPaycheck);
      setAiSuggestion(suggestion.advice);
      setAllocations(suggestion.allocations);
      
      toast({
        title: "Success",
        description: "AI allocation generated successfully",
      });
    } catch (error) {
      console.error('Error generating AI allocation:', error);
      toast({
        title: "Error",
        description: "Failed to generate allocation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAllocationSuggestion = (request: string, paycheck: number) => {
    const lowerRequest = request.toLowerCase();
    let allocations: AllocationItem[] = [];
    let advice = '';

    // Parse common allocation requests
    const categories = [
      { keywords: ['food', 'groceries', 'eating'], category: 'Food & Dining', suggestedPercentage: 15, type: 'regular' as const },
      { keywords: ['rent', 'housing', 'accommodation'], category: 'Housing', suggestedPercentage: 30, type: 'regular' as const },
      { keywords: ['transport', 'fuel', 'uber'], category: 'Transportation', suggestedPercentage: 15, type: 'regular' as const },
      { keywords: ['entertainment', 'fun', 'movies'], category: 'Entertainment', suggestedPercentage: 10, type: 'regular' as const },
      { keywords: ['bills', 'utilities', 'electricity'], category: 'Bills & Utilities', suggestedPercentage: 10, type: 'regular' as const },
      { keywords: ['car', 'vehicle', 'auto'], category: 'Car Fund', suggestedPercentage: 10, type: 'special' as const },
      { keywords: ['house', 'home', 'property'], category: 'House Fund', suggestedPercentage: 15, type: 'special' as const },
      { keywords: ['savings', 'save', 'emergency'], category: 'Emergency Fund', suggestedPercentage: 20, type: 'savings' as const },
      { keywords: ['investment', 'invest'], category: 'Investment', suggestedPercentage: 10, type: 'savings' as const }
    ];

    // Check for specific amounts mentioned in the request
    const amountRegex = /(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = request.match(amountRegex)?.map(a => parseFloat(a.replace(/,/g, ''))) || [];

    let currentId = 1;
    let totalAllocated = 0;

    // Try to match categories with amounts
    categories.forEach(({ keywords, category, suggestedPercentage, type }) => {
      const mentioned = keywords.some(keyword => lowerRequest.includes(keyword));
      if (mentioned) {
        let amount = 0;
        if (amounts.length > 0) {
          amount = amounts.shift() || (paycheck * suggestedPercentage) / 100;
        } else {
          amount = (paycheck * suggestedPercentage) / 100;
        }
        
        allocations.push({
          id: currentId.toString(),
          category,
          amount: Math.round(amount),
          percentage: (amount / paycheck) * 100,
          type
        });
        totalAllocated += amount;
        currentId++;
      }
    });

    // If no specific categories were mentioned, suggest 50/30/20 rule
    if (allocations.length === 0) {
      allocations = [
        {
          id: '1',
          category: 'Needs (Housing, Food, Bills)',
          amount: Math.round(paycheck * 0.5),
          percentage: 50,
          type: 'regular'
        },
        {
          id: '2',
          category: 'Wants (Entertainment, Shopping)',
          amount: Math.round(paycheck * 0.3),
          percentage: 30,
          type: 'regular'
        },
        {
          id: '3',
          category: 'Savings & Investments',
          amount: Math.round(paycheck * 0.2),
          percentage: 20,
          type: 'savings'
        }
      ];
      totalAllocated = paycheck;
      advice = "I've suggested the popular 50/30/20 budgeting rule: 50% for needs, 30% for wants, and 20% for savings. This is a balanced approach that ensures you cover essentials while building wealth.";
    } else {
      const remaining = paycheck - totalAllocated;
      advice = `Based on your request, I've allocated ₦${totalAllocated.toLocaleString()} (${((totalAllocated/paycheck)*100).toFixed(1)}%) of your paycheck. You have ₦${remaining.toLocaleString()} remaining. Consider allocating this to savings or emergency fund.`;
    }

    return { allocations, advice };
  };

  const handleSave = () => {
    if (allocations.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one allocation",
        variant: "destructive",
      });
      return;
    }

    const totalAllocated = getTotalAllocated();
    if (totalAllocated > monthlyPaycheck) {
      toast({
        title: "Error",
        description: "Total allocation exceeds your paycheck amount",
        variant: "destructive",
      });
      return;
    }

    onSaveAllocation(allocations);
    toast({
      title: "Success",
      description: "Paycheck allocation saved successfully",
    });
    onClose();
  };

  const TabButton = ({ type, label, icon: Icon }: { type: 'regular' | 'special' | 'savings', label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === type
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const renderAllocationForm = (type: 'regular' | 'special' | 'savings') => {
    const typeAllocations = getAllocationsByType(type);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {type === 'regular' ? 'Regular Expenses' : 
             type === 'special' ? 'Special Purchases' : 'Savings Goals'}
          </h3>
          <Button onClick={() => addAllocation(type)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add {type === 'regular' ? 'Expense' : type === 'special' ? 'Goal' : 'Savings'}
          </Button>
        </div>

        {typeAllocations.map((allocation) => (
          <div key={allocation.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Input
              value={allocation.category}
              onChange={(e) => updateAllocation(allocation.id, 'category', e.target.value)}
              placeholder={
                type === 'regular' ? 'Category (e.g., Food, Rent)' :
                type === 'special' ? 'Goal (e.g., Car, House)' :
                'Savings (e.g., Emergency Fund)'
              }
              className="flex-1"
            />
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <Input
                type="number"
                value={allocation.amount || ''}
                onChange={(e) => updateAllocation(allocation.id, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Amount"
                className="w-32"
              />
            </div>
            <span className="text-sm text-gray-600 w-16 text-center">
              {allocation.percentage.toFixed(1)}%
            </span>
            <Button
              onClick={() => removeAllocation(allocation.id)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {typeAllocations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              {type === 'regular' ? <Calculator className="w-6 h-6 text-gray-400" /> :
               type === 'special' ? <Target className="w-6 h-6 text-gray-400" /> :
               <DollarSign className="w-6 h-6 text-gray-400" />}
            </div>
            <p className="mb-2">No {type} allocations yet</p>
            <p className="text-sm">Add your first {type} allocation.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Paycheck Allocator
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Monthly Paycheck: ₦{monthlyPaycheck.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* AI Request Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Ask AI to Allocate Your Paycheck</h3>
            <Textarea
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              placeholder="e.g., 'I want 40,000 for food, 20,000 for car savings, and 30,000 for house fund' or 'Help me save for a car while covering my expenses'"
              rows={3}
              className="resize-none"
            />
            <Button onClick={generateAIAllocation} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'Generating...' : 'Generate AI Allocation'}
              <Lightbulb className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">AI Recommendation</h4>
                    <p className="text-sm text-blue-700">{aiSuggestion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allocation Tabs */}
          <div className="space-y-6">
            <div className="flex space-x-2 border-b border-gray-200">
              <TabButton type="regular" label="Regular" icon={Calculator} />
              <TabButton type="special" label="Special" icon={Target} />
              <TabButton type="savings" label="Savings" icon={DollarSign} />
            </div>

            {renderAllocationForm(activeTab)}
          </div>

          {/* Summary */}
          {allocations.length > 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{getTotalAllocated().toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Regular</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ₦{getAllocationsByType('regular').reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Special/Savings</p>
                    <p className="text-lg font-semibold text-green-600">
                      ₦{(getAllocationsByType('special').reduce((sum, a) => sum + a.amount, 0) + 
                        getAllocationsByType('savings').reduce((sum, a) => sum + a.amount, 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Remaining</p>
                    <p className={`text-lg font-semibold ${getRemainingAmount() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₦{getRemainingAmount().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Save Allocation
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaycheckAllocator;
