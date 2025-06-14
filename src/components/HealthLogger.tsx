
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Moon, Activity, Heart, Plus, Minus } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';
import { useToast } from '@/hooks/use-toast';

interface QuickLogButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  type: string;
  unit: string;
  color: string;
  defaultValue?: number;
  isTime?: boolean;
  onLog: (type: string, value: number, unit: string) => void;
}

const QuickLogButton = ({ icon: Icon, label, type, unit, color, defaultValue = 1, isTime = false, onLog }: QuickLogButtonProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);

  const handleQuickLog = () => {
    if (isTime) {
      const totalHours = hours + (minutes / 60);
      onLog(type, totalHours, 'hours');
    } else {
      onLog(type, value, unit);
    }
    setIsLogging(false);
  };

  const incrementValue = () => {
    if (isTime) {
      if (minutes >= 45) {
        setHours(h => h + 1);
        setMinutes(0);
      } else {
        setMinutes(m => m + 15);
      }
    } else {
      setValue(v => v + 1);
    }
  };

  const decrementValue = () => {
    if (isTime) {
      if (minutes <= 0 && hours > 0) {
        setHours(h => h - 1);
        setMinutes(45);
      } else if (minutes > 0) {
        setMinutes(m => m - 15);
      }
    } else {
      setValue(v => Math.max(0, v - 1));
    }
  };

  if (isLogging) {
    return (
      <Card className="p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientFromColor(color)} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-800 text-lg">{label}</span>
              <p className="text-sm text-gray-500">Log your {label.toLowerCase()}</p>
            </div>
          </div>
          
          {isTime ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Hours</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHours(Math.max(0, hours - 1))}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-12 text-center">
                      <span className="text-2xl font-bold text-gray-800">{hours}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHours(hours + 1)}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-gray-400">:</div>
                
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Minutes</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMinutes(Math.max(0, minutes - 15))}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-12 text-center">
                      <span className="text-2xl font-bold text-gray-800">{minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMinutes(Math.min(45, minutes + 15))}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500">Total: {hours}h {minutes}m</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                onClick={decrementValue}
                className="w-12 h-12 rounded-full hover:scale-110 transition-transform"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="flex flex-col items-center space-y-2">
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-20 text-center text-2xl font-bold border-2 rounded-lg"
                />
                <span className="text-sm text-gray-500 font-medium">{unit}</span>
              </div>
              <Button
                variant="outline"
                onClick={incrementValue}
                className="w-12 h-12 rounded-full hover:scale-110 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={handleQuickLog} 
              className={`flex-1 bg-gradient-to-r ${getGradientFromColor(color)} hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold`}
            >
              Log {label}
            </Button>
            <Button 
              onClick={() => setIsLogging(false)} 
              variant="outline" 
              className="px-6 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsLogging(true)}
      className={`h-24 flex flex-col items-center justify-center space-y-3 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50 group relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${getGradientFromColor(color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientFromColor(color)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="relative z-10">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <p className="text-xs text-gray-500">Tap to log</p>
      </div>
    </Button>
  );
};

const getGradientFromColor = (color: string) => {
  switch (color) {
    case 'text-blue-500':
      return 'from-blue-500 to-cyan-500';
    case 'text-purple-500':
      return 'from-purple-500 to-indigo-500';
    case 'text-green-500':
      return 'from-green-500 to-emerald-500';
    case 'text-red-500':
      return 'from-red-500 to-pink-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const HealthLogger = () => {
  const { addHealthData } = useHealthData();
  const { toast } = useToast();

  const handleLog = async (type: string, value: number, unit: string) => {
    console.log('Logging health data:', { type, value, unit });
    
    const result = await addHealthData(type, value, unit);
    
    if (result.error) {
      toast({
        title: "Oops! 😅",
        description: `Failed to log ${type}: ${result.error}`,
        variant: "destructive"
      });
    } else {
      const emojis = {
        water: "💧",
        sleep: "😴",
        exercise: "💪",
        heart_rate: "❤️"
      };
      
      toast({
        title: `${emojis[type as keyof typeof emojis] || "✅"} Success!`,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} logged successfully!`,
      });
    }
  };

  const quickActions = [
    { icon: Droplets, label: "Water", type: "water", unit: "glasses", color: "text-blue-500", defaultValue: 1 },
    { icon: Moon, label: "Sleep", type: "sleep", unit: "hours", color: "text-purple-500", defaultValue: 8, isTime: true },
    { icon: Activity, label: "Exercise", type: "exercise", unit: "minutes", color: "text-green-500", defaultValue: 30 },
    { icon: Heart, label: "Heart Rate", type: "heart_rate", unit: "bpm", color: "text-red-500", defaultValue: 72 }
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span>Quick Health Log</span>
        </CardTitle>
        <p className="text-gray-600">Track your daily wellness activities</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <QuickLogButton
              key={action.type}
              icon={action.icon}
              label={action.label}
              type={action.type}
              unit={action.unit}
              color={action.color}
              defaultValue={action.defaultValue}
              isTime={action.isTime}
              onLog={handleLog}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthLogger;
