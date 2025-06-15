import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star, Clock, Check, Play, Award, Target, TrendingUp, Calendar, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import LessonModal from "./LessonModal";

const LearningCompanion = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [searchTopic, setSearchTopic] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    estimatedTime: "",
    totalLessons: ""
  });

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

  const achievements = [
    { id: "first-course", name: "First Course Complete", icon: "🎓", earned: true, description: "Complete your first course" },
    { id: "streak-7", name: "7-Day Streak", icon: "🔥", earned: true, description: "Study for 7 consecutive days" },
    { id: "quiz-master", name: "Quiz Master", icon: "🧠", earned: false, description: "Score 100% on 5 quizzes" },
    { id: "speed-learner", name: "Speed Learner", icon: "⚡", earned: false, description: "Complete 10 lessons in one day" }
  ];

  const courseRecommendations = [
    {
      topic: "programming",
      courses: [
        { title: "Introduction to Python Programming", description: "Learn Python basics with hands-on projects", difficulty: "Beginner", estimatedTime: "6 weeks" },
        { title: "JavaScript for Web Development", description: "Master modern JavaScript and DOM manipulation", difficulty: "Intermediate", estimatedTime: "8 weeks" },
        { title: "Data Structures and Algorithms", description: "Build strong programming fundamentals", difficulty: "Advanced", estimatedTime: "12 weeks" }
      ]
    },
    {
      topic: "design",
      courses: [
        { title: "UI/UX Design Principles", description: "Create user-friendly interfaces and experiences", difficulty: "Beginner", estimatedTime: "5 weeks" },
        { title: "Graphic Design Fundamentals", description: "Learn design theory and Adobe Creative Suite", difficulty: "Beginner", estimatedTime: "6 weeks" },
        { title: "Advanced Prototyping with Figma", description: "Master interactive prototypes and design systems", difficulty: "Intermediate", estimatedTime: "4 weeks" }
      ]
    },
    {
      topic: "business",
      courses: [
        { title: "Entrepreneurship Essentials", description: "Start and grow your own business", difficulty: "Beginner", estimatedTime: "7 weeks" },
        { title: "Project Management Professional", description: "Learn Agile, Scrum, and traditional PM methods", difficulty: "Intermediate", estimatedTime: "10 weeks" },
        { title: "Digital Marketing Strategy", description: "Comprehensive online marketing techniques", difficulty: "Intermediate", estimatedTime: "8 weeks" }
      ]
    }
  ];

  const handleStartLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "Lesson Completed! 🎉",
        description: "Great job! You're making excellent progress.",
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

  const handleSearchRecommendations = () => {
    if (!searchTopic.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please enter a topic to get course recommendations.",
      });
      return;
    }

    toast({
      title: "Recommendations Found!",
      description: `Here are some courses related to "${searchTopic}".`,
    });
  };

  const handleAddCustomCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and description.",
      });
      return;
    }

    toast({
      title: "Course Added!",
      description: `"${newCourse.title}" has been added to your learning path.`,
    });

    setNewCourse({
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      estimatedTime: "",
      totalLessons: ""
    });
    setShowAddCourse(false);
  };

  const getStreakDays = () => 7;
  const getTotalHours = () => 24.5;
  const getCertificatesEarned = () => 2;

  const getRecommendationsForTopic = (topic: string) => {
    const foundTopic = courseRecommendations.find(rec => 
      rec.topic.toLowerCase().includes(topic.toLowerCase())
    );
    return foundTopic ? foundTopic.courses : [];
  };

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
                      onClick={() => handleStartLesson(lesson)}
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
          {/* Course Recommendations */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Get Course Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter a topic (e.g., programming, design, business)"
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchRecommendations()}
                />
                <Button onClick={handleSearchRecommendations}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {searchTopic && getRecommendationsForTopic(searchTopic).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Recommended Courses for "{searchTopic}":</h4>
                  {getRecommendationsForTopic(searchTopic).map((course, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <h5 className="font-semibold text-gray-800">{course.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{course.difficulty}</Badge>
                        <span className="text-xs text-gray-500">{course.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddCourse(!showAddCourse)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Own Course
                </Button>
              </div>

              {showAddCourse && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700">Add Custom Course</h4>
                  <Input
                    placeholder="Course title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  />
                  <Input
                    placeholder="Course description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Category"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    />
                    <Input
                      placeholder="Estimated time"
                      value={newCourse.estimatedTime}
                      onChange={(e) => setNewCourse({...newCourse, estimatedTime: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddCustomCourse} size="sm">
                      Add Course
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddCourse(false)} size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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

        {/* Lesson Modal */}
        <LessonModal
          lesson={selectedLesson}
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onComplete={handleLessonComplete}
        />
      </div>
    </div>
  );
};

export default LearningCompanion;
