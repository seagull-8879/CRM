import { Account, Contact, Opportunity, Task, Activity, User, OpportunityStage } from '../types';

export class CrmService {
  private accounts: Account[] = [];
  private contacts: Contact[] = [];
  private opportunities: Opportunity[] = [];
  private tasks: Task[] = [];
  private activities: Activity[] = [];
  private users: User[] = [];

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    this.users = [
      {
        id: 'usr-1',
        name: 'Janaki Pawar',
        email: 'janaki.pawar@apexcloud.io',
        role: 'Admin',
        title: 'Vice President of Global Sales',
        phone: '+1 (415) 890-2100',
        department: 'Sales & Business Development',
      },
      {
        id: 'usr-2',
        name: 'Marcus Vance',
        email: 'm.vance@apexcloud.io',
        role: 'Sales Manager',
        title: 'Regional Sales Director - Americas',
        phone: '+1 (415) 890-2101',
        department: 'Enterprise Sales',
      },
      {
        id: 'usr-3',
        name: 'Sophia Sterling',
        email: 's.sterling@apexcloud.io',
        role: 'Sales Representative',
        title: 'Senior Account Executive',
        phone: '+1 (415) 890-2102',
        department: 'Strategic Accounts',
      },
      {
        id: 'usr-4',
        name: 'David Kim',
        email: 'd.kim@apexcloud.io',
        role: 'Read Only',
        title: 'Financial Analyst',
        phone: '+1 (415) 890-2103',
        department: 'Finance & Planning',
      },
    ];

    this.accounts = [
      {
        id: 'acc-1',
        name: 'Starlight Dynamics Inc',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        type: 'Customer - Direct',
        industry: 'Technology',
        ownership: 'Public',
        rating: 'Hot',
        annualRevenue: 125000000,
        employees: 850,
        businessSegment: 'Enterprise',
        customerStatus: 'Active',
        website: 'https://starlightdynamics.example.com',
        phone: '+1 (415) 555-0101',
        billingStreet: '100 Market Street, Suite 2400',
        billingCity: 'San Francisco',
        billingState: 'CA',
        billingPostalCode: '94105',
        billingCountry: 'United States',
        leadSource: 'Partner Referral',
        description: 'Global cloud infrastructure modernization and AI analytics customer.',
        createdAt: '2026-01-15T09:30:00Z',
        updatedAt: '2026-08-10T14:20:00Z',
      },
      {
        id: 'acc-2',
        name: 'Vanguard Biopharma Labs',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        type: 'Customer - Direct',
        industry: 'Healthcare & Life Sciences',
        ownership: 'Public',
        rating: 'Hot',
        annualRevenue: 450000000,
        employees: 2400,
        businessSegment: 'Enterprise',
        customerStatus: 'Active',
        website: 'https://vanguardbio.example.com',
        phone: '+1 (617) 555-0188',
        billingStreet: '300 Binney St, Discovery Hub',
        billingCity: 'Cambridge',
        billingState: 'MA',
        billingPostalCode: '02142',
        billingCountry: 'United States',
        leadSource: 'Healthcare Tech Summit 2026',
        description: 'Global oncology clinical data processing pipeline deployment.',
        createdAt: '2026-02-01T11:00:00Z',
        updatedAt: '2026-08-18T16:45:00Z',
      },
      {
        id: 'acc-3',
        name: 'Apex Horizon Financial Group',
        ownerId: 'usr-2',
        ownerName: 'Marcus Vance',
        type: 'Customer - Channel',
        industry: 'Finance & Banking',
        ownership: 'Public',
        rating: 'Hot',
        annualRevenue: 890000000,
        employees: 5200,
        businessSegment: 'Enterprise',
        customerStatus: 'Active',
        website: 'https://apexhorizon.example.com',
        phone: '+1 (212) 555-0199',
        billingStreet: '200 Park Avenue, 35th Floor',
        billingCity: 'New York',
        billingState: 'NY',
        billingPostalCode: '10166',
        billingCountry: 'United States',
        leadSource: 'Inbound Enterprise',
        description: 'Tier 1 investment banking compliance, trading workflow, and customer CRM consolidation.',
        createdAt: '2026-01-20T10:15:00Z',
        updatedAt: '2026-08-19T09:10:00Z',
      },
      {
        id: 'acc-4',
        name: 'Nexus Robotics Industrial',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        type: 'Prospect',
        industry: 'Manufacturing',
        ownership: 'Private',
        rating: 'Warm',
        annualRevenue: 78000000,
        employees: 430,
        businessSegment: 'Mid-Market',
        customerStatus: 'Pending',
        website: 'https://nexusrobotics.example.com',
        phone: '+1 (312) 555-0144',
        billingStreet: '800 W Fulton Market',
        billingCity: 'Chicago',
        billingState: 'IL',
        billingPostalCode: '60607',
        billingCountry: 'United States',
        leadSource: 'Visiting Card OCR',
        description: 'Autonomous robotics vision control and telemetry cloud backplane integration.',
        createdAt: '2026-03-10T14:00:00Z',
        updatedAt: '2026-08-15T11:20:00Z',
      },
      {
        id: 'acc-5',
        name: 'Zenith Retail & Supply Chain',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        type: 'Prospect',
        industry: 'Retail & eCommerce',
        ownership: 'Public',
        rating: 'Warm',
        annualRevenue: 310000000,
        employees: 3100,
        businessSegment: 'Enterprise',
        customerStatus: 'Pending',
        website: 'https://zenithretail.example.com',
        phone: '+1 (206) 555-0177',
        billingStreet: '1201 Third Avenue, Suite 1800',
        billingCity: 'Seattle',
        billingState: 'WA',
        billingPostalCode: '98101',
        billingCountry: 'United States',
        leadSource: 'Executive Outreach',
        description: 'Omnichannel fulfillment and AI demand forecasting platform evaluation.',
        createdAt: '2026-04-05T08:45:00Z',
        updatedAt: '2026-08-16T13:30:00Z',
      },
    ];

