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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Learning Companion</h1>
                <p className="text-gray-500 text-lg">Track your learning journey</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Streak</div>
            <div className="text-3xl font-bold text-orange-500 flex items-center justify-end mt-1">
              🔥 {getStreakDays()} days
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <Target className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <p className="text-4xl font-bold mb-2">{currentCourses.length}</p>
              <p className="text-blue-100 font-medium">Active Courses</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-8 text-center">
              <Check className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <p className="text-4xl font-bold mb-2">{currentCourses.reduce((total, course) => total + course.completedLessons, 0)}</p>
              <p className="text-green-100 font-medium">Lessons Completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <p className="text-4xl font-bold mb-2">{getTotalHours()}h</p>
              <p className="text-purple-100 font-medium">Total Hours</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8 text-center">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <p className="text-4xl font-bold mb-2">{getCertificatesEarned()}</p>
              <p className="text-orange-100 font-medium">Certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Courses */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
              Your Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {currentCourses.map((course) => (
                <div key={course.id} className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">{course.title}</h3>
                      <p className="text-gray-600 text-base mb-4 leading-relaxed">{course.description}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium px-3 py-1">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200 font-medium px-3 py-1">
                          {course.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          {course.estimatedTime}
                        </span>
                        <span className="text-sm text-orange-600 font-medium">{course.timeLeft}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">{course.completedLessons} of {course.totalLessons} lessons completed</span>
                      <span className="text-blue-600 font-bold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3 bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Today's Lessons */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-green-500" />
                  Today's Recommended Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {todaysLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-5">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          lesson.completed || completedLessons.includes(lesson.id) 
                            ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {lesson.completed || completedLessons.includes(lesson.id) ? 
                            <Check className="w-6 h-6 text-green-600" /> : 
                            <Play className="w-6 h-6 text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className={`font-semibold text-lg ${
                            lesson.completed || completedLessons.includes(lesson.id) 
                              ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center font-medium">
                              <Clock className="w-3 h-3 mr-1" />
                              {lesson.duration}
                            </span>
                            <Badge variant="outline" className="text-xs font-medium">{lesson.type}</Badge>
                          </div>
                        </div>
                      </div>
                      {!(lesson.completed || completedLessons.includes(lesson.id)) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStartLesson(lesson)}
                          className="hover:bg-blue-50 hover:border-blue-300 font-medium px-6"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-5 rounded-xl border-2 transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-base ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                          {achievement.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-yellow-500 text-white font-medium">Earned!</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Recommendations */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Search className="w-6 h-6 mr-3 text-purple-500" />
              Find New Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            <div className="flex space-x-3">
              <Input
                placeholder="Enter a topic (e.g., programming, design, business)"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchRecommendations()}
                className="text-base py-3"
              />
              <Button onClick={handleSearchRecommendations} className="px-6 py-3">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {searchTopic && getRecommendationsForTopic(searchTopic).length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-lg">Recommended Courses for "{searchTopic}":</h4>
                <div className="grid gap-4">
                  {getRecommendationsForTopic(searchTopic).map((course, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 text-lg mb-2">{course.title}</h5>
                      <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-medium">{course.difficulty}</Badge>
                        <span className="text-sm text-gray-500 font-medium">{course.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="w-full py-3 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your Own Course
              </Button>
            </div>

            {showAddCourse && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-800 text-lg">Add Custom Course</h4>
                <div className="space-y-4">
                  <Input
                    placeholder="Course title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="text-base"
                  />
                  <Input
                    placeholder="Course description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    className="text-base"
                  />
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex space-x-3">
                    <Button onClick={handleAddCustomCourse} className="font-semibold">
                      Add Course
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddCourse(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
