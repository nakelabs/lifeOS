import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, Search, Plus, Target, TrendingUp, Calendar, ExternalLink, Clock, Star, Trophy, Minus, RotateCcw, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCourseRecommendations } from "@/hooks/useCourseRecommendations";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useUserInterests } from "@/hooks/useUserInterests";
import { useCourseCompletions } from "@/hooks/useCourseCompletions";
import { useUserStreaks } from "@/hooks/useUserStreaks";
import CelebrationEffect from "./CelebrationEffect";
import RecordsSection from "./RecordsSection";

const LearningCompanion = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const { recommendations, loading: recommendationsLoading, fetchRecommendationsByTopic } = useCourseRecommendations();
  const { courses, loading: coursesLoading, createCourse, updateCourseProgress } = useUserCourses();
  const { interests, updateUserInterests } = useUserInterests();
  const { markCourseCompleted } = useCourseCompletions();
  const { updateActivity, showStreakCelebration, streak } = useUserStreaks();

  // State for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // State for interests step
  const [currentStep, setCurrentStep] = useState<'interests' | 'recommendations' | 'create-course' | 'tracking' | 'records'>('interests');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interests);
  const [customInterest, setCustomInterest] = useState("");

  // State for course search
  const [searchTopic, setSearchTopic] = useState("");

  // State for course creation
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    course_url: "",
    instructor: "",
    duration: "",
    difficulty: "Beginner",
    total_lessons: "",
    target_completion_date: "",
    notes: ""
  });

  // State for course completion
  const [completingCourse, setCompletingCourse] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");

  // State for progress editing
  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);

  const predefinedInterests = [
    "Programming", "Web Development", "Data Science", "UI/UX Design", 
    "Digital Marketing", "Business", "Graphic Design", "Mobile Development",
    "Machine Learning", "Cybersecurity", "Project Management", "Photography"
  ];

  // Add clear history function
  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all your learning progress? This action cannot be undone.")) {
      // This would require a database function to clear all user's learning data
      // For now, we'll just show a toast
      toast({
        title: "Clear History",
        description: "This feature will be implemented to clear all learning progress",
      });
    }
  };

  // Update activity on component mount
  useEffect(() => {
    if (interests.length > 0) {
      updateActivity();
    }
  }, []);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const handleClearInterests = () => {
    setSelectedInterests([]);
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length === 0) {
      toast({
        title: "Select interests",
        description: "Please select at least one interest to continue",
      });
      return;
    }

    const result = await updateUserInterests(selectedInterests);
    if (!result.error) {
      setCurrentStep('recommendations');
      updateActivity(); // Update streak when saving interests
    }
  };

  const handleSearchRecommendations = () => {
    if (!searchTopic.trim()) {
      toast({
        title: "Enter a topic",
        description: "Please enter a topic to get course recommendations",
      });
      return;
    }
    fetchRecommendationsByTopic(searchTopic);
  };

  const handleCreateCourseFromRecommendation = (recommendation: any) => {
    setNewCourse({
      title: recommendation.title,
      description: recommendation.description,
      course_url: "",
      instructor: "",
      duration: recommendation.estimated_duration,
      difficulty: recommendation.difficulty,
      total_lessons: "",
      target_completion_date: "",
      notes: `Recommended skills: ${recommendation.skills.join(", ")}`
    });
    setShowCreateCourse(true);
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the title and description",
      });
      return;
    }

    const courseData = {
      ...newCourse,
      total_lessons: newCourse.total_lessons ? parseInt(newCourse.total_lessons) : undefined,
      target_completion_date: newCourse.target_completion_date || undefined
    };

    const result = await createCourse(courseData);
    if (!result.error) {
      setNewCourse({
        title: "",
        description: "",
        course_url: "",
        instructor: "",
        duration: "",
        difficulty: "Beginner",
        total_lessons: "",
        target_completion_date: "",
        notes: ""
      });
      setShowCreateCourse(false);
      setCurrentStep('tracking');
      updateActivity(); // Update streak when creating a course
    }
  };

  const handleStartEditProgress = (courseId: string, currentProgress: number) => {
    setEditingProgress(courseId);
    setTempProgress(currentProgress);
  };

  const handleCancelEditProgress = () => {
    setEditingProgress(null);
    setTempProgress(0);
  };

  const handleSaveProgress = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const completedLessons = course.total_lessons > 0 
      ? Math.floor((tempProgress / 100) * course.total_lessons)
      : course.completed_lessons;

    await updateCourseProgress(courseId, tempProgress, completedLessons);
    setEditingProgress(null);
    
    // Check if course is completed (100%)
    if (tempProgress === 100) {
      // Automatically mark course as completed
      const result = await markCourseCompleted(
        courseId, 
        course.title, 
        course.total_lessons || 0
      );

      if (!result.error) {
        setShowCelebration(true);
        updateActivity(); // Update streak on course completion
        
        // Show streak celebration if user has a streak
        if (streak && streak.current_streak > 1) {
          setTimeout(() => {
            showStreakCelebration(streak.current_streak);
          }, 2000);
        }

        toast({
          title: "🎉 Course Completed!",
          description: `Congratulations! "${course.title}" has been completed and added to your records.`,
        });
      }
    } else {
      toast({
        title: "Progress Updated!",
        description: `Course progress updated to ${tempProgress}%`,
      });
      updateActivity(); // Update streak on progress update
    }
  };

  const handleQuickProgressUpdate = async (courseId: string, increment: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newProgress = Math.min(100, Math.max(0, course.progress + increment));
    const completedLessons = course.total_lessons > 0 
      ? Math.floor((newProgress / 100) * course.total_lessons)
      : course.completed_lessons;

    await updateCourseProgress(courseId, newProgress, completedLessons);
    
    // Check if course is completed (100%)
    if (newProgress === 100) {
      // Automatically mark course as completed
      const result = await markCourseCompleted(
        courseId, 
        course.title, 
        course.total_lessons || 0
      );

      if (!result.error) {
        setShowCelebration(true);
        setCompletingCourse(null);
        setCompletionNotes("");
        updateActivity(); // Update streak on course completion
      
        // Show streak celebration if user has a streak
        if (streak && streak.current_streak > 1) {
          setTimeout(() => {
            showStreakCelebration(streak.current_streak);
          }, 2000);
        }
      }
    } else {
      toast({
        title: "Progress Updated!",
        description: `Course progress updated to ${newProgress}%`,
      });
      updateActivity(); // Update streak on progress update
    }
  };

  const handleCompleteCourse = async () => {
    if (!completingCourse) return;

    const course = courses.find(c => c.id === completingCourse);
    if (!course) return;

    const result = await markCourseCompleted(
      completingCourse, 
      course.title, 
      course.total_lessons || 0, 
      completionNotes
    );

    if (!result.error) {
      setShowCelebration(true);
      setCompletingCourse(null);
      setCompletionNotes("");
      updateActivity(); // Update streak on course completion
      
      // Show streak celebration if user has a streak
      if (streak && streak.current_streak > 1) {
        setTimeout(() => {
          showStreakCelebration(streak.current_streak);
        }, 2000);
      }
    }
  };

  if (interests.length === 0 && currentStep === 'interests') {
    // Show interests selection step
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-12">
            <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Learning Companion</h1>
                <p className="text-gray-500 text-lg">Let's discover what you're interested in learning</p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">What are you interested in learning?</CardTitle>
              <p className="text-gray-600">Select your interests so we can recommend the best courses for you</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {predefinedInterests.map((interest) => (
                  <Button
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    onClick={() => handleInterestToggle(interest)}
                    className="h-auto py-3 px-4 text-left justify-start"
                  >
                    {interest}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom interest..."
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()}
                />
                <Button onClick={handleAddCustomInterest} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {selectedInterests.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-700">Selected interests:</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearInterests}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="px-3 py-1">
                        {interest}
                        <button
                          onClick={() => handleInterestToggle(interest)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleSaveInterests} className="w-full" size="lg">
                Continue to Course Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main learning companion interface
  return (
    <div className="min-h-screen bg-gray-50">
      <CelebrationEffect 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
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

          <div className="flex space-x-2">
            <Button 
              variant={currentStep === 'recommendations' ? 'default' : 'outline'}
              onClick={() => setCurrentStep('recommendations')}
            >
              Find Courses
            </Button>
            <Button 
              variant={currentStep === 'tracking' ? 'default' : 'outline'}
              onClick={() => setCurrentStep('tracking')}
            >
              My Courses
            </Button>
            <Button 
              variant={currentStep === 'records' ? 'default' : 'outline'}
              onClick={() => setCurrentStep('records')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Records
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearHistory}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>

        {/* Records Section */}
        {currentStep === 'records' && <RecordsSection />}

        {/* Course Recommendations Section */}
        {currentStep === 'recommendations' && (
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Search className="w-6 h-6 mr-3 text-purple-500" />
                  Find Course Recommendations
                </CardTitle>
                <p className="text-gray-600">Search for courses based on topics you're interested in</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter a topic (e.g., programming, design, business)"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchRecommendations()}
                    className="text-base py-3"
                  />
                  <Button onClick={handleSearchRecommendations} disabled={recommendationsLoading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                {interests.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-medium text-gray-700">Your interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Button
                          key={interest}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTopic(interest.toLowerCase());
                            fetchRecommendationsByTopic(interest.toLowerCase());
                          }}
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-lg">Recommended Courses:</h4>
                    <div className="grid gap-6">
                      {recommendations.map((course) => (
                        <div key={course.id} className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900 text-lg mb-2">{course.title}</h5>
                              <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                              <div className="flex items-center space-x-3 mb-3">
                                <Badge variant="outline" className="font-medium">{course.difficulty}</Badge>
                                <span className="text-sm text-gray-500 font-medium flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {course.estimated_duration}
                                </span>
                              </div>
                              {course.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {course.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button 
                              onClick={() => handleCreateCourseFromRecommendation(course)}
                              className="ml-4"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to My Courses
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateCourse(true)}
                    className="w-full py-3 font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Tracking Section */}
        {currentStep === 'tracking' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-90" />
                  <p className="text-2xl font-bold mb-1">{courses.length}</p>
                  <p className="text-blue-100 font-medium">Active Courses</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-90" />
                  <p className="text-2xl font-bold mb-1">
                    {courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length) : 0}%
                  </p>
                  <p className="text-green-100 font-medium">Avg Progress</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-90" />
                  <p className="text-2xl font-bold mb-1">
                    {courses.reduce((acc, course) => acc + course.completed_lessons, 0)}
                  </p>
                  <p className="text-purple-100 font-medium">Completed Lessons</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Courses */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                  Your Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-6">Start by finding course recommendations or adding your own course</p>
                    <div className="space-x-4">
                      <Button onClick={() => setCurrentStep('recommendations')}>
                        Find Courses
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateCourse(true)}>
                        Add Custom Course
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-xl mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-3">{course.description}</p>
                            <div className="flex items-center space-x-4 mb-4">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                {course.difficulty}
                              </Badge>
                              {course.duration && (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {course.duration}
                                </span>
                              )}
                              {course.instructor && (
                                <span className="text-sm text-gray-500">
                                  by {course.instructor}
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">
                                  {course.completed_lessons} of {course.total_lessons || 'N/A'} lessons completed
                                </span>
                                <span className="text-blue-600 font-bold">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-3" />
                              
                              {/* Compact Modern Progress Update UI */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-gray-600">Update Progress</span>
                                  {editingProgress === course.id ? (
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelEditProgress}
                                        className="h-6 px-2 text-xs"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveProgress(course.id)}
                                        className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStartEditProgress(course.id, course.progress)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </div>
                                
                                {editingProgress === course.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={tempProgress}
                                      onChange={(e) => setTempProgress(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                      className="w-16 h-6 text-xs text-center font-semibold"
                                    />
                                    <span className="text-xs text-gray-600">%</span>
                                    <div className="flex-1">
                                      <Progress value={tempProgress} className="h-1.5" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuickProgressUpdate(course.id, -5)}
                                      className="w-7 h-7 p-0 rounded-full hover:bg-red-50 hover:border-red-200"
                                      disabled={course.progress <= 0}
                                    >
                                      <Minus className="w-3 h-3 text-red-600" />
                                    </Button>
                                    
                                    <div className="flex items-center px-3 py-1 bg-white rounded-md border shadow-sm">
                                      <span className="text-lg font-bold text-blue-600 min-w-[2.5rem] text-center">
                                        {course.progress}%
                                      </span>
                                    </div>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuickProgressUpdate(course.id, 5)}
                                      className="w-7 h-7 p-0 rounded-full hover:bg-green-50 hover:border-green-200"
                                      disabled={course.progress >= 100}
                                    >
                                      <Plus className="w-3 h-3 text-green-600" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {course.course_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={course.course_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Course
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Completion Modal */}
        {completingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Course Completed!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Congratulations! You've completed this course. Add any final notes about your learning experience:
                </p>
                <Textarea
                  placeholder="What did you learn? Any key takeaways?"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
                <div className="flex space-x-3">
                  <Button onClick={handleCompleteCourse} className="flex-1">
                    <Trophy className="w-4 h-4 mr-2" />
                    Complete Course
                  </Button>
                  <Button variant="outline" onClick={() => setCompletingCourse(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Course Modal */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Course to Your Learning Path</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Course Title *</label>
                    <Input
                      placeholder="e.g., Complete Python Bootcamp"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      placeholder="Brief description of what you'll learn"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Course URL</label>
                      <Input
                        placeholder="https://..."
                        value={newCourse.course_url}
                        onChange={(e) => setNewCourse({...newCourse, course_url: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Instructor</label>
                      <Input
                        placeholder="Instructor name"
                        value={newCourse.instructor}
                        onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <Input
                        placeholder="e.g., 8 weeks"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newCourse.difficulty}
                        onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value})}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Total Lessons</label>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        value={newCourse.total_lessons}
                        onChange={(e) => setNewCourse({...newCourse, total_lessons: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Completion Date</label>
                    <Input
                      type="date"
                      value={newCourse.target_completion_date}
                      onChange={(e) => setNewCourse({...newCourse, target_completion_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <Textarea
                      placeholder="Any additional notes about this course"
                      value={newCourse.notes}
                      onChange={(e) => setNewCourse({...newCourse, notes: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleCreateCourse} className="flex-1">
                    Add Course
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateCourse(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCompanion;
