
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Bell, Shield, Palette, Download, Trash2, Sparkles, Zap, Target, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useHealthData } from "@/hooks/useHealthData";
import { useEmotionalData } from "@/hooks/useEmotionalData";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useJournalData } from "@/hooks/useJournalData";
import { useLearningData } from "@/hooks/useLearningData";
import { useCourseCompletions } from "@/hooks/useCourseCompletions";
import { useUserStreaks } from "@/hooks/useUserStreaks";
import { useHealthGoals } from "@/hooks/useHealthGoals";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = ({ onBack }: { onBack: () => void }) => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { healthData } = useHealthData();
  const { moodEntries } = useEmotionalData();
  const { financialData } = useFinancialData();
  const { journalEntries } = useJournalData();
  const { courses, completions } = useLearningData();
  const { completions: courseCompletions } = useCourseCompletions();
  const { streak } = useUserStreaks();
  const { goals } = useHealthGoals();
  const { toast } = useToast();

  const [userName, setUserName] = useState(profile?.name || "Friend");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [assistantTone, setAssistantTone] = useState(profile?.assistant_tone || "friendly");
  const [language, setLanguage] = useState(profile?.language || "english");
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveSettings = async () => {
    const result = await updateProfile({
      name: userName,
      assistant_tone: assistantTone,
      language: language
    });

    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully"
      });
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    
    try {
      // Collect all user data from all tables
      const userData = {
        profile: profile,
        healthData: healthData,
        healthGoals: goals,
        moodEntries: moodEntries,
        journalEntries: journalEntries,
        financialData: financialData,
        userCourses: courses,
        courseCompletions: courseCompletions,
        userStreaks: streak,
        exportDate: new Date().toISOString(),
        userId: user.id
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifeos-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Delete user data from all tables in correct order to avoid foreign key constraints
      await supabase.from('course_completions').delete().eq('user_id', user.id);
      await supabase.from('user_streaks').delete().eq('user_id', user.id);
      await supabase.from('mood_entries').delete().eq('user_id', user.id);
      await supabase.from('health_data').delete().eq('user_id', user.id);
      await supabase.from('health_goals').delete().eq('user_id', user.id);
      await supabase.from('journal_entries').delete().eq('user_id', user.id);
      await supabase.from('financial_records').delete().eq('user_id', user.id);
      await supabase.from('user_courses').delete().eq('user_id', user.id);
      await supabase.from('user_interests').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Sign out and redirect
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted"
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your account",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

  const settingsGroups = [
    {
      title: "Profile",
      icon: User,
      items: [
        {
          label: "Display Name",
          type: "input",
          value: userName,
          onChange: setUserName,
          placeholder: "Enter your name"
        },
        {
          label: "Assistant Tone",
          type: "select",
          value: assistantTone,
          onChange: setAssistantTone,
          options: [
            { value: "friendly", label: "Friendly & Casual" },
            { value: "formal", label: "Professional & Formal" },
            { value: "motivational", label: "Motivational & Energetic" }
          ]
        },
        {
          label: "Language",
          type: "select", 
          value: language,
          onChange: setLanguage,
          options: [
            { value: "english", label: "English" },
            { value: "spanish", label: "Español" },
            { value: "french", label: "Français" },
            { value: "german", label: "Deutsch" }
          ]
        }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Push Notifications",
          type: "switch",
          value: notifications,
          onChange: setNotifications,
          description: "Receive notifications for reminders and updates"
        },
        {
          label: "Daily Check-ins",
          type: "switch", 
          value: dailyReminders,
          onChange: setDailyReminders,
          description: "Get reminded for mood and health check-ins"
        }
      ]
    }
  ];

  const dangerActions = [
    {
      title: "Export Data",
      description: "Download all your data in JSON format",
      buttonText: "Export",
      buttonVariant: "outline" as const,
      action: handleExportData,
      loading: isExporting,
      icon: Download
    },
    {
      title: "Delete Account",
      description: "Permanently delete your account and all data",
      buttonText: "Delete",
      buttonVariant: "destructive" as const,
      action: () => setShowDeleteDialog(true),
      loading: isDeleting,
      icon: Trash2,
      requiresConfirmation: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Modern Header */}
        <div className="flex items-center mb-12">
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
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span>Settings</span>
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </h1>
            <p className="text-white/70 text-lg ml-18">Customize your LifeOS experience</p>
          </div>
        </div>

        {/* Modern Settings Groups */}
        <div className="space-y-8">
          {settingsGroups.map((group, groupIndex) => (
            <Card key={group.title} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-4 text-2xl font-black text-white">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <group.icon className="w-6 h-6 text-white" />
                  </div>
                  <span>{group.title}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-4">
                    <Label className="text-lg font-bold text-white/90 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span>{item.label}</span>
                    </Label>
                    
                    {item.type === "input" && (
                      <Input
                        value={item.value as string}
                        onChange={(e) => item.onChange?.(e.target.value)}
                        placeholder={item.placeholder}
                        className="max-w-md h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-purple-400 focus:ring-purple-400 backdrop-blur-sm"
                      />
                    )}
                    
                    {item.type === "select" && (
                      <Select value={item.value as string} onValueChange={item.onChange}>
                        <SelectTrigger className="max-w-md h-12 bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20 backdrop-blur-xl">
                          {item.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {item.type === "switch" && (
                      <div className="flex items-center justify-between max-w-md p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                        <div className="space-y-1">
                          <p className="text-white/80 font-medium">{item.description}</p>
                        </div>
                        <Switch
                          checked={item.value as boolean}
                          onCheckedChange={item.onChange}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Modern Focus Areas */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-4 text-2xl font-black text-white">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <span>Focus Areas</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <p className="text-white/80 font-medium mb-6 text-lg">
                Select which areas you'd like LifeOS to help you with
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["Health", "Finance", "Learning", "Emotional Wellbeing", "Productivity", "Relationships"].map((area) => (
                  <div key={area} className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <Label className="text-white font-bold text-lg flex items-center space-x-3">
                      <Star className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      <span>{area}</span>
                    </Label>
                    <Switch defaultChecked className="data-[state=checked]:bg-purple-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Modern Privacy & Data */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 animate-pulse"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-4 text-2xl font-black text-white">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span>Privacy & Data</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10">
              {dangerActions.map((action, index) => (
                <div key={action.title} className="group flex items-center justify-between p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.buttonVariant === 'destructive' ? 'from-red-500/20 to-pink-500/20' : 'from-blue-500/20 to-purple-500/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-black text-white text-xl mb-2 flex items-center space-x-3">
                      <action.icon className="w-6 h-6 text-purple-400" />
                      <span>{action.title}</span>
                    </h3>
                    <p className="text-white/80 font-medium">{action.description}</p>
                  </div>
                  
                  <Button 
                    variant={action.buttonVariant} 
                    size="lg" 
                    onClick={action.action} 
                    disabled={action.loading}
                    className={`relative z-10 px-8 py-4 text-lg font-black rounded-xl transition-all duration-500 transform hover:scale-110 border-0 ${
                      action.buttonVariant === 'destructive' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-2xl' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <action.icon className="w-5 h-5" />
                      <span>{action.loading ? 'Processing...' : action.buttonText}</span>
                    </div>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Modern Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              className="px-12 py-4 text-lg font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0 relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>Save Changes</span>
                <Zap className="w-6 h-6" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center text-2xl font-black">
              <Trash2 className="w-6 h-6 mr-3" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-black text-red-400 text-lg">Warning: This action is irreversible</span>
                </div>
                <p className="text-red-300 font-medium mb-4">
                  This will permanently delete your account and all associated data including:
                </p>
                <ul className="text-red-300 font-medium ml-6 space-y-1 list-disc">
                  <li>Profile information</li>
                  <li>Health data and goals</li>
                  <li>Mood entries and journal</li>
                  <li>Financial records</li>
                  <li>Learning progress</li>
                  <li>All personal settings</li>
                </ul>
              </div>
              <div>
                <Label className="text-lg font-bold text-white/90 mb-3 block">
                  To confirm, type <strong className="text-red-400">DELETE</strong> in the box below:
                </Label>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:border-red-400 focus:ring-red-400 h-12 text-lg font-bold"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-4">
            <AlertDialogCancel 
              onClick={() => {
                setDeleteConfirmation("");
                setShowDeleteDialog(false);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-8 py-3 font-bold"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 rounded-xl px-8 py-3 font-black text-white shadow-2xl"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
