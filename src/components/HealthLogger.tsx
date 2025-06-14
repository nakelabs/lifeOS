
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Moon, Activity, Heart } from "lucide-react";
import { useHealthData } from '@/hooks/useHealthData';
import { useToast } from '@/hooks/use-toast';

interface QuickLogButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  type: string;
  unit: string;
  color: string;
  defaultValue?: number;
  onLog: (type: string, value: number, unit: string) => void;
}

const QuickLogButton = ({ icon: Icon, label, type, unit, color, defaultValue = 1, onLog }: QuickLogButtonProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleQuickLog = () => {
    onLog(type, value, unit);
    setIsLogging(false);
  };

  if (isLogging) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="font-medium">{label}</span>
          </div>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder={`Enter ${unit}`}
          />
          <div className="flex space-x-2">
            <Button onClick={handleQuickLog} size="sm">Log</Button>
            <Button onClick={() => setIsLogging(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsLogging(true)}
      className="h-16 flex flex-col items-center justify-center space-y-1"
    >
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-sm">{label}</span>
    </Button>
  );
};

const HealthLogger = () => {
  const { addHealthData } = useHealthData();
  const { toast } = useToast();

  const handleLog = async (type: string, value: number, unit: string) => {
    console.log('Logging health data:', { type, value, unit });
    
    const result = await addHealthData(type, value, unit);
    
    if (result.error) {
      toast({
        title: "Error",
        description: `Failed to log ${type}: ${result.error}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} logged successfully!`
      });
    }
  };

  const quickActions = [
    { icon: Droplets, label: "Water", type: "water", unit: "glasses", color: "text-blue-500", defaultValue: 1 },
    { icon: Moon, label: "Sleep", type: "sleep", unit: "hours", color: "text-purple-500", defaultValue: 8 },
    { icon: Activity, label: "Exercise", type: "exercise", unit: "minutes", color: "text-green-500", defaultValue: 30 },
    { icon: Heart, label: "Heart Rate", type: "heart_rate", unit: "bpm", color: "text-red-500", defaultValue: 72 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Quick Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickLogButton
              key={action.type}
              icon={action.icon}
              label={action.label}
              type={action.type}
              unit={action.unit}
              color={action.color}
              defaultValue={action.defaultValue}
              onLog={handleLog}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthLogger;
