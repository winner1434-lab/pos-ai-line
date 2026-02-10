
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { BindingForm } from './components/BindingForm';
import { ReportDashboard } from './components/ReportDashboard';
import { PriceQuery } from './components/PriceQuery';
import { AppTab, UserProfile, UserRole } from './types';
import { INITIAL_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const getTitle = () => {
    switch (activeTab) {
      case AppTab.CHAT: return 'AI 智慧叫貨';
      case AppTab.BINDING: return '會員綁定';
      case AppTab.PRICE: return '即時查價報價';
      case AppTab.REPORT: return '每月分析報表';
      default: return '農易訂';
    }
  };

  const handleBindingSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    // After binding, take user to chat or show success
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CHAT:
        return <ChatInterface user={user} />;
      case AppTab.BINDING:
        return <BindingForm onSuccess={handleBindingSuccess} currentUser={user} />;
      case AppTab.REPORT:
        return <ReportDashboard />;
      case AppTab.PRICE:
        return <PriceQuery user={user} />;
      default:
        return <ChatInterface user={user} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      title={getTitle()}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
