
import { useState } from "react";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";
import HealthAssistant from "@/components/HealthAssistant";
import FinanceAssistant from "@/components/FinanceAssistant";
import ChatAssistant from "@/components/ChatAssistant";

const Index = () => {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userName] = useState("Friend"); // This could be dynamic later

  const handleGetStarted = () => {
    setCurrentView("dashboard");
  };

  const handleNavigate = (section: string) => {
    setCurrentView(section);
  };

  const handleBack = () => {
    setCurrentView("dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <Landing onGetStarted={handleGetStarted} />;
      case "dashboard":
        return <Dashboard userName={userName} onNavigate={handleNavigate} />;
      case "health":
        return <HealthAssistant onBack={handleBack} />;
      case "finance":
        return <FinanceAssistant onBack={handleBack} />;
      case "chat":
        return <ChatAssistant onBack={handleBack} />;
      default:
        return <Dashboard userName={userName} onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentView();
};

export default Index;
