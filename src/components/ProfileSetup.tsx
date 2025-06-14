
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, DollarSign, BookOpen, Brain, Zap, Users } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

const ProfileSetup = ({ onProfileCreated }: { onProfileCreated: () => void }) => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile?.name || "",
    age: profile?.age || "",
    region: profile?.region || "",
    language: profile?.language || "english",
    assistant_tone: profile?.assistant_tone || "friendly",
    focus_areas: profile?.focus_areas || [] as string[],
    goals: profile?.goals || ""
  });

  const focusOptions = [
    { id: "health", label: "Health & Wellness", icon: Heart, description: "Track fitness, nutrition, and wellbeing" },
    { id: "finance", label: "Finance & Money", icon: DollarSign, description: "Budget, save, and manage expenses" },
    { id: "learning", label: "Learning & Skills", icon: BookOpen, description: "Courses, books, and skill development" },
    { id: "emotional", label: "Emotional Wellbeing", icon: Brain, description: "Mood tracking and mental health" },
    { id: "productivity", label: "Productivity", icon: Zap, description: "Task management and habits" },
    { id: "relationships", label: "Relationships", icon: Users, description: "Social connections and communication" }
  ];

  const handleFocusAreaChange = (areaId: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        focus_areas: [...prev.focus_areas, areaId]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        focus_areas: prev.focus_areas.filter(area => area !== areaId)
      }));
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save profile and complete setup
      setLoading(true);
      console.log('Saving profile data:', profileData);
      console.log('Current user:', user);
      
      try {
        const result = await updateProfile(profileData);
        console.log('Update result:', result);
        
        if (result?.error) {
          console.error('Error updating profile:', result.error);
          alert('Error saving profile: ' + result.error);
        } else {
          console.log('Profile saved successfully');
          onProfileCreated();
        }
      } catch (error) {
        console.error('Error in handleNext:', error);
        alert('Error saving profile');
      } finally {
        setLoading(false);
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return profileData.name && profileData.age && profileData.region;
      case 2:
        return profileData.focus_areas.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome to LifeOS! 
          </CardTitle>
          <p className="text-gray-600">Let's set up your personal assistant</p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-2 mx-1 rounded-full ${
                  i <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">Tell us about yourself</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Your age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Where are you located?</Label>
                <Input
                  id="region"
                  placeholder="e.g., Lagos, Nigeria"
                  value={profileData.region}
                  onChange={(e) => setProfileData(prev => ({ ...prev, region: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={profileData.language} onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="hausa">Hausa</SelectItem>
                    <SelectItem value="yoruba">Yoruba</SelectItem>
                    <SelectItem value="igbo">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">What areas would you like help with?</h3>
              <p className="text-sm text-gray-600 text-center mb-6">Select all that apply</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {focusOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={option.id}
                      checked={profileData.focus_areas.includes(option.id)}
                      onCheckedChange={(checked) => handleFocusAreaChange(option.id, !!checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <option.icon className="w-4 h-4 text-blue-500" />
                        <Label htmlFor={option.id} className="font-medium">{option.label}</Label>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">Customize your assistant</h3>
              
              <div className="space-y-2">
                <Label>Assistant Tone</Label>
                <Select value={profileData.assistant_tone} onValueChange={(value) => setProfileData(prev => ({ ...prev, assistant_tone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="formal">Professional & Formal</SelectItem>
                    <SelectItem value="motivational">Motivational & Energetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">What are your main goals? (Optional)</Label>
                <Input
                  id="goals"
                  placeholder="e.g., Save money, exercise more, learn new skills..."
                  value={profileData.goals}
                  onChange={(e) => setProfileData(prev => ({ ...prev, goals: e.target.value }))}
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎉 You're all set!</h4>
                <p className="text-sm text-blue-700">
                  Your personal LifeOS assistant is ready to help you with {profileData.focus_areas.length} focus areas.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="ml-auto bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Saving..." : step === 3 ? "Get Started" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
