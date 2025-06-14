
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { useState } from "react";

const Settings = ({ onBack }: { onBack: () => void }) => {
  const [userName, setUserName] = useState("Friend");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [assistantTone, setAssistantTone] = useState("friendly");
  const [language, setLanguage] = useState("english");

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
      buttonVariant: "outline" as const
    },
    {
      title: "Delete Account",
      description: "Permanently delete your account and all data",
      buttonText: "Delete",
      buttonVariant: "destructive" as const
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
                  <Button variant={action.buttonVariant} size="sm">
                    {action.buttonText}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-blue-500 hover:bg-blue-600 px-8">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
