import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './components/auth/LoginView';
import { HomeView } from './components/home/HomeView';
import { AccountsView } from './components/accounts/AccountsView';
import { AccountModal } from './components/accounts/AccountModal';
import { AccountDetailDrawer } from './components/accounts/AccountDetailDrawer';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactModal } from './components/contacts/ContactModal';
import { ContactDetailDrawer } from './components/contacts/ContactDetailDrawer';
import { OpportunityModal } from './components/opportunities/OpportunityModal';
import { OpportunityDetailModal } from './components/opportunities/OpportunityDetailModal';
import { CloseDealModal } from './components/opportunities/CloseDealModal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ToolsView } from './components/tools/ToolsView';
import { SettingsView } from './components/settings/SettingsView';
import { OcrScannerModal } from './components/ocr/OcrScannerModal';
import { EmailComposerModal } from './components/common/EmailComposerModal';

const CrmMainApp: React.FC = () => {
  const { currentUser, activeTab } = useCrm();

  if (!currentUser) {
    return <LoginView />;
  }

  const currentTab = activeTab || 'home';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0F0F11] font-sans text-[#E4E4E7] antialiased">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0F0F11]">
        <Header />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto bg-[#0F0F11] pb-12">
          {currentTab === 'home' && <HomeView />}
          {currentTab === 'accounts' && <AccountsView />}
          {currentTab === 'contacts' && <ContactsView />}
          {currentTab === 'analytics' && <AnalyticsView />}
          {currentTab === 'tools' && <ToolsView />}
          {currentTab === 'my-account' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <OpportunityModal />
      <OpportunityDetailModal />
      <CloseDealModal />
      <AccountModal />
      <AccountDetailDrawer />
      <ContactModal />
      <ContactDetailDrawer />
      <OcrScannerModal />
      <EmailComposerModal />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <CrmMainApp />
    </CrmProvider>
  );
}
