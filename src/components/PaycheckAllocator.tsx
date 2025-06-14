
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Lightbulb, Plus, X, DollarSign } from "lucide-react";
import { useState } from "react";

interface AllocationItem {
  id: string;
  category: string;
  amount: number;
  percentage: number;
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

  const addAllocation = () => {
    const newAllocation: AllocationItem = {
      id: Date.now().toString(),
      category: '',
      amount: 0,
      percentage: 0
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
      // Create AI-powered allocation based on user request
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
      { keywords: ['food', 'groceries', 'eating'], category: 'Food & Dining', suggestedPercentage: 15 },
      { keywords: ['rent', 'housing', 'accommodation'], category: 'Housing', suggestedPercentage: 30 },
      { keywords: ['transport', 'fuel', 'car', 'uber'], category: 'Transportation', suggestedPercentage: 15 },
      { keywords: ['savings', 'save', 'emergency'], category: 'Savings', suggestedPercentage: 20 },
      { keywords: ['entertainment', 'fun', 'movies'], category: 'Entertainment', suggestedPercentage: 10 },
      { keywords: ['bills', 'utilities', 'electricity'], category: 'Bills & Utilities', suggestedPercentage: 10 }
    ];

    // Check for specific amounts mentioned in the request
    const amountRegex = /(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = request.match(amountRegex)?.map(a => parseFloat(a.replace(/,/g, ''))) || [];

    let currentId = 1;
    let totalAllocated = 0;

    // Try to match categories with amounts
    categories.forEach(({ keywords, category, suggestedPercentage }) => {
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
          percentage: (amount / paycheck) * 100
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
          percentage: 50
        },
        {
          id: '2',
          category: 'Wants (Entertainment, Shopping)',
          amount: Math.round(paycheck * 0.3),
          percentage: 30
        },
        {
          id: '3',
          category: 'Savings & Investments',
          amount: Math.round(paycheck * 0.2),
          percentage: 20
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
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
              placeholder="e.g., 'I want 40,000 for food, 30,000 for transportation, and the rest for savings' or 'Help me budget for a family of 4'"
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

          {/* Manual Allocation Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Allocation Breakdown</h3>
              <Button onClick={addAllocation} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {allocations.map((allocation) => (
              <div key={allocation.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  value={allocation.category}
                  onChange={(e) => updateAllocation(allocation.id, 'category', e.target.value)}
                  placeholder="Category (e.g., Food, Rent)"
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

            {allocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No allocations yet</p>
                <p className="text-sm">Use AI generation or add categories manually.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {allocations.length > 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{getTotalAllocated().toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Remaining</p>
                    <p className={`text-lg font-semibold ${getRemainingAmount() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₦{getRemainingAmount().toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Utilization</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {((getTotalAllocated() / monthlyPaycheck) * 100).toFixed(1)}%
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