    this.contacts = [
      {
        id: 'cnt-1',
        salutation: 'Dr.',
        firstName: 'Elena',
        lastName: 'Rostova',
        accountId: 'acc-2',
        accountName: 'Vanguard Biopharma Labs',
        jobTitle: 'VP of Clinical Informatics',
        department: 'Bioinformatics & Research',
        email: 'e.rostova@vanguardbio.example.com',
        phone: '+1 (617) 555-0143',
        mobile: '+1 (617) 843-9921',
        preferredContactMethod: 'Email',
        source: 'Healthcare Tech Summit 2026',
        street: '300 Binney St, Discovery Hub',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States',
        postalCode: '02142',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        notes: 'Lead decision maker for clinical informatics integration.',
        createdAt: '2026-02-02T10:00:00Z',
        updatedAt: '2026-08-18T16:00:00Z',
      },
      {
        id: 'cnt-2',
        salutation: 'Mr.',
        firstName: 'Alexander',
        lastName: 'Cross',
        accountId: 'acc-1',
        accountName: 'Starlight Dynamics Inc',
        jobTitle: 'Chief Technology Officer',
        department: 'Engineering & Infrastructure',
        email: 'a.cross@starlightdynamics.example.com',
        phone: '+1 (415) 555-0102',
        mobile: '+1 (415) 912-3344',
        preferredContactMethod: 'Email',
        source: 'Partner Referral',
        street: '100 Market Street, Suite 2400',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        postalCode: '94105',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        notes: 'Executive sponsor for multi-year expansion.',
        createdAt: '2026-01-16T10:30:00Z',
        updatedAt: '2026-08-12T14:10:00Z',
      },
      {
        id: 'cnt-3',
        salutation: 'Ms.',
        firstName: 'Claire',
        lastName: 'DeWitt',
        accountId: 'acc-3',
        accountName: 'Apex Horizon Financial Group',
        jobTitle: 'Managing Director, Head of Digital Architecture',
        department: 'Information Technology',
        email: 'claire.dewitt@apexhorizon.example.com',
        phone: '+1 (212) 555-0198',
        mobile: '+1 (917) 443-8821',
        preferredContactMethod: 'Mobile',
        source: 'Inbound Enterprise',
        street: '200 Park Avenue, 35th Floor',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        postalCode: '10166',
        ownerId: 'usr-2',
        ownerName: 'Marcus Vance',
        notes: 'Oversees architecture review committee.',
        createdAt: '2026-01-22T14:00:00Z',
        updatedAt: '2026-08-19T09:00:00Z',
      },
      {
        id: 'cnt-4',
        salutation: 'Mr.',
        firstName: 'Hiroshi',
        lastName: 'Tanaka',
        accountId: 'acc-4',
        accountName: 'Nexus Robotics Industrial',
        jobTitle: 'VP of Manufacturing Automation',
        department: 'Operations',
        email: 'h.tanaka@nexusrobotics.example.com',
        phone: '+1 (312) 555-0145',
        mobile: '+1 (312) 670-8811',
        preferredContactMethod: 'Email',
        source: 'Visiting Card OCR',
        street: '800 W Fulton Market',
        city: 'Chicago',
        state: 'IL',
        country: 'United States',
        postalCode: '60607',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        notes: 'Contact added via business card OCR scanner at expo.',
        createdAt: '2026-03-11T09:20:00Z',
        updatedAt: '2026-08-15T11:00:00Z',
      },
      {
        id: 'cnt-5',
        salutation: 'Mrs.',
        firstName: 'Rachel',
        lastName: 'Sterling',
        accountId: 'acc-5',
        accountName: 'Zenith Retail & Supply Chain',
        jobTitle: 'Senior VP of Supply Chain Logistics',
        department: 'Supply Chain Operations',
        email: 'r.sterling@zenithretail.example.com',
        phone: '+1 (206) 555-0178',
        mobile: '+1 (206) 388-2991',
        preferredContactMethod: 'Email',
        source: 'Executive Outreach',
        street: '1201 Third Avenue, Suite 1800',
        city: 'Seattle',
        state: 'WA',
        country: 'United States',
        postalCode: '98101',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        notes: 'Key buyer champion for demand forecasting rollout.',
        createdAt: '2026-04-06T11:15:00Z',
        updatedAt: '2026-08-16T13:00:00Z',
      },
    ];

