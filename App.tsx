
import React, { useState, useCallback } from 'react';
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
  const [orderCount, setOrderCount] = useState(0);

  const getTitle = () => {
    switch (activeTab) {
      case AppTab.CHAT: return 'AI 智慧叫貨助理';
      case AppTab.BINDING: return 'LINE 會員綁定';
      case AppTab.PRICE: return '即時查價報價';
      case AppTab.REPORT: return '採購數據月報';
      default: return '農易訂';
    }
  };

  const handleBindingSuccess = useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser);
    setActiveTab(AppTab.CHAT);
  }, []);

  const handleOrderConfirm = useCallback((total: number) => {
    // Simulate pushing to ERP and updating last order for variance detection
    setUser(prev => ({ ...prev, lastOrderTotal: total }));
    setOrderCount(prev => prev + 1);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CHAT:
        return <ChatInterface user={user} onOrderConfirm={handleOrderConfirm} />;
      case AppTab.BINDING:
        return <BindingForm onSuccess={handleBindingSuccess} currentUser={user} />;
      case AppTab.REPORT:
        return <ReportDashboard orderCount={orderCount} />;
      case AppTab.PRICE:
        return <PriceQuery user={user} />;
      default:
        return <ChatInterface user={user} onOrderConfirm={handleOrderConfirm} />;
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
