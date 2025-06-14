
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Target, Droplets, Moon, Activity, Heart, Save } from "lucide-react";
import { useHealthGoals } from '@/hooks/useHealthGoals';
import { useToast } from '@/hooks/use-toast';

const GoalsSettings = ({ onBack }: { onBack: () => void }) => {
  const { goals, updateGoals, loading } = useHealthGoals();
  const { toast } = useToast();
  
  const [waterGoal, setWaterGoal] = useState(goals.water_goal);
  const [sleepGoal, setSleepGoal] = useState(goals.sleep_goal);
  const [exerciseGoal, setExerciseGoal] = useState(goals.exercise_goal);
  const [heartRateTarget, setHeartRateTarget] = useState(goals.heart_rate_target);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    const result = await updateGoals({
      water_goal: waterGoal,
      sleep_goal: sleepGoal,
      exercise_goal: exerciseGoal,
      heart_rate_target: heartRateTarget
    });

    if (result.error) {
      toast({
        title: "Error",
        description: `Failed to update goals: ${result.error}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "🎯 Goals Updated!",
        description: "Your daily health goals have been saved successfully.",
      });
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  const goalSettings = [
    {
      icon: Droplets,
      label: "Daily Water Goal",
      value: waterGoal,
      setValue: setWaterGoal,
      unit: "glasses",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      min: 1,
      max: 20
    },
    {
      icon: Moon,
      label: "Sleep Goal",
      value: sleepGoal,
      setValue: setSleepGoal,
      unit: "hours",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      min: 4,
      max: 12,
      step: 0.5
    },
    {
      icon: Activity,
      label: "Exercise Goal",
      value: exerciseGoal,
      setValue: setExerciseGoal,
      unit: "minutes",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      min: 5,
      max: 180
    },
    {
      icon: Heart,
      label: "Heart Rate Target",
      value: heartRateTarget,
      setValue: setHeartRateTarget,
      unit: "bpm",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      min: 60,
      max: 200
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span>Health Goals</span>
            </h1>
            <p className="text-gray-600 ml-13">Customize your daily health targets</p>
          </div>
        </div>

        {/* Goals Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {goalSettings.map((setting, index) => (
            <Card key={setting.label} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${setting.bgColor} relative overflow-hidden group`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className={`w-full h-full bg-gradient-to-r ${setting.color}`}></div>
              </div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${setting.color} flex items-center justify-center shadow-md`}>
                      <setting.icon className="w-5 h-5 text-white" />
                    </div>
                    <span>{setting.label}</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={setting.label} className="text-sm font-medium text-gray-700">
                      Target ({setting.unit})
                    </Label>
                    <Input
                      id={setting.label}
                      type="number"
                      value={setting.value}
                      onChange={(e) => setting.setValue(Number(e.target.value))}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step || 1}
                      className="mt-2 text-lg font-semibold border-2 focus:border-blue-400"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: {setting.min} - {setting.max} {setting.unit}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Save Your Goals</h3>
                <p className="opacity-90">These goals will be used to track your daily progress and reset each day.</p>
              </div>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Goals'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsSettings;
