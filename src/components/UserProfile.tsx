
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Save, X, Heart, DollarSign, BookOpen, Brain, Zap, Users, LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

const UserProfile = ({ 
  profile, 
  onBack, 
  onProfileUpdated 
}: { 
  profile: any; 
  onBack: () => void; 
  onProfileUpdated: (profile: any) => void; 
}) => {
  const { updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const focusAreaIcons = {
    health: Heart,
    finance: DollarSign,
    learning: BookOpen,
    emotional: Brain,
    productivity: Zap,
    relationships: Users
  };

  const focusAreaLabels = {
    health: "Health & Wellness",
    finance: "Finance & Money", 
    learning: "Learning & Skills",
    emotional: "Emotional Wellbeing",
    productivity: "Productivity",
    relationships: "Relationships"
  };

  const handleSave = async () => {
    const { error } = await updateProfile(editedProfile);
    if (!error) {
      onProfileUpdated(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    {getInitials(profile?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editedProfile?.name || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={editedProfile?.age || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={editedProfile?.region || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, region: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile?.name || 'User'}</h2>
                    <p className="text-gray-600 mb-2">{profile?.age} years old</p>
                    <p className="text-gray-500">{profile?.region}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Focus Areas */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Focus Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {profile?.focus_areas?.map((area: string) => {
                      const Icon = focusAreaIcons[area as keyof typeof focusAreaIcons];
                      const label = focusAreaLabels[area as keyof typeof focusAreaLabels];
                      return (
                        <Badge key={area} variant="secondary" className="flex items-center space-x-2 p-3 justify-start">
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Language</Label>
                      <p className="text-gray-800 capitalize">{profile?.language}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Assistant Tone</Label>
                      <p className="text-gray-800 capitalize">{profile?.assistant_tone}</p>
                    </div>
                  </div>
                  
                  {profile?.goals && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Goals</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.goals || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, goals: e.target.value }))}
                          placeholder="Your main goals..."
                        />
                      ) : (
                        <p className="text-gray-800">{profile.goals}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Your Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">7</div>
                      <div className="text-sm text-gray-600">Days Active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">12</div>
                      <div className="text-sm text-gray-600">Goals Achieved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">5</div>
                      <div className="text-sm text-gray-600">Streaks Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
