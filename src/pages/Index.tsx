
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Auth from "@/components/Auth";
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
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [currentView, setCurrentView] = useState<string>("landing");

  // Show loading while checking auth
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LifeOS...</p>
        </div>
      </div>
    );
  }

  // Show auth if not logged in
  if (!user) {
    return <Auth onAuthSuccess={() => setCurrentView("landing")} />;
  }

  const handleGetStarted = () => {
    if (profile && profile.focus_areas.length > 0) {
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

  const handleProfileCreated = () => {
    setCurrentView("dashboard");
  };

  const handleProfileUpdated = () => {
    // Profile updates are handled by the useProfile hook
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <Landing onGetStarted={handleGetStarted} />;
      case "profile-setup":
        return <ProfileSetup onProfileCreated={handleProfileCreated} />;
      case "dashboard":
        return <Dashboard userName={profile?.name || "Friend"} onNavigate={handleNavigate} />;
      case "profile":
        return <UserProfile profile={profile} onBack={handleBack} onProfileUpdated={handleProfileUpdated} />;
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
        return <Dashboard userName={profile?.name || "Friend"} onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentView();
};

export default Index;
