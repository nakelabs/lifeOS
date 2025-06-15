
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Clock } from "lucide-react";

interface MindfulnessTimerProps {
  exercise: {
    title: string;
    description: string;
    duration: string;
    icon: any;
  };
  onClose: () => void;
}

const MindfulnessTimer = ({ exercise, onClose }: MindfulnessTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Parse duration (e.g., "5 min" -> 300 seconds)
  const parseDuration = (duration: string) => {
    const minutes = parseInt(duration.replace(/\D/g, ''));
    return minutes * 60;
  };

  useEffect(() => {
    setTimeLeft(parseDuration(exercise.duration));
  }, [exercise.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(parseDuration(exercise.duration));
    setIsCompleted(false);
  };

  const progress = ((parseDuration(exercise.duration) - timeLeft) / parseDuration(exercise.duration)) * 100;

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <exercise.icon className="w-6 h-6 text-blue-500" />
          <span>{exercise.title}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">{exercise.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-blue-600">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold">🎉 Exercise Complete!</p>
            <p className="text-sm text-green-600">Great job on completing your mindfulness practice.</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600">
              <Play className="w-4 h-4 mr-2" />
              {timeLeft === parseDuration(exercise.duration) ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleStop} variant="outline">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MindfulnessTimer;
