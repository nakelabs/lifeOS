
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, Clock, Check, Play, Award, Target, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const LearningCompanion = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const currentCourses = [
    {
      id: "digital-marketing",
      title: "Digital Marketing Basics",
      progress: 60,
      totalLessons: 12,
      completedLessons: 7,
      timeLeft: "3 days left",
      category: "Business",
      description: "Learn the fundamentals of digital marketing, social media, and online advertising.",
      difficulty: "Beginner",
      estimatedTime: "4 weeks"
    },
    {
      id: "web-development",
      title: "Web Development Fundamentals", 
      progress: 25,
      totalLessons: 16,
      completedLessons: 4,
      timeLeft: "2 weeks left",
      category: "Technology",
      description: "Master HTML, CSS, JavaScript and build your first websites.",
      difficulty: "Beginner",
      estimatedTime: "6 weeks"
    },
    {
      id: "personal-finance",
      title: "Personal Finance Management",
      progress: 80,
      totalLessons: 10,
      completedLessons: 8,
      timeLeft: "1 week left", 
      category: "Finance",
      description: "Take control of your finances with budgeting, investing, and saving strategies.",
      difficulty: "Intermediate",
      estimatedTime: "3 weeks"
    }
  ];

  const todaysLessons = [
    {
      id: "social-media-analytics",
      title: "Understanding Social Media Analytics",
      duration: "15 min",
      type: "Video",
      completed: false,
      courseId: "digital-marketing"
    },
    {
      id: "engaging-content",
      title: "Creating Engaging Content",
      duration: "20 min", 
      type: "Interactive",
      completed: false,
      courseId: "digital-marketing"
    },
    {
      id: "marketing-quiz",
      title: "Quiz: Marketing Fundamentals",
      duration: "5 min",
      type: "Quiz",
      completed: true,
      courseId: "digital-marketing"
    }
  ];

  const availableCourses = [
    {
      id: "data-science",
      title: "Introduction to Data Science",
      category: "Technology",
      difficulty: "Intermediate",
      duration: "8 weeks",
      lessons: 20,
      rating: 4.8,
      enrolled: false
    },
    {
      id: "creative-writing",
      title: "Creative Writing Workshop",
      category: "Arts",
      difficulty: "Beginner",
      duration: "4 weeks", 
      lessons: 12,
      rating: 4.6,
      enrolled: false
    },
    {
      id: "project-management",
      title: "Project Management Essentials",
      category: "Business",
      difficulty: "Intermediate",
      duration: "5 weeks",
      lessons: 15,
      rating: 4.7,
      enrolled: false
    }
  ];

  const achievements = [
    { id: "first-course", name: "First Course Complete", icon: "🎓", earned: true, description: "Complete your first course" },
    { id: "streak-7", name: "7-Day Streak", icon: "🔥", earned: true, description: "Study for 7 consecutive days" },
    { id: "quiz-master", name: "Quiz Master", icon: "🧠", earned: false, description: "Score 100% on 5 quizzes" },
    { id: "speed-learner", name: "Speed Learner", icon: "⚡", earned: false, description: "Complete 10 lessons in one day" }
  ];

  const handleStartLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "Lesson Started!",
        description: "Great job! Keep up the learning momentum.",
      });
    }
  };

  const handleContinueCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    toast({
      title: "Course Opened",
      description: "Continue where you left off!",
    });
  };

  const handleEnrollCourse = (courseId: string) => {
    toast({
      title: "Enrolled Successfully!",
      description: "You can start learning right away.",
    });
  };

  const getStreakDays = () => 7;
  const getTotalHours = () => 24.5;
  const getCertificatesEarned = () => 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Learning Companion</h1>
                  <p className="text-gray-600">Your personalized learning journey</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl font-bold text-orange-500 flex items-center">
              🔥 {getStreakDays()} days
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{currentCourses.length}</p>
              <p className="text-sm opacity-90">Active Courses</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <Check className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{currentCourses.reduce((total, course) => total + course.completedLessons, 0)}</p>
              <p className="text-sm opacity-90">Lessons Completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{getTotalHours()}h</p>
              <p className="text-sm opacity-90">Total Hours</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{getCertificatesEarned()}</p>
              <p className="text-sm opacity-90">Certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Your Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCourses.map((course) => (
                <div key={course.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">{course.category}</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200">{course.difficulty}</Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.estimatedTime}
                        </span>
                        <span className="text-xs text-gray-500">{course.timeLeft}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                      <span className="font-semibold text-blue-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Lessons */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Recommended Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed || completedLessons.includes(lesson.id) 
                        ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {lesson.completed || completedLessons.includes(lesson.id) ? 
                        <Check className="w-5 h-5 text-green-600" /> : 
                        <Play className="w-5 h-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className={`font-medium ${
                        lesson.completed || completedLessons.includes(lesson.id) 
                          ? 'text-gray-500 line-through' : 'text-gray-800'
                      }`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
                      </div>
                    </div>
                  </div>
                  {!(lesson.completed || completedLessons.includes(lesson.id)) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStartLesson(lesson.id)}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Available Courses */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Discover New Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableCourses.map((course) => (
                  <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{course.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{course.category}</Badge>
                          <Badge variant="outline">{course.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1">{course.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleEnrollCourse(course.id)}
                    >
                      Enroll Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <p className={`font-medium ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                          {achievement.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-yellow-500 text-white ml-auto">Earned!</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningCompanion;