    this.opportunities = [
      {
        id: 'opp-1',
        name: 'Starlight - Global Cloud & AI Modernization Expansion',
        accountId: 'acc-1',
        accountName: 'Starlight Dynamics Inc',
        primaryContactId: 'cnt-2',
        primaryContactName: 'Alexander Cross',
        amount: 280000,
        stage: 'Negotiation/Review',
        probability: 90,
        expectedRevenue: 252000,
        expectedCloseDate: '2026-09-15',
        leadSource: 'Partner Referral',
        status: 'Open',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        nextStep: 'Final contract redline review with legal counsel and executive signature.',
        description: 'Multi-region enterprise expansion covering 850 seats and predictive telemetry nodes.',
        createdAt: '2026-05-10T10:00:00Z',
        updatedAt: '2026-08-19T11:30:00Z',
      },
      {
        id: 'opp-2',
        name: 'Vanguard - Oncology Clinical Informatics Hub',
        accountId: 'acc-2',
        accountName: 'Vanguard Biopharma Labs',
        primaryContactId: 'cnt-1',
        primaryContactName: 'Dr. Elena Rostova',
        amount: 420000,
        stage: 'Proposal/Price Quote',
        probability: 75,
        expectedRevenue: 315000,
        expectedCloseDate: '2026-10-30',
        leadSource: 'Healthcare Tech Summit 2026',
        status: 'Open',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        nextStep: 'Present customized security compliance dossier and HIPAA audit verification.',
        description: 'High-throughput genomic sequencing data pipeline with enterprise SSO and 24/7 dedicated SLA.',
        createdAt: '2026-06-01T14:30:00Z',
        updatedAt: '2026-08-18T16:30:00Z',
      },
      {
        id: 'opp-3',
        name: 'Apex Horizon - Global Wealth Trading CRM Core',
        accountId: 'acc-3',
        accountName: 'Apex Horizon Financial Group',
        primaryContactId: 'cnt-3',
        primaryContactName: 'Claire DeWitt',
        amount: 650000,
        stage: 'Id. Decision Makers',
        probability: 60,
        expectedRevenue: 390000,
        expectedCloseDate: '2026-11-20',
        leadSource: 'Inbound Enterprise',
        status: 'Open',
        ownerId: 'usr-2',
        ownerName: 'Marcus Vance',
        nextStep: 'Technical architecture committee review meeting with Chief Security Officer.',
        description: 'Consolidated CRM, portfolio activity audit, and regulatory reporting suite.',
        createdAt: '2026-06-15T09:00:00Z',
        updatedAt: '2026-08-19T09:15:00Z',
      },
      {
        id: 'opp-4',
        name: 'Nexus Robotics - Plant Automation Intelligence Pilot',
        accountId: 'acc-4',
        accountName: 'Nexus Robotics Industrial',
        primaryContactId: 'cnt-4',
        primaryContactName: 'Hiroshi Tanaka',
        amount: 145000,
        stage: 'Value Proposition',
        probability: 50,
        expectedRevenue: 72500,
        expectedCloseDate: '2026-12-05',
        leadSource: 'Visiting Card OCR',
        status: 'Open',
        ownerId: 'usr-1',
        ownerName: 'Janaki Pawar',
        nextStep: 'Deliver POC telemetry validation report to VP of Manufacturing.',
        description: 'Factory floor vision telemetry platform across 3 assembly facilities.',
        createdAt: '2026-07-01T11:00:00Z',
        updatedAt: '2026-08-15T11:15:00Z',
      },
      {
        id: 'opp-5',
        name: 'Zenith - Omnichannel Predictive Demand Engine',
        accountId: 'acc-5',
        accountName: 'Zenith Retail & Supply Chain',
        primaryContactId: 'cnt-5',
        primaryContactName: 'Rachel Sterling',
        amount: 320000,
        stage: 'Needs Analysis',
        probability: 30,
        expectedRevenue: 96000,
        expectedCloseDate: '2027-01-15',
        leadSource: 'Executive Outreach',
        status: 'Open',
        ownerId: 'usr-3',
        ownerName: 'Sophia Sterling',
        nextStep: 'Conduct deep-dive discovery workshop with regional distribution directors.',
        description: 'Nationwide retail warehouse inventory optimization software license.',
        createdAt: '2026-07-20T15:00:00Z',
        updatedAt: '2026-08-16T13:15:00Z',
      },
    ];

