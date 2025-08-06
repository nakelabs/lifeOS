
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, BookOpen, Smile, Frown, Meh, Sun, Cloud, Sparkles, Zap, Star, Target } from "lucide-react";
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
    { emoji: "😊", label: "Great", value: "great", color: "from-green-400 to-emerald-500", bgColor: "from-green-500/20 to-emerald-500/20", textColor: "text-green-400", borderColor: "border-green-500/30" },
    { emoji: "🙂", label: "Good", value: "good", color: "from-blue-400 to-cyan-500", bgColor: "from-blue-500/20 to-cyan-500/20", textColor: "text-blue-400", borderColor: "border-blue-500/30" },
    { emoji: "😐", label: "Okay", value: "okay", color: "from-yellow-400 to-orange-400", bgColor: "from-yellow-500/20 to-orange-500/20", textColor: "text-yellow-400", borderColor: "border-yellow-500/30" },
    { emoji: "😔", label: "Low", value: "low", color: "from-orange-400 to-red-400", bgColor: "from-orange-500/20 to-red-500/20", textColor: "text-orange-400", borderColor: "border-orange-500/30" },
    { emoji: "😢", label: "Sad", value: "sad", color: "from-purple-400 to-pink-400", bgColor: "from-purple-500/20 to-pink-500/20", textColor: "text-purple-400", borderColor: "border-purple-500/30" }
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
        return 'bg-gradient-to-br from-slate-900 via-green-900 to-slate-900';
      case 'good':
        return 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900';
      case 'okay':
        return 'bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900';
      case 'low':
        return 'bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900';
      case 'sad':
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
      default:
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/80 text-lg font-medium">Loading your emotional wellbeing data...</p>
          <div className="mt-6 flex justify-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show timer if active
  if (activeTimer) {
    return (
      <div className={`min-h-screen ${getMoodBackground()} flex items-center justify-center p-4 transition-all duration-500 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <MindfulnessTimer 
          exercise={activeTimer} 
          onClose={() => setActiveTimer(null)} 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${getMoodBackground()} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="mr-6 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <span>Emotional Wellbeing</span>
                <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
              </h1>
              <p className="text-white/70 text-lg ml-18">Your mental health companion 💙</p>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-black bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent animate-pulse`}>
              {getMoodStreak()}
            </div>
            <div className="text-white/70 font-bold">Day streak 🔥</div>
          </div>
        </div>

        {/* Modern Daily Mood Check-in */}
        <Card className={`mb-12 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden`}>
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-30">
            <div className={`w-full h-full bg-gradient-to-br ${currentTheme.bgColor} animate-pulse`}></div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className={`text-2xl font-black text-white flex items-center space-x-3`}>
              <Heart className="w-8 h-8 text-pink-400" />
              <span>How are you feeling today? 🌈</span>
              {getTodaysMood() && (
                <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-bold text-sm">Recorded!</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid grid-cols-5 gap-6 mb-8">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className={`h-32 flex flex-col items-center justify-center space-y-3 hover:scale-110 transition-all duration-500 rounded-2xl group relative overflow-hidden ${
                    selectedMood === mood.value 
                      ? `bg-gradient-to-r ${mood.color} text-white shadow-2xl border-0` 
                      : `bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm`
                  }`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  {/* Hover effect background */}
                  {selectedMood !== mood.value && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${mood.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  )}
                  
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-500 relative z-10">
                    {mood.emoji}
                  </span>
                  <span className="text-lg font-black relative z-10">{mood.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="space-y-6">
              <label className={`flex items-center space-x-2 text-lg font-bold text-white/90`}>
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>What's on your mind? ✨ (Optional)</span>
              </label>
              <Textarea
                placeholder="Share your thoughts, feelings, or what happened today... 💭"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className={`min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl focus:border-purple-400 focus:ring-purple-400 backdrop-blur-sm text-lg`}
              />
              <Button 
                className={`w-full py-4 text-lg font-black bg-gradient-to-r ${currentTheme.color} hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-white rounded-2xl border-0 relative overflow-hidden group`}
                onClick={handleSaveCheckIn}
                disabled={isSubmitting || !selectedMood}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving... ⏳</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Save Check-in 💾</span>
                      <Zap className="w-6 h-6" />
                    </>
                  )}
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Daily Affirmation */}
        {selectedMood && (
          <Card className={`mb-12 bg-gradient-to-r ${currentTheme.color} text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 relative overflow-hidden`}>
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
            
            <CardContent className="p-8 text-center relative z-10">
              <h3 className="text-3xl font-black mb-6 flex items-center justify-center space-x-3">
                <Sparkles className="w-8 h-8 animate-pulse" />
                <span>Your Personal Affirmation</span>
                <Star className="w-8 h-8 animate-pulse" />
              </h3>
              <p className="text-2xl italic font-bold leading-relaxed">
                {getCurrentAffirmation()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modern Mindfulness Exercises */}
        <Card className={`mb-12 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden`}>
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className={`w-full h-full bg-gradient-to-br ${currentTheme.bgColor} animate-pulse`}></div>
          </div>
          
          <CardHeader className="relative z-10">
            <CardTitle className={`text-2xl font-black text-white flex items-center space-x-4`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${currentTheme.color} flex items-center justify-center shadow-2xl`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <span>
                  {selectedMood ? `🎯 Recommended for Your ${moods.find(m => m.value === selectedMood)?.label} Mood` : '🧘‍♀️ Mindfulness Exercises'}
                </span>
                {selectedMood && (
                  <p className={`text-white/70 text-lg font-medium mt-1`}>
                    Specially curated for when you're feeling {moods.find(m => m.value === selectedMood)?.label.toLowerCase()} 💫
                  </p>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentExercises.map((exercise, index) => (
                <div key={exercise.title} className={`group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden`}>
                  {/* Hover background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${exercise.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Floating decorative element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${exercise.color || currentTheme.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <exercise.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-xl">{exercise.title}</h3>
                        <p className="text-white/70 font-bold flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>⏰ {exercise.duration}</span>
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className={`bg-gradient-to-r ${exercise.color || currentTheme.color} text-white hover:scale-110 transition-all duration-500 shadow-2xl font-black px-6 py-3 rounded-xl border-0 relative overflow-hidden group/btn`}
                      onClick={() => handleStartExercise(exercise)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 flex items-center space-x-2">
                        <span>Start</span>
                        <Zap className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                  <p className="text-white/80 leading-relaxed font-medium relative z-10">{exercise.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modern Mood History */}
        <Card className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden`}>
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className={`w-full h-full bg-gradient-to-br ${currentTheme.bgColor} animate-pulse`}></div>
          </div>
          
          <CardHeader className="relative z-10">
            <CardTitle className={`text-2xl font-black text-white flex items-center space-x-4`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span>📊 Recent Mood Journey</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {formatMoodHistory().length > 0 ? (
              <div className="space-y-6">
                {formatMoodHistory().map((entry, index) => (
                  <div key={index} className={`group flex items-center justify-between p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 relative overflow-hidden`}>
                    {/* Hover background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${entry.theme?.color}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="text-5xl group-hover:scale-125 transition-transform duration-500">
                        {entry.emoji}
                      </div>
                      <div>
                        <p className="font-black text-white text-xl">{entry.date}</p>
                        <p className={`text-white/80 font-bold`}>{entry.note}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${entry.theme?.color} text-white font-black capitalize relative z-10 shadow-lg`}>
                      <div className="flex items-center space-x-2">
                        <span>{moods.find(m => m.value === entry.mood)?.label}</span>
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🌱</div>
                <p className="text-white text-2xl font-bold mb-2">No mood entries yet!</p>
                <p className="text-white/70 text-lg">Start by recording how you feel today and watch your emotional journey unfold! 🚀</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalWellbeing;
