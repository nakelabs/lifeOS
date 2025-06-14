import { useState } from "react";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";
import HealthAssistant from "@/components/HealthAssistant";
import FinanceAssistant from "@/components/FinanceAssistant";
import ChatAssistant from "@/components/ChatAssistant";
import Settings from "@/components/Settings";
import UserProfile from "@/components/UserProfile";
import ProfileSetup from "@/components/ProfileSetup";
import QuickJournal from "@/components/QuickJournal";
import EmotionalWellbeing from "@/components/EmotionalWellbeing";

const Index = () => {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleGetStarted = () => {
    if (userProfile) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("profile-setup");
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentView(section);
  };

  const handleBack = () => {
    setCurrentView("dashboard");
  };

  const handleProfileCreated = (profile: any) => {
    setUserProfile(profile);
    setCurrentView("dashboard");
  };

  const handleProfileUpdated = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <Landing onGetStarted={handleGetStarted} />;
      case "profile-setup":
        return <ProfileSetup onProfileCreated={handleProfileCreated} />;
      case "dashboard":
        return <Dashboard userName={userProfile?.name || "Friend"} onNavigate={handleNavigate} />;
      case "profile":
        return <UserProfile profile={userProfile} onBack={handleBack} onProfileUpdated={handleProfileUpdated} />;
      case "settings":
        return <Settings onBack={handleBack} />;
      case "health":
        return <HealthAssistant onBack={handleBack} />;
      case "finance":
        return <FinanceAssistant onBack={handleBack} />;
      case "chat":
        return <ChatAssistant onBack={handleBack} />;
      case "journal":
        return <QuickJournal onBack={handleBack} />;
      case "emotional":
        return <EmotionalWellbeing onBack={handleBack} />;
      default:
        return <Dashboard userName={userProfile?.name || "Friend"} onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentView();
};

export default Index;
