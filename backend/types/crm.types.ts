export type Salutation = 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Prof.' | 'Other';

export type AccountType =
  | 'Prospect'
  | 'Customer - Direct'
  | 'Customer - Channel'
  | 'Channel Partner'
  | 'Technology Partner'
  | 'Other';

export type Industry =
  | 'Technology'
  | 'Finance & Banking'
  | 'Healthcare & Life Sciences'
  | 'Manufacturing'
  | 'Retail & eCommerce'
  | 'Telecommunications'
  | 'Energy & Utilities'
  | 'Professional Services'
  | 'Education'
  | 'Other';

export type OpportunityStage =
  | 'Prospecting'
  | 'Qualification'
  | 'Needs Analysis'
  | 'Value Proposition'
  | 'Id. Decision Makers'
  | 'Proposal/Price Quote'
  | 'Negotiation/Review'
  | 'Closed Won'
  | 'Closed Lost';

export type OpportunityStatus = 'Open' | 'Closed Won' | 'Closed Lost';

export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Urgent';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Deferred';

export type ActivityType =
  | 'Call'
  | 'Email'
  | 'Meeting'
  | 'Note'
  | 'Task Completed'
  | 'Stage Changed'
  | 'OCR Card Scan'
  | 'Document Uploaded'
  | 'Status Updated';

export type UserRole = 'Admin' | 'Sales Manager' | 'Sales Representative' | 'Read Only';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  title?: string;
  phone?: string;
  department?: string;
}

export interface Account {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: AccountType;
  industry: Industry;
  ownership: string;
  rating: 'Hot' | 'Warm' | 'Cold';
  annualRevenue: number;
  employees: number;
  businessSegment: 'Enterprise' | 'Mid-Market' | 'SMB';
  customerStatus: 'Active' | 'Churned' | 'Pending';
  website?: string;
  phone?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  leadSource?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  accountId: string;
  accountName: string;
  jobTitle: string;
  department?: string;
  email: string;
  phone?: string;
  mobile?: string;
  preferredContactMethod?: 'Email' | 'Phone' | 'Mobile';
  source?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  ownerId: string;
  ownerName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  primaryContactId?: string;
  primaryContactName?: string;
  amount: number;
  stage: OpportunityStage;
  probability: number;
  expectedRevenue: number;
  expectedCloseDate: string;
  leadSource?: string;
  status: OpportunityStatus;
  lossReason?: string;
  lossCompetitor?: string;
  ownerId: string;
  ownerName: string;
  nextStep?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  subject: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId: string;
  assignedToName: string;
  relatedToType?: 'Account' | 'Contact' | 'Opportunity';
  relatedToId?: string;
  relatedToName?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  relatedToType?: 'Account' | 'Contact' | 'Opportunity';
  relatedToId?: string;
  relatedToName?: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface CardOcrResult {
  salutation?: Salutation;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  confidence?: number;
  rawText?: string;
}

export interface OpportunityAiInsight {
  summary: string;
  winFactors: string[];
  risks: string[];
  suggestedNextSteps: string[];
  healthScore: number;
}

export interface EmailDraftResponse {
  subject: string;
  body: string;
}
