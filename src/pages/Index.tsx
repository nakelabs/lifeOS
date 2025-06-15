
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";
import ProfileSetup from "@/components/ProfileSetup";
import HealthAssistant from "@/components/HealthAssistant";
import GoalsSettings from "@/components/GoalsSettings";
import ChatAssistant from "@/components/ChatAssistant";
import QuickJournal from "@/components/QuickJournal";
import FinanceAssistant from "@/components/FinanceAssistant";
import LearningCompanion from "@/components/LearningCompanion";
import EmotionalWellbeing from "@/components/EmotionalWellbeing";
import UserProfile from "@/components/UserProfile";
import Settings from "@/components/Settings";
import Auth from "@/components/Auth";

type Section = 
  | "dashboard" 
  | "health" 
  | "goals"
  | "chat" 
  | "journal" 
  | "finance" 
  | "learning" 
  | "emotional" 
  | "profile" 
  | "settings";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");
  const [showAuth, setShowAuth] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Handle navigation between sections
  const handleNavigate = (section: string) => {
    setCurrentSection(section as Section);
  };

  // Reset to dashboard when navigating back
  const handleBackToDashboard = () => {
    setCurrentSection("dashboard");
  };

  // Handle profile creation
  const handleProfileCreated = () => {
    console.log('Profile created, refetching profile data...');
    refetch();
    setShowProfileSetup(false);
  };

  // Handle profile updates
  const handleProfileUpdated = (updatedProfile: any) => {
    refetch();
  };

  // Handle get started button click
  const handleGetStarted = () => {
    setShowAuth(true);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    console.log('Authentication successful, checking for profile...');
    setShowAuth(false);
    // Force profile setup for new users
    setShowProfileSetup(true);
  };

  // Effect to handle profile setup after authentication
  useEffect(() => {
    if (user && !profileLoading) {
      console.log('User authenticated, profile loading status:', profileLoading);
      console.log('Profile data:', profile);
      
      if (!profile) {
        console.log('No profile found, showing profile setup');
        setShowProfileSetup(true);
      } else {
        console.log('Profile exists, hiding profile setup');
        setShowProfileSetup(false);
      }
    }
  }, [user, profile, profileLoading]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user clicked get started
  if (showAuth && !user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show landing page if not authenticated
  if (!user) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  // Show profile setup if explicitly requested or no profile exists
  if (showProfileSetup || (!profileLoading && !profile)) {
    return <ProfileSetup onProfileCreated={handleProfileCreated} />;
  }

  // Show loading while profile is being fetched
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate section
  const renderSection = () => {
    switch (currentSection) {
      case "health":
        return <HealthAssistant onBack={handleBackToDashboard} />;
      case "goals":
        return <GoalsSettings onBack={handleBackToDashboard} />;
      case "chat":
        return <ChatAssistant onBack={handleBackToDashboard} />;
      case "journal":
        return <QuickJournal onBack={handleBackToDashboard} />;
      case "finance":
        return <FinanceAssistant onBack={handleBackToDashboard} />;
      case "learning":
        return <LearningCompanion onBack={handleBackToDashboard} />;
      case "emotional":
        return <EmotionalWellbeing onBack={handleBackToDashboard} />;
      case "profile":
        return (
          <UserProfile 
            profile={profile} 
            onBack={handleBackToDashboard} 
            onProfileUpdated={handleProfileUpdated}
          />
        );
      case "settings":
        return <Settings onBack={handleBackToDashboard} />;
      default:
        return (
          <Dashboard 
            userName={profile?.name || 'User'} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return renderSection();
};

export default Index;
