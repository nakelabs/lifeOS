
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, BookOpen, Calendar, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const QuickJournal = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [journalEntry, setJournalEntry] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "😴", label: "Tired" },
    { emoji: "🤔", label: "Thoughtful" }
  ];

  const prompts = [
    "What made you smile today?",
    "What are you grateful for right now?",
    "What's one thing you learned today?",
    "How did you take care of yourself today?",
    "What's on your mind?",
    "What would you tell your past self?"
  ];

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleSave = async () => {
    if (!user || !journalEntry.trim()) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title: title || null,
        content: journalEntry,
        mood: mood || null
      });

    if (!error) {
      // Reset form
      setJournalEntry("");
      setTitle("");
      setMood("");
      // Refresh entries
      await fetchEntries();
    } else {
      console.error('Error saving journal entry:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quick Journal</h1>
            <p className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {today}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Journal Card */}
          <div className="lg:col-span-2">
            <Card className="mb-6 border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Today's Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Optional)
                  </label>
                  <Input
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {moods.map((moodOption) => (
                      <Button
                        key={moodOption.label}
                        variant={mood === moodOption.label ? "default" : "outline"}
                        className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                          mood === moodOption.label ? 'bg-blue-500 text-white' : ''
                        }`}
                        onClick={() => setMood(moodOption.label)}
                      >
                        <span className="text-2xl">{moodOption.emoji}</span>
                        <span className="text-xs">{moodOption.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Journal Entry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <Textarea
                    placeholder="Start writing your thoughts..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[200px] w-full resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {journalEntry.length} characters
                  </p>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSave}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={!journalEntry.trim() || loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Entry"}
                </Button>
              </CardContent>
            </Card>

            {/* Writing Prompts */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Need inspiration?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {prompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-4 hover:bg-blue-50"
                      onClick={() => setJournalEntry(prompt + "\n\n")}
                    >
                      <span className="text-gray-700">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {entries.length > 0 ? (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {entry.title || "Untitled"}
                          </span>
                          {entry.mood && (
                            <span className="text-sm">
                              {moods.find(m => m.label === entry.mood)?.emoji}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {entry.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No entries yet. Write your first one!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickJournal;
