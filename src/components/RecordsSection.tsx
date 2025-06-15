
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, BookOpen, TrendingUp, Award } from "lucide-react";
import { useCourseCompletions } from "@/hooks/useCourseCompletions";
import { useUserStreaks } from "@/hooks/useUserStreaks";
import { format } from "date-fns";

const RecordsSection = () => {
  const { completions, loading: completionsLoading } = useCourseCompletions();
  const { streak, loading: streakLoading } = useUserStreaks();

  if (completionsLoading || streakLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h2 className="text-3xl font-bold text-gray-900">Your Learning Records</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <p className="text-2xl font-bold mb-1">{completions.length}</p>
            <p className="text-yellow-100 font-medium">Courses Completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <p className="text-2xl font-bold mb-1">{streak?.current_streak || 0}</p>
            <p className="text-green-100 font-medium">Current Streak</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <p className="text-2xl font-bold mb-1">{streak?.longest_streak || 0}</p>
            <p className="text-purple-100 font-medium">Longest Streak</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <p className="text-2xl font-bold mb-1">{streak?.total_active_days || 0}</p>
            <p className="text-blue-100 font-medium">Active Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Courses */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-green-500" />
            Completed Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completions.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No completed courses yet</h3>
              <p className="text-gray-500">Complete your first course to see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completions.map((completion) => (
                <div key={completion.id} className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{completion.course_title}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(completion.completed_at), 'MMM dd, yyyy')}
                    </span>
                    {completion.total_lessons > 0 && (
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {completion.total_lessons} lessons
                      </span>
                    )}
                  </div>
                  {completion.final_notes && (
                    <p className="text-gray-600 text-sm bg-white p-3 rounded-lg border">
                      {completion.final_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Information */}
      {streak && streak.current_streak > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              🔥 Your Learning Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {streak.current_streak}
                </div>
                <p className="text-gray-600">Days in a row</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-800 mb-2">
                  Since {format(new Date(streak.streak_start_date), 'MMM dd')}
                </div>
                <p className="text-gray-600">Keep it up!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecordsSection;