    this.tasks = [
      {
        id: 'tsk-1',
        subject: 'Finalize Contract Appendix & Send for Signature',
        dueDate: '2026-08-25',
        priority: 'Urgent',
        status: 'In Progress',
        assignedToId: 'usr-1',
        assignedToName: 'Janaki Pawar',
        relatedToType: 'Opportunity',
        relatedToId: 'opp-1',
        relatedToName: 'Starlight - Global Cloud & AI Modernization Expansion',
        comments: 'Confirm clause 8.2 SLA terms with legal team prior to dispatch.',
        createdAt: '2026-08-18T09:00:00Z',
        updatedAt: '2026-08-19T10:00:00Z',
      },
      {
        id: 'tsk-2',
        subject: 'Deliver HIPAA Security & Compliance Packet',
        dueDate: '2026-08-28',
        priority: 'High',
        status: 'Not Started',
        assignedToId: 'usr-3',
        assignedToName: 'Sophia Sterling',
        relatedToType: 'Account',
        relatedToId: 'acc-2',
        relatedToName: 'Vanguard Biopharma Labs',
        comments: 'Attach SOC2 Type II report and third-party penetration test summary.',
        createdAt: '2026-08-17T14:30:00Z',
        updatedAt: '2026-08-17T14:30:00Z',
      },
      {
        id: 'tsk-3',
        subject: 'Schedule Architecture Committee Technical Briefing',
        dueDate: '2026-09-02',
        priority: 'Normal',
        status: 'Not Started',
        assignedToId: 'usr-2',
        assignedToName: 'Marcus Vance',
        relatedToType: 'Opportunity',
        relatedToId: 'opp-3',
        relatedToName: 'Apex Horizon - Global Wealth Trading CRM Core',
        comments: 'Coordinate with lead solutions architect for custom slide deck.',
        createdAt: '2026-08-19T08:00:00Z',
        updatedAt: '2026-08-19T08:00:00Z',
      },
      {
        id: 'tsk-4',
        subject: 'Send Follow-up Email to Hiroshi Tanaka after Card OCR',
        dueDate: '2026-08-22',
        priority: 'High',
        status: 'Completed',
        assignedToId: 'usr-1',
        assignedToName: 'Janaki Pawar',
        relatedToType: 'Contact',
        relatedToId: 'cnt-4',
        relatedToName: 'Hiroshi Tanaka',
        comments: 'Sent introduction note with customized robotics telemetry whitepaper.',
        createdAt: '2026-08-15T11:30:00Z',
        updatedAt: '2026-08-16T09:00:00Z',
      },
    ];

