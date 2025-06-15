
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, BookOpen, Smile, Frown, Meh, Sun, Cloud } from "lucide-react";
import { useState, useEffect } from "react";
import { useEmotionalData } from "@/hooks/useEmotionalData";
import { useToast } from "@/hooks/use-toast";
import MindfulnessTimer from "./MindfulnessTimer";

const EmotionalWellbeing = ({ onBack }: { onBack: () => void }) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTimer, setActiveTimer] = useState<any>(null);
  
  const { moodEntries, loading, saveMoodEntry, getTodaysMood, getMoodStreak } = useEmotionalData();
  const { toast } = useToast();

  const moods = [
    { emoji: "😊", label: "Great", value: "great", color: "from-green-400 to-emerald-500", bgColor: "bg-green-50", textColor: "text-green-800", borderColor: "border-green-200" },
    { emoji: "🙂", label: "Good", value: "good", color: "from-blue-400 to-cyan-500", bgColor: "bg-blue-50", textColor: "text-blue-800", borderColor: "border-blue-200" },
    { emoji: "😐", label: "Okay", value: "okay", color: "from-yellow-400 to-orange-400", bgColor: "bg-yellow-50", textColor: "text-yellow-800", borderColor: "border-yellow-200" },
    { emoji: "😔", label: "Low", value: "low", color: "from-orange-400 to-red-400", bgColor: "bg-orange-50", textColor: "text-orange-800", borderColor: "border-orange-200" },
    { emoji: "😢", label: "Sad", value: "sad", color: "from-purple-400 to-pink-400", bgColor: "bg-purple-50", textColor: "text-purple-800", borderColor: "border-purple-200" }
  ];

  const affirmations = {
    great: [
      "✨ You're radiating positive energy today!",
      "🌟 Your joy is contagious - keep shining!",
      "🎉 What an amazing day to feel this wonderful!",
      "🚀 You're on top of the world - soar high!",
      "💫 Your greatness is inspiring others!"
    ],
    good: [
      "🌈 You're doing beautifully today!",
      "☀️ Your positive spirit brightens everything!",
      "🌸 Good vibes are flowing through you!",
      "🦋 You're gracefully navigating your day!",
      "🌻 Your smile makes the world better!"
    ],
    okay: [
      "🤗 It's perfectly okay to feel this way",
      "🌿 You're taking things one step at a time",
      "💙 Be gentle with yourself today",
      "🕊️ Sometimes okay is more than enough",
      "🌱 You're growing through whatever you're going through"
    ],
    low: [
      "🤲 You're stronger than you know",
      "🌙 This feeling will pass, you're not alone",
      "💚 It's brave to acknowledge how you feel",
      "🕯️ Even small steps forward count",
      "🌊 Let yourself feel, then let yourself heal"
    ],
    sad: [
      "💜 Your feelings are valid and important",
      "🫂 You deserve comfort and care",
      "🌧️ After every storm comes a rainbow",
      "🤗 It's okay to not be okay sometimes",
      "💝 You are loved more than you know"
    ]
  };

  // Get mood-based theme
  const getCurrentMoodTheme = () => {
    if (!selectedMood) return moods[2]; // Default to "okay"
    return moods.find(m => m.value === selectedMood) || moods[2];
  };

  const currentTheme = getCurrentMoodTheme();

  // Get mood-based background
  const getMoodBackground = () => {
    switch (selectedMood) {
      case 'great':
        return 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100';
      case 'good':
        return 'bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100';
      case 'okay':
        return 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100';
      case 'low':
        return 'bg-gradient-to-br from-orange-100 via-rose-50 to-red-100';
      case 'sad':
        return 'bg-gradient-to-br from-purple-100 via-violet-50 to-pink-100';
      default:
        return 'bg-gradient-to-br from-blue-50 via-white to-green-50';
    }
  };

  const getMoodBasedExercises = (mood: string) => {
    const exercisesByMood = {
      great: [
        {
          title: "Gratitude Dance",
          description: "Celebrate your positive energy with movement and gratitude",
          duration: "5 min",
          icon: Sun,
          color: "from-green-500 to-emerald-600"
        },
        {
          title: "Energy Boost Breathing",
          description: "Maintain your high energy with energizing breath work",
          duration: "3 min",
          icon: Cloud,
          color: "from-green-500 to-emerald-600"
        }
      ],
      good: [
        {
          title: "Mindful Appreciation",
          description: "Focus on what's going well in your life",
          duration: "5 min",
          icon: Sun,
          color: "from-blue-500 to-cyan-600"
        },
        {
          title: "Gentle Breathing",
          description: "Simple breathing to maintain your good mood",
          duration: "5 min",
          icon: Cloud,
          color: "from-blue-500 to-cyan-600"
        }
      ],
      okay: [
        {
          title: "Centering Breath",
          description: "Find your center with focused breathing",
          duration: "7 min",
          icon: Cloud,
          color: "from-yellow-500 to-orange-500"
        },
        {
          title: "Body Scan",
          description: "Progressive relaxation to ease tension",
          duration: "10 min",
          icon: Heart,
          color: "from-yellow-500 to-orange-500"
        }
      ],
      low: [
        {
          title: "Calming Breath Work",
          description: "Soothing breathing to lift your spirits",
          duration: "10 min",
          icon: Cloud,
          color: "from-orange-500 to-red-500"
        },
        {
          title: "Self-Compassion Meditation",
          description: "Practice being kind to yourself",
          duration: "8 min",
          icon: Heart,
          color: "from-orange-500 to-red-500"
        }
      ],
      sad: [
        {
          title: "Healing Breath",
          description: "Gentle breathing to process difficult emotions",
          duration: "12 min",
          icon: Heart,
          color: "from-purple-500 to-pink-500"
        },
        {
          title: "Comfort Body Scan",
          description: "Find physical comfort in your body",
          duration: "15 min",
          icon: Cloud,
          color: "from-purple-500 to-pink-500"
        }
      ]
    };

    return exercisesByMood[mood as keyof typeof exercisesByMood] || exercisesByMood.okay;
  };

  const currentExercises = selectedMood ? getMoodBasedExercises(selectedMood) : [
    {
      title: "5-Minute Breathing",
      description: "Simple breathing exercise to calm your mind",
      duration: "5 min",
      icon: Cloud,
      color: "from-blue-500 to-green-500"
    },
    {
      title: "Gratitude Reflection",
      description: "Think of three things you're grateful for today",
      duration: "3 min", 
      icon: Sun,
      color: "from-blue-500 to-green-500"
    },
    {
      title: "Body Scan",
      description: "Progressive relaxation from head to toe",
      duration: "10 min",
      icon: Heart,
      color: "from-blue-500 to-green-500"
    },
    {
      title: "Mindful Walking",
      description: "Focus on each step and your surroundings",
      duration: "15 min",
      icon: Sun,
      color: "from-blue-500 to-green-500"
    }
  ];

  // Load today's mood on component mount
  useEffect(() => {
    const todaysMood = getTodaysMood();
    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
      setJournalEntry(todaysMood.notes || "");
    }
  }, [moodEntries]);

  const handleSaveCheckIn = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await saveMoodEntry(selectedMood, journalEntry);

    if (result?.error) {
      toast({
        title: "Error saving check-in",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check-in saved! 🎉",
        description: "Your mood has been recorded for today.",
      });
    }

    setIsSubmitting(false);
  };

  const handleStartExercise = (exercise: any) => {
    setActiveTimer(exercise);
  };

  const formatMoodHistory = () => {
    return moodEntries.slice(0, 7).map(entry => {
      const moodData = moods.find(m => m.value === entry.mood);
      const date = new Date(entry.date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
      
      let dateLabel = date.toLocaleDateString();
      if (isToday) dateLabel = "Today";
      else if (isYesterday) dateLabel = "Yesterday";
      
      return {
        date: dateLabel,
        mood: entry.mood,
        note: entry.notes || `Feeling ${moodData?.label.toLowerCase()}`,
        emoji: moodData?.emoji || "😐",
        theme: moodData
      };
    });
  };

  const getCurrentAffirmation = () => {
    const moodAffirmations = affirmations[selectedMood as keyof typeof affirmations] || affirmations.okay;
    return moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your emotional wellbeing data...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show timer if active
  if (activeTimer) {
    return (
      <div className={`min-h-screen ${getMoodBackground()} flex items-center justify-center p-4 transition-all duration-500`}>
        <MindfulnessTimer 
          exercise={activeTimer} 
          onClose={() => setActiveTimer(null)} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${getMoodBackground()}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4 hover:scale-105 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Emotional Wellbeing
              </h1>
              <p className="text-gray-600 text-lg">Your mental health companion 💙</p>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent animate-pulse`}>
              {getMoodStreak()}
            </div>
            <div className="text-sm text-gray-600">Day streak 🔥</div>
          </div>
        </div>

        {/* Daily Mood Check-in */}
        <Card className={`mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${currentTheme.bgColor} ${currentTheme.borderColor} border-2`}>
          <CardHeader>
            <CardTitle className={`text-xl font-semibold ${currentTheme.textColor}`}>
              How are you feeling today? 🌈
              {getTodaysMood() && <span className="text-sm font-normal text-green-600 ml-2 animate-bounce">✅ Recorded!</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center space-y-2 hover:scale-110 transition-all duration-300 ${
                    selectedMood === mood.value 
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-lg animate-pulse` 
                      : `hover:bg-gradient-to-r hover:${mood.color} hover:text-white ${mood.bgColor}`
                  }`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span className="text-3xl animate-bounce">{mood.emoji}</span>
                  <span className="text-sm font-semibold">{mood.label}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              <label className={`block text-sm font-medium ${currentTheme.textColor}`}>
                What's on your mind? ✨ (Optional)
              </label>
              <Textarea
                placeholder="Share your thoughts, feelings, or what happened today... 💭"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className={`min-h-[100px] border-2 ${currentTheme.borderColor} focus:ring-2 focus:ring-opacity-50 transition-all duration-300`}
              />
              <Button 
                className={`bg-gradient-to-r ${currentTheme.color} hover:scale-105 transition-all duration-300 shadow-lg text-white font-semibold`}
                onClick={handleSaveCheckIn}
                disabled={isSubmitting || !selectedMood}
              >
                {isSubmitting ? "Saving... ⏳" : "Save Check-in 💾"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Affirmation */}
        {selectedMood && (
          <Card className={`mb-8 border-0 shadow-lg bg-gradient-to-r ${currentTheme.color} text-white hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-4 animate-pulse">✨ Your Personal Affirmation</h3>
              <p className="text-xl italic opacity-95 font-medium">
                {getCurrentAffirmation()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mindfulness Exercises */}
        <Card className={`mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${currentTheme.bgColor} ${currentTheme.borderColor} border-2`}>
          <CardHeader>
            <CardTitle className={`text-xl font-semibold ${currentTheme.textColor}`}>
              {selectedMood ? `🎯 Recommended for Your ${moods.find(m => m.value === selectedMood)?.label} Mood` : '🧘‍♀️ Mindfulness Exercises'}
            </CardTitle>
            {selectedMood && (
              <p className={`text-sm ${currentTheme.textColor} opacity-80`}>
                Specially curated for when you're feeling {moods.find(m => m.value === selectedMood)?.label.toLowerCase()} 💫
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentExercises.map((exercise, index) => (
                <div key={exercise.title} className={`p-6 bg-gradient-to-r ${exercise.color || currentTheme.color} bg-opacity-10 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${exercise.color || currentTheme.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <exercise.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{exercise.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">⏰ {exercise.duration}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className={`bg-gradient-to-r ${exercise.color || currentTheme.color} text-white hover:scale-110 transition-all duration-300 shadow-md font-semibold`}
                      onClick={() => handleStartExercise(exercise)}
                    >
                      Start 🚀
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{exercise.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood History */}
        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${currentTheme.bgColor} ${currentTheme.borderColor} border-2`}>
          <CardHeader>
            <CardTitle className={`text-xl font-semibold ${currentTheme.textColor}`}>📊 Recent Mood Journey</CardTitle>
          </CardHeader>
          <CardContent>
            {formatMoodHistory().length > 0 ? (
              <div className="space-y-4">
                {formatMoodHistory().map((entry, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 ${entry.theme?.bgColor || 'bg-gray-50'} rounded-xl hover:scale-102 transition-all duration-300 shadow-sm hover:shadow-md`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl animate-bounce">{entry.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{entry.date}</p>
                        <p className={`text-sm ${entry.theme?.textColor || 'text-gray-600'} font-medium`}>{entry.note}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${entry.theme?.bgColor || 'bg-gray-100'} ${entry.theme?.textColor || 'text-gray-600'} capitalize`}>
                      {moods.find(m => m.value === entry.mood)?.label} ✨
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-600 text-lg font-medium">No mood entries yet!</p>
                <p className="text-gray-500">Start by recording how you feel today and watch your emotional journey unfold! 🚀</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalWellbeing;
