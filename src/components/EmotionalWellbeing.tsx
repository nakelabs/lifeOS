
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, BookOpen, Smile, Frown, Meh, Sun, Cloud } from "lucide-react";
import { useState } from "react";

const EmotionalWellbeing = ({ onBack }: { onBack: () => void }) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState("");

  const moods = [
    { emoji: "😊", label: "Great", value: "great", color: "green" },
    { emoji: "🙂", label: "Good", value: "good", color: "blue" },
    { emoji: "😐", label: "Okay", value: "okay", color: "yellow" },
    { emoji: "😔", label: "Low", value: "low", color: "orange" },
    { emoji: "😢", label: "Sad", value: "sad", color: "red" }
  ];

  const affirmations = [
    "You are capable of amazing things",
    "Every challenge is an opportunity to grow",
    "You deserve happiness and peace",
    "Your feelings are valid and important",
    "Tomorrow is a fresh start with new possibilities"
  ];

  const mindfulnessExercises = [
    {
      title: "5-Minute Breathing",
      description: "Simple breathing exercise to calm your mind",
      duration: "5 min",
      icon: Cloud
    },
    {
      title: "Gratitude Reflection",
      description: "Think of three things you're grateful for today",
      duration: "3 min", 
      icon: Sun
    },
    {
      title: "Body Scan",
      description: "Progressive relaxation from head to toe",
      duration: "10 min",
      icon: Heart
    },
    {
      title: "Mindful Walking",
      description: "Focus on each step and your surroundings",
      duration: "15 min",
      icon: Sun
    }
  ];

  const recentMoods = [
    { date: "Today", mood: "good", note: "Had a productive day at work" },
    { date: "Yesterday", mood: "great", note: "Spent time with family" },
    { date: "2 days ago", mood: "okay", note: "Feeling a bit stressed" },
    { date: "3 days ago", mood: "good", note: "Completed a personal project" }
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
            <h1 className="text-3xl font-bold text-gray-800">Emotional Wellbeing</h1>
            <p className="text-gray-600">Your mental health companion</p>
          </div>
        </div>

        {/* Daily Mood Check-in */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                    selectedMood === mood.value ? 'bg-blue-500 text-white' : ''
                  }`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-sm">{mood.label}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                What's on your mind? (Optional)
              </label>
              <Textarea
                placeholder="Share your thoughts, feelings, or what happened today..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[100px]"
              />
              <Button className="bg-blue-500 hover:bg-blue-600">
                Save Check-in
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mindfulness Exercises */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Mindfulness Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mindfulnessExercises.map((exercise, index) => (
                <div key={exercise.title} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <exercise.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{exercise.title}</h3>
                        <p className="text-sm text-gray-600">{exercise.duration}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Affirmation */}
        <Card className="mb-8 border-0 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">✨ Today's Affirmation</h3>
            <p className="text-lg italic opacity-90">
              "{affirmations[Math.floor(Math.random() * affirmations.length)]}"
            </p>
          </CardContent>
        </Card>

        {/* Mood History */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMoods.map((entry, index) => {
                const moodData = moods.find(m => m.value === entry.mood);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{moodData?.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800">{entry.date}</p>
                        <p className="text-sm text-gray-600">{entry.note}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{moodData?.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalWellbeing;
