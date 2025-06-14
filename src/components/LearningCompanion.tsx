
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, Clock, Check } from "lucide-react";

const LearningCompanion = ({ onBack }: { onBack: () => void }) => {
  const currentCourses = [
    {
      title: "Digital Marketing Basics",
      progress: 60,
      totalLessons: 12,
      completedLessons: 7,
      timeLeft: "3 days left",
      category: "Business"
    },
    {
      title: "Web Development Fundamentals", 
      progress: 25,
      totalLessons: 16,
      completedLessons: 4,
      timeLeft: "2 weeks left",
      category: "Technology"
    },
    {
      title: "Personal Finance Management",
      progress: 80,
      totalLessons: 10,
      completedLessons: 8,
      timeLeft: "1 week left", 
      category: "Finance"
    }
  ];

  const todaysLessons = [
    {
      title: "Understanding Social Media Analytics",
      duration: "15 min",
      type: "Video",
      completed: false
    },
    {
      title: "Creating Engaging Content",
      duration: "20 min", 
      type: "Interactive",
      completed: false
    },
    {
      title: "Quiz: Marketing Fundamentals",
      duration: "5 min",
      type: "Quiz",
      completed: true
    }
  ];

  const achievements = [
    { name: "First Course Complete", icon: "🎓", earned: true },
    { name: "7-Day Streak", icon: "🔥", earned: true },
    { name: "Quiz Master", icon: "🧠", earned: false },
    { name: "Speed Learner", icon: "⚡", earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Learning Companion</h1>
            <p className="text-gray-600">Your personalized learning journey</p>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold mb-1">3</p>
              <p className="text-sm opacity-90">Active Courses</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold mb-1">19</p>
              <p className="text-sm opacity-90">Lessons Completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold mb-1">7</p>
              <p className="text-sm opacity-90">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold mb-1">2.5h</p>
              <p className="text-sm opacity-90">This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCourses.map((course, index) => (
                <div key={course.title} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{course.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{course.category}</Badge>
                        <span className="text-xs text-gray-500">{course.timeLeft}</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Continue
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                      <span>{course.progress}% complete</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Lessons */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Today's Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysLessons.map((lesson, index) => (
                <div key={lesson.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      lesson.completed ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {lesson.completed ? 
                        <Check className="w-4 h-4 text-green-600" /> : 
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className={`font-medium ${lesson.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration}</span>
                        <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
                      </div>
                    </div>
                  </div>
                  {!lesson.completed && (
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.name} 
                  className={`p-4 rounded-lg text-center ${
                    achievement.earned ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <p className={`text-sm font-medium ${achievement.earned ? 'text-white' : 'text-gray-600'}`}>
                    {achievement.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningCompanion;
