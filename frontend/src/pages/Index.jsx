import { useState } from "react";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation"; 
import { LandingPage } from "../components/LandingPage";
import { DashboardHome } from "../components/DashboardHome";
import { FileUpload } from "../components/FileUpload";
import { Dashboard } from "../components/Dashboard";
import { UploadHistory } from "../components/UploadHistory";
import { AITools } from "../components/AITools";
import { AuthModal } from "../components/AuthModal";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentData, setCurrentData] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mock stats for dashboard
  const [stats] = useState({
    totalFiles: 12,
    chartsCreated: 28, 
    aiInsights: 5,
    processingTime: "2.3s"
  });

  const handleLogin = (credentials) => {
    // In production, this would call your authentication API
    setUser({
      id: '1',
      name: 'John Doe',
      email: credentials.email
    });
    toast.success('Welcome back! 🎉');
  };

  const handleRegister = (credentials) => {
    // In production, this would call your registration API
    setUser({
      id: '1',
      name: credentials.name,
      email: credentials.email
    });
    toast.success('Account created successfully! 🚀');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentData(null);
    setActiveSection('dashboard');
    setShowAuthModal(false);
    toast('See you soon! 👋');
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleFileProcessed = (data) => {
    setCurrentData(data);
    
    // Add to history
    const historyItem = {
      id: Date.now().toString(),
      fileName: data.fileName,
      uploadDate: data.uploadDate,
      rows: data.data.length,
      columns: Object.keys(data.data[0] || {}).length,
      fileSize: (JSON.stringify(data.data).length / 1024).toFixed(1)
    };
    
    setUploadHistory(prev => [historyItem, ...prev]);
    setActiveSection('analytics');
    toast.success(`File ${data.fileName} processed successfully! ✨`);
  };

  const handleViewFile = (id) => {
    // In production, this would fetch the file data
    setActiveSection('analytics');
    toast('File loaded for viewing 📊');
  };

  const handleDeleteFile = (id) => {
    setUploadHistory(prev => prev.filter(item => item.id !== id));
    toast('File deleted successfully 🗑️');
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome onNavigate={handleNavigate} stats={stats} />;
      case 'upload':
        return <FileUpload onFileProcessed={handleFileProcessed} />;
      case 'analytics':
        return <Dashboard data={currentData} />;
      case 'history':
        return (
          <UploadHistory
            uploads={uploadHistory}
            onViewFile={handleViewFile}
            onDeleteFile={handleDeleteFile}
          />
        );
      case 'ai-tools':
        return <AITools data={currentData} />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings panel would be implemented here</p>
          </div>
        );
      default:
        return <DashboardHome onNavigate={handleNavigate} stats={stats} />;
    }
  };

  // Show landing page if user is not logged in
  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    );
  }

  // Show main dashboard if user is logged in
  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex">
        <Navigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-8 bg-gradient-to-br from-background to-primary/5">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;