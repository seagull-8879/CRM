import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Account,
  Contact,
  Opportunity,
  Task,
  Note,
  Activity,
  FileDocument,
  OpportunityStage,
  OpportunityStatus,
  UserRole,
  EmailComposerData,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_ACCOUNTS,
  INITIAL_CONTACTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_TASKS,
  INITIAL_NOTES,
  INITIAL_ACTIVITIES,
  INITIAL_FILES,
} from '../mockData';

export type NavTab = 'home' | 'accounts' | 'contacts' | 'analytics' | 'tools' | 'my-account';

interface CrmContextType {
  currentUser: User | null;
  users: User[];
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentView: NavTab;
  setCurrentView: (view: NavTab) => void;
  login: (user: User) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;

  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'modifiedBy'>) => Account;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  checkDuplicateAccount: (name: string, excludeId?: string) => Account | undefined;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  checkDuplicateContact: (email: string, phone?: string, excludeId?: string) => Contact | undefined;

  // Opportunities (Managed on Home!)
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => Opportunity;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  updateOpportunityStage: (id: string, stage: OpportunityStage, reason?: string) => void;
  deleteOpportunity: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Activities
  activities: Activity[];
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'userId' | 'userName'>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'userId' | 'userName'>) => void;

  // Files
  files: FileDocument[];
  addFile: (file: Omit<FileDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => FileDocument;
  deleteFile: (id: string) => void;

  // UI Modal controllers
  isOpportunityModalOpen: boolean;
  setIsOpportunityModalOpen: (open: boolean) => void;
  editingOpportunity: Opportunity | null;
  setEditingOpportunity: (opp: Opportunity | null) => void;

  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  editingAccount: Account | null;
  setEditingAccount: (acc: Account | null) => void;

  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  editingContact: Contact | null;
  setEditingContact: (cnt: Contact | null) => void;

  isOcrScannerOpen: boolean;
  setIsOcrScannerOpen: (open: boolean) => void;
  ocrTargetContactId: string | null;
  setOcrTargetContactId: (id: string | null) => void;
  openOcrScanner: (targetContactId?: string) => void;

  isEmailComposerOpen: boolean;
  setIsEmailComposerOpen: (open: boolean) => void;
  emailComposerData: EmailComposerData | null;
  setEmailComposerData: (data: EmailComposerData | null) => void;

  selectedAccountIdFor360: string | null;
  setSelectedAccountIdFor360: (id: string | null) => void;

  selectedContactIdFor360: string | null;
  setSelectedContactIdFor360: (id: string | null) => void;

  selectedOpportunityForDetail: Opportunity | null;
  setSelectedOpportunityForDetail: (opp: Opportunity | null) => void;

  closeDealModalState: {
    isOpen: boolean;
    opportunity: Opportunity | null;
    targetStage: 'Closed Won' | 'Closed Lost';
  };
  setCloseDealModalState: (state: {
    isOpen: boolean;
    opportunity: Opportunity | null;
    targetStage: 'Closed Won' | 'Closed Lost';
  }) => void;

  // Global search
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Theme Management (TheMaverics Dark / Light mode)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Reset demo data
  resetAllData: () => void;
  resetToFactoryDefaults: () => void;
  processOcrCard: (cardData: any, target: any, imageUri?: string, contactIdToUpdate?: string) => Contact;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'crm_user_v1',
  ACCOUNTS: 'crm_accounts_v1',
  CONTACTS: 'crm_contacts_v1',
  OPPORTUNITIES: 'crm_opportunities_v1',
  TASKS: 'crm_tasks_v1',
  NOTES: 'crm_notes_v1',
  ACTIVITIES: 'crm_activities_v1',
  FILES: 'crm_files_v1',
};

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0];
  });

  const [users] = useState<User[]>(DEMO_USERS);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // CRM Data Collections
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [files, setFiles] = useState<FileDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILES);
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  // Modals & Drawers state
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [isOcrScannerOpen, setIsOcrScannerOpen] = useState(false);
  const [ocrTargetContactId, setOcrTargetContactId] = useState<string | null>(null);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);

  const openOcrScanner = (targetContactId?: string) => {
    setOcrTargetContactId(targetContactId || null);
    setIsOcrScannerOpen(true);
  };
  const [emailComposerData, setEmailComposerData] = useState<EmailComposerData | null>(null);
  const [selectedAccountIdFor360, setSelectedAccountIdFor360] = useState<string | null>(null);
  const [selectedContactIdFor360, setSelectedContactIdFor360] = useState<string | null>(null);
  const [selectedOpportunityForDetail, setSelectedOpportunityForDetail] = useState<Opportunity | null>(null);

  const [closeDealModalState, setCloseDealModalState] = useState<{
    isOpen: boolean;
    opportunity: Opportunity | null;
    targetStage: 'Closed Won' | 'Closed Lost';
  }>({
    isOpen: false,
    opportunity: null,
    targetStage: 'Closed Won',
  });

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // TheMaverics Theme Management ('dark' | 'light')
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('crm_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark'; // Default to sleek TheMaverics dark theme
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('crm_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Sync document element class on mount and changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // LocalStorage Persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
  }, [files]);

  // Auth actions
  const login = (user: User) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (!currentUser) return;
    const targetUser = users.find((u) => u.role === role) || {
      ...currentUser,
      role,
      title: role === 'admin' ? 'CRM Administrator' : role === 'management' ? 'VP of Sales' : 'Account Executive',
    };
    setCurrentUser(targetUser);
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // Activity Logger
  const logActivity = (activity: Omit<Activity, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'usr-1',
      userName: currentUser?.name || 'System User',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Accounts CRUD
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'modifiedBy'>): Account => {
    const newAcc: Account = {
      ...accountData,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Current User',
      modifiedBy: currentUser?.name || 'Current User',
      isDeleted: false,
    };
    setAccounts((prev) => [newAcc, ...prev]);

    logActivity({
      type: 'account_created',
      title: `Account Created: ${newAcc.name}`,
      description: `Created new ${newAcc.type} account with annual revenue of $${newAcc.annualRevenue.toLocaleString()}.`,
      relatedToType: 'Account',
      relatedToId: newAcc.id,
      relatedToName: newAcc.name,
    });

    return newAcc;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const updated = {
            ...acc,
            ...updates,
            updatedAt: new Date().toISOString(),
            modifiedBy: currentUser?.name || 'Current User',
          };
          return updated;
        }
        return acc;
      })
    );
  };

  const deleteAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isDeleted: true, updatedAt: new Date().toISOString() } : a))
    );
    if (acc) {
      logActivity({
        type: 'note',
        title: `Account Soft-Deleted: ${acc.name}`,
        description: `Account record was moved to archive / soft deleted.`,
        relatedToType: 'Account',
        relatedToId: acc.id,
        relatedToName: acc.name,
      });
    }
  };

  const checkDuplicateAccount = (name: string, excludeId?: string) => {
    const cleanName = name.trim().toLowerCase();
    return accounts.find(
      (a) => !a.isDeleted && a.id !== excludeId && a.name.trim().toLowerCase() === cleanName
    );
  };

  // Contacts CRUD
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
    const newCnt: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    setContacts((prev) => [newCnt, ...prev]);

    logActivity({
      type: newCnt.source === 'Visiting Card OCR' ? 'card_scanned' : 'call',
      title: `Contact Added: ${newCnt.firstName} ${newCnt.lastName}`,
      description: `Added ${newCnt.jobTitle} linked to ${newCnt.accountName} (Source: ${newCnt.source}).`,
      relatedToType: 'Contact',
      relatedToId: newCnt.id,
      relatedToName: `${newCnt.firstName} ${newCnt.lastName}`,
    });

    return newCnt;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((cnt) => (cnt.id === id ? { ...cnt, ...updates, updatedAt: new Date().toISOString() } : cnt))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) =>
      prev.map((cnt) => (cnt.id === id ? { ...cnt, isDeleted: true, updatedAt: new Date().toISOString() } : cnt))
    );
  };

  const checkDuplicateContact = (email: string, phone?: string, excludeId?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    return contacts.find((c) => {
      if (c.isDeleted || c.id === excludeId) return false;
      if (cleanEmail && c.email.trim().toLowerCase() === cleanEmail) return true;
      if (phone && c.phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) return true;
      return false;
    });
  };

  // Opportunities CRUD (Managed on Home)
  const calculateProbability = (stage: OpportunityStage): number => {
    switch (stage) {
      case 'Qualification':
        return 20;
      case 'Needs Analysis':
        return 40;
      case 'Proposal':
        return 60;
      case 'Negotiation':
        return 80;
      case 'Closed Won':
        return 100;
      case 'Closed Lost':
        return 0;
      default:
        return 10;
    }
  };

  const addOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity => {
    const prob = oppData.probability !== undefined ? oppData.probability : calculateProbability(oppData.stage);
    const expectedRev = Math.round((oppData.amount * prob) / 100);

    const newOpp: Opportunity = {
      ...oppData,
      id: `opp-${Date.now()}`,
      probability: prob,
      expectedRevenue: expectedRev,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    setOpportunities((prev) => [newOpp, ...prev]);

    logActivity({
      type: 'opportunity_created',
      title: `Opportunity Created: ${newOpp.name}`,
      description: `Created deal valued at $${newOpp.amount.toLocaleString()} linked to ${newOpp.accountName} at stage ${newOpp.stage}.`,
      relatedToType: 'Opportunity',
      relatedToId: newOpp.id,
      relatedToName: newOpp.name,
    });

    return newOpp;
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          const newStage = updates.stage || opp.stage;
          const newProb =
            updates.probability !== undefined
              ? updates.probability
              : updates.stage
              ? calculateProbability(updates.stage)
              : opp.probability;
          const newAmount = updates.amount !== undefined ? updates.amount : opp.amount;
          const expectedRev = Math.round((newAmount * newProb) / 100);

          let newStatus: OpportunityStatus = opp.status;
          if (newStage === 'Closed Won') newStatus = 'Won';
          else if (newStage === 'Closed Lost') newStatus = 'Lost';
          else newStatus = 'Open';

          const updated: Opportunity = {
            ...opp,
            ...updates,
            stage: newStage,
            probability: newProb,
            expectedRevenue: expectedRev,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return opp;
      })
    );
  };

  const updateOpportunityStage = (id: string, stage: OpportunityStage, reason?: string) => {
    const opp = opportunities.find((o) => o.id === id);
    if (!opp) return;

    const prob = calculateProbability(stage);
    let status: OpportunityStatus = 'Open';
    let actualCloseDate = opp.actualCloseDate;

    if (stage === 'Closed Won') {
      status = 'Won';
      actualCloseDate = new Date().toISOString().split('T')[0];
    } else if (stage === 'Closed Lost') {
      status = 'Lost';
      actualCloseDate = new Date().toISOString().split('T')[0];
    }

    updateOpportunity(id, {
      stage,
      status,
      probability: prob,
      wonLostReason: reason || opp.wonLostReason,
      actualCloseDate,
    });

    logActivity({
      type: 'stage_change',
      title: `Stage Changed: ${opp.name} ➔ ${stage}`,
      description: `Moved stage from ${opp.stage} to ${stage}. ${reason ? `Reason: ${reason}` : ''}`,
      relatedToType: 'Opportunity',
      relatedToId: opp.id,
      relatedToName: opp.name,
    });
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, isDeleted: true, updatedAt: new Date().toISOString() } : opp))
    );
  };

  // Tasks CRUD
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    logActivity({
      type: 'task_completed',
      title: `New Task Assigned: ${newTask.title}`,
      description: `Assigned to ${newTask.assignedToName} due on ${newTask.dueDate}.`,
      relatedToType: newTask.relatedToType,
      relatedToId: newTask.relatedToId,
      relatedToName: newTask.relatedToName,
    });

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isCompleting = t.status !== 'Completed';
          return {
            ...t,
            status: isCompleting ? 'Completed' : 'In Progress',
            completedAt: isCompleting ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Notes CRUD
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...noteData,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Files CRUD
  const addFile = (fileData: Omit<FileDocument, 'id' | 'uploadedAt' | 'uploadedBy'>): FileDocument => {
    const newFile: FileDocument = {
      ...fileData,
      id: `fil-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Current User',
    };
    setFiles((prev) => [newFile, ...prev]);
    return newFile;
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Reset
  const resetAllData = () => {
    localStorage.clear();
    setAccounts(INITIAL_ACCOUNTS);
    setContacts(INITIAL_CONTACTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setActivities(INITIAL_ACTIVITIES);
    setFiles(INITIAL_FILES);
    setCurrentUser(DEMO_USERS[0]);
    setActiveTab('home');
  };

  const processOcrCard = (
    cardData: any,
    target: any,
    imageUri?: string,
    contactIdToUpdate?: string
  ): Contact => {
    let accountId = target.selectedExistingAccountId;
    let accountName = cardData.companyName || 'New Account';

    if (!accountId && (target.createAccountIfNew || cardData.companyName)) {
      const newAcc = addAccount({
        name: cardData.companyName || `${cardData.firstName}'s Enterprise`,
        ownerId: currentUser?.id || 'usr-1',
        ownerName: currentUser?.name || 'Janaki Pawar',
        type: 'Prospect',
        industry: 'Technology',
        ownership: 'Private',
        rating: 'Warm',
        annualRevenue: 2500000,
        employees: 50,
        businessSegment: 'Mid-Market',
        customerStatus: 'Pending',
        website: cardData.website,
        phone: cardData.phone || cardData.mobile,
        billingStreet: cardData.street,
        billingCity: cardData.city,
        billingState: cardData.state,
        billingPostalCode: cardData.postalCode,
        billingCountry: cardData.country || 'United States',
        leadSource: 'Visiting Card OCR',
        description: `Imported via AI Card OCR for contact ${cardData.firstName} ${cardData.lastName}`,
      });
      accountId = newAcc.id;
      accountName = newAcc.name;
    }

    let resultingContact: Contact;

    if (contactIdToUpdate) {
      // Updating an existing contact record with new visiting card details
      updateContact(contactIdToUpdate, {
        salutation: cardData.salutation || 'Mr.',
        firstName: cardData.firstName || 'Unknown',
        lastName: cardData.lastName || 'Contact',
        jobTitle: cardData.jobTitle || 'Executive',
        department: cardData.department || '',
        email: cardData.email || '',
        phone: cardData.phone || '',
        mobile: cardData.mobile || '',
        street: cardData.street || '',
        city: cardData.city || '',
        state: cardData.state || '',
        country: cardData.country || 'United States',
        postalCode: cardData.postalCode || '',
        accountId: accountId || '',
        accountName: accountName,
        source: 'Visiting Card OCR',
        cardImageUrl: imageUri || undefined,
        notes: cardData.notes || 'Updated via Visiting Card OCR Scanner',
      });

      const existing = contacts.find((c) => c.id === contactIdToUpdate);
      resultingContact = existing
        ? {
            ...existing,
            ...cardData,
            accountId: accountId || existing.accountId,
            accountName: accountName || existing.accountName,
            cardImageUrl: imageUri || existing.cardImageUrl,
          }
        : ({ id: contactIdToUpdate, ...cardData, accountId, accountName } as Contact);

      logActivity({
        type: 'OCR Card Scan',
        title: `Contact Updated via Card OCR: ${cardData.firstName} ${cardData.lastName}`,
        description: `Updated business card coordinates for ${cardData.jobTitle || 'Executive'} at ${accountName}.`,
        relatedToType: 'Contact',
        relatedToId: contactIdToUpdate,
        relatedToName: `${cardData.firstName} ${cardData.lastName}`,
      });
    } else {
      // Creating a new contact record
      resultingContact = addContact({
        salutation: cardData.salutation || 'Mr.',
        firstName: cardData.firstName || 'Unknown',
        lastName: cardData.lastName || 'Contact',
        accountId: accountId || '',
        accountName: accountName,
        jobTitle: cardData.jobTitle || 'Executive',
        department: cardData.department || '',
        email:
          cardData.email ||
          `${(cardData.firstName || 'user').toLowerCase()}@${
            cardData.companyName ? cardData.companyName.toLowerCase().replace(/\s+/g, '') + '.com' : 'example.com'
          }`,
        phone: cardData.phone || '',
        mobile: cardData.mobile || '',
        preferredContactMethod: 'Email',
        source: 'Visiting Card OCR',
        street: cardData.street,
        city: cardData.city,
        state: cardData.state,
        country: cardData.country || 'United States',
        postalCode: cardData.postalCode || '',
        cardImageUrl: imageUri || undefined,
        ownerId: currentUser?.id || 'usr-1',
        ownerName: currentUser?.name || 'Janaki Pawar',
        notes: cardData.notes || 'Created via Multimodal Business Card OCR Scanner',
      });

      logActivity({
        type: 'OCR Card Scan',
        title: `Visiting Card Scanned: ${cardData.firstName} ${cardData.lastName}`,
        description: `Digitized business card for ${cardData.jobTitle || 'Executive'} at ${accountName}`,
        relatedToType: 'Contact',
        relatedToId: resultingContact.id,
        relatedToName: `${resultingContact.firstName} ${resultingContact.lastName}`,
      });
    }

    if (target.createOpportunity && resultingContact) {
      const oppCloseDate = new Date();
      oppCloseDate.setDate(oppCloseDate.getDate() + 45);

      addOpportunity({
        name: target.opportunityName || `${accountName} - Initial Engagement`,
        accountId: accountId || '',
        accountName: accountName,
        primaryContactId: resultingContact.id,
        primaryContactName: `${resultingContact.firstName} ${resultingContact.lastName}`,
        amount: target.opportunityAmount || 50000,
        stage: target.opportunityStage || 'Qualification',
        probability: 20,
        expectedRevenue: (target.opportunityAmount || 50000) * 0.2,
        expectedCloseDate: oppCloseDate.toISOString().split('T')[0],
        leadSource: 'Visiting Card OCR',
        status: 'Open',
        ownerId: currentUser?.id || 'usr-1',
        ownerName: currentUser?.name || 'Janaki Pawar',
        nextStep: 'Send introduction email and schedule discovery call',
        description: 'Auto-created opportunity from business card exchange.',
      });
    }

    // Also sync to backend asynchronously for persistence
    fetch('/api/ocr/scan-and-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardData,
        target,
        image: imageUri,
        contactIdToUpdate,
      }),
    }).catch((err) => console.warn('[CRM Backend Sync]:', err));

    return resultingContact;
  };

  return (
    <CrmContext.Provider
      value={{
        currentUser,
        users,
        activeTab,
        setActiveTab,
        currentView: activeTab,
        setCurrentView: setActiveTab,
        login,
        logout,
        switchUserRole,
        updateCurrentUserProfile,

        accounts: accounts.filter((a) => !a.isDeleted),
        addAccount,
        updateAccount,
        deleteAccount,
        checkDuplicateAccount,

        contacts: contacts.filter((c) => !c.isDeleted),
        addContact,
        updateContact,
        deleteContact,
        checkDuplicateContact,

        opportunities: opportunities.filter((o) => !o.isDeleted),
        addOpportunity,
        updateOpportunity,
        updateOpportunityStage,
        deleteOpportunity,

        tasks: tasks.filter((t) => !t.isDeleted),
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,

        notes,
        addNote,
        updateNote,
        deleteNote,

        activities,
        logActivity,
        addActivity: logActivity,

        files,
        addFile,
        deleteFile,

        isOpportunityModalOpen,
        setIsOpportunityModalOpen,
        editingOpportunity,
        setEditingOpportunity,

        isAccountModalOpen,
        setIsAccountModalOpen,
        editingAccount,
        setEditingAccount,

        isContactModalOpen,
        setIsContactModalOpen,
        editingContact,
        setEditingContact,

        isOcrScannerOpen,
        setIsOcrScannerOpen,
        ocrTargetContactId,
        setOcrTargetContactId,
        openOcrScanner,

        isEmailComposerOpen,
        setIsEmailComposerOpen,
        emailComposerData,
        setEmailComposerData,

        selectedAccountIdFor360,
        setSelectedAccountIdFor360,

        selectedContactIdFor360,
        setSelectedContactIdFor360,

        selectedOpportunityForDetail,
        setSelectedOpportunityForDetail,

        closeDealModalState,
        setCloseDealModalState,

        globalSearchQuery,
        setGlobalSearchQuery,

        theme,
        setTheme,
        toggleTheme,

        resetAllData,
        resetToFactoryDefaults: resetAllData,
        processOcrCard,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
