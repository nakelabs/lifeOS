import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, User, Bell, Shield, Palette, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useHealthData } from "@/hooks/useHealthData";
import { useEmotionalData } from "@/hooks/useEmotionalData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = ({ onBack }: { onBack: () => void }) => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { healthData } = useHealthData();
  const { moodEntries } = useEmotionalData();
  const { toast } = useToast();

  const [userName, setUserName] = useState(profile?.name || "Friend");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [assistantTone, setAssistantTone] = useState(profile?.assistant_tone || "friendly");
  const [language, setLanguage] = useState(profile?.language || "english");
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Collect all user data
      const userData = {
        profile: profile,
        healthData: healthData,
        moodEntries: moodEntries,
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
      // Delete user data from all tables
      const { error: deleteError } = await supabase.rpc('delete_user_data', {
        user_id: user.id
      });

      if (deleteError) {
        // If RPC doesn't exist, delete manually
        await supabase.from('mood_entries').delete().eq('user_id', user.id);
        await supabase.from('health_data').delete().eq('user_id', user.id);
        await supabase.from('journal_entries').delete().eq('user_id', user.id);
        await supabase.from('financial_records').delete().eq('user_id', user.id);
        await supabase.from('user_courses').delete().eq('user_id', user.id);
        await supabase.from('user_interests').delete().eq('user_id', user.id);
        await supabase.from('health_goals').delete().eq('user_id', user.id);
        await supabase.from('user_streaks').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
      }

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
      action: handleDeleteAccount,
      loading: isDeleting,
      icon: Trash2,
      requiresConfirmation: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Customize your LifeOS experience</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <Card key={group.title} className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-800">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <group.icon className="w-4 h-4 text-white" />
                  </div>
                  <span>{group.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">{item.label}</Label>
                    
                    {item.type === "input" && (
                      <Input
                        value={item.value as string}
                        onChange={(e) => item.onChange?.(e.target.value)}
                        placeholder={item.placeholder}
                        className="max-w-md"
                      />
                    )}
                    
                    {item.type === "select" && (
                      <Select value={item.value as string} onValueChange={item.onChange}>
                        <SelectTrigger className="max-w-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {item.type === "switch" && (
                      <div className="flex items-center justify-between max-w-md">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <Switch
                          checked={item.value as boolean}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Focus Areas */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-800">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <span>Focus Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select which areas you'd like LifeOS to help you with
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Health", "Finance", "Learning", "Emotional Wellbeing", "Productivity", "Relationships"].map((area) => (
                  <div key={area} className="flex items-center space-x-3">
                    <Switch defaultChecked />
                    <Label className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-800">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>Privacy & Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dangerActions.map((action, index) => (
                <div key={action.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  {action.requiresConfirmation ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={action.buttonVariant} size="sm" disabled={action.loading}>
                          <action.icon className="w-4 h-4 mr-2" />
                          {action.loading ? 'Processing...' : action.buttonText}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={action.action} className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button variant={action.buttonVariant} size="sm" onClick={action.action} disabled={action.loading}>
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.loading ? 'Processing...' : action.buttonText}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 px-8">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
