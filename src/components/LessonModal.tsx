
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Clock, BookOpen } from "lucide-react";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  completed: boolean;
  courseId: string;
  content?: string;
  videoUrl?: string;
}

interface LessonModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
}

const LessonModal = ({ lesson, isOpen, onClose, onComplete }: LessonModalProps) => {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!lesson) return null;

  const handleStart = () => {
    setHasStarted(true);
    // Simulate lesson progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(lesson.id);
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setProgress(0);
      setHasStarted(false);
      setIsCompleted(false);
    }, 1500);
  };

  const getLessonContent = () => {
    switch (lesson.type) {
      case "Video":
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Play className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <p className="text-gray-600">Video content would be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">Duration: {lesson.duration}</p>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>This lesson covers the fundamentals of {lesson.title.toLowerCase()}. You'll learn:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Key concepts and terminology</li>
                <li>Practical applications</li>
                <li>Best practices and tips</li>
                <li>Real-world examples</li>
              </ul>
            </div>
          </div>
        );
      case "Interactive":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <BookOpen className="w-12 h-12 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Interactive Learning Module</h4>
              <p className="text-gray-600 text-sm">
                This interactive lesson includes exercises, quizzes, and hands-on activities to help you master {lesson.title.toLowerCase()}.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Exercise 1</h5>
                <p className="text-xs text-gray-500">Practice activity</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-700 mb-1">Exercise 2</h5>
                <p className="text-xs text-gray-500">Case study</p>
              </div>
            </div>
          </div>
        );
      case "Quiz":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Knowledge Check</h4>
              <p className="text-gray-600 text-sm">
                Test your understanding with this quick quiz about {lesson.title.toLowerCase()}.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium text-gray-700">Sample Question:</p>
                <p className="text-sm text-gray-600 mt-1">What is the most important aspect of {lesson.title.toLowerCase()}?</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3" />
            <p>Lesson content loading...</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {lesson.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{lesson.type}</Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {lesson.duration}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          {hasStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Lesson Content */}
          <div className="space-y-4">
            {getLessonContent()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="space-x-2">
              {!hasStarted && !isCompleted && (
                <Button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Start Lesson
                </Button>
              )}
              {hasStarted && progress >= 100 && !isCompleted && (
                <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {isCompleted && (
                <Button disabled className="bg-green-500">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed!
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