    this.activities = [
      {
        id: 'act-1',
        type: 'Meeting',
        title: 'Executive Alignment Call with Alexander Cross',
        description: 'Reviewed multi-year subscription economics, seat allocation tiers, and migration milestones. Agreement reached on standard terms.',
        relatedToType: 'Opportunity',
        relatedToId: 'opp-1',
        relatedToName: 'Starlight - Global Cloud & AI Modernization Expansion',
        timestamp: '2026-08-19T14:00:00Z',
        userId: 'usr-1',
        userName: 'Janaki Pawar',
      },
      {
        id: 'act-2',
        type: 'OCR Card Scan',
        title: 'Digitized Visiting Card for Hiroshi Tanaka',
        description: 'Multimodal AI Vision extracted contact details, job title, and enterprise address from physical card.',
        relatedToType: 'Contact',
        relatedToId: 'cnt-4',
        relatedToName: 'Hiroshi Tanaka',
        timestamp: '2026-08-15T11:05:00Z',
        userId: 'usr-1',
        userName: 'Janaki Pawar',
      },
      {
        id: 'act-3',
        type: 'Email',
        title: 'Smart AI Draft Sent: Security Dossier to Dr. Elena Rostova',
        description: 'Sent tailored enterprise compliance document and scheduling link for follow-up review.',
        relatedToType: 'Opportunity',
        relatedToId: 'opp-2',
        relatedToName: 'Vanguard - Oncology Clinical Informatics Hub',
        timestamp: '2026-08-18T16:40:00Z',
        userId: 'usr-3',
        userName: 'Sophia Sterling',
      },
    ];
  }

  // --- Accounts CRUD ---
  public getAccounts(): Account[] {
    return this.accounts;
  }

  public getAccountById(id: string): Account | undefined {
    return this.accounts.find((a) => a.id === id);
  }

  public createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Account {
    const newAccount: Account = {
      ...account,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.unshift(newAccount);
    return newAccount;
  }

  public updateAccount(id: string, updates: Partial<Account>): Account | null {
    const idx = this.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.accounts[idx] = {
      ...this.accounts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.accounts[idx];
  }

  public deleteAccount(id: string): boolean {
    const lenBefore = this.accounts.length;
    this.accounts = this.accounts.filter((a) => a.id !== id);
    return this.accounts.length < lenBefore;
  }

  // --- Contacts CRUD ---
  public getContacts(): Contact[] {
    return this.contacts;
  }

  public getContactById(id: string): Contact | undefined {
    return this.contacts.find((c) => c.id === id);
  }

  public createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contacts.unshift(newContact);
    return newContact;
  }

  public updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const idx = this.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.contacts[idx] = {
      ...this.contacts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.contacts[idx];
  }

  public deleteContact(id: string): boolean {
    const lenBefore = this.contacts.length;
    this.contacts = this.contacts.filter((c) => c.id !== id);
    return this.contacts.length < lenBefore;
  }

  // --- Opportunities CRUD ---
  public getOpportunities(): Opportunity[] {
    return this.opportunities;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.opportunities.find((o) => o.id === id);
  }

  public createOpportunity(opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.opportunities.unshift(newOpp);
    return newOpp;
  }

  public updateOpportunity(id: string, updates: Partial<Opportunity>): Opportunity | null {
    const idx = this.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.opportunities[idx] = {
      ...this.opportunities[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.opportunities[idx];
  }

  public deleteOpportunity(id: string): boolean {
    const lenBefore = this.opportunities.length;
    this.opportunities = this.opportunities.filter((o) => o.id !== id);
    return this.opportunities.length < lenBefore;
  }

  // --- Tasks CRUD ---
  public getTasks(): Task[] {
    return this.tasks;
  }

  public createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = {
      ...this.tasks[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const lenBefore = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < lenBefore;
  }

  // --- Activities CRUD ---
  public getActivities(): Activity[] {
    return this.activities;
  }

  public logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const newAct: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.activities.unshift(newAct);
    return newAct;
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.users;
  }
}

export const crmService = new CrmService();
