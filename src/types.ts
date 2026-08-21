/**
 * CRM MVP Type Definitions
 * Inspired by Salesforce CRM Architecture
 */

export type UserRole = 'admin' | 'sales' | 'management';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
  phone: string;
  bio?: string;
  preferences: {
    currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD';
    theme: 'light' | 'dark' | 'system';
    compactView: boolean;
    emailNotifications: boolean;
    taskReminders: boolean;
  };
}

export type AccountType = 'Prospect' | 'Customer' | 'Partner' | 'Vendor';
export type IndustryType =
  | 'Technology'
  | 'Financial Services'
  | 'Healthcare & Life Sciences'
  | 'Manufacturing'
  | 'Retail & eCommerce'
  | 'Consulting & Services'
  | 'Energy & Utilities'
  | 'Other';
export type OwnershipType = 'Private' | 'Public' | 'Subsidiary' | 'Other';
export type RatingType = 'Hot' | 'Warm' | 'Cold';
export type BusinessSegment = 'Enterprise' | 'Mid-Market' | 'SMB';
export type CustomerStatus = 'Active' | 'Inactive' | 'Pending' | 'Churned';

export interface Account {
  id: string;
  name: string;
  parentAccountId?: string;
  ownerId: string;
  ownerName: string;
  type: AccountType;
  accountNumber?: string;
  website?: string;
  phone?: string;
  industry: IndustryType;
  ownership: OwnershipType;
  rating: RatingType;
  annualRevenue: number;
  employees: number;
  businessSegment: BusinessSegment;
  customerStatus: CustomerStatus;
  leadSource?: string;
  // Billing
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  // Shipping
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  sameAsBilling?: boolean;
  // Additional
  description?: string;
  notes?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  modifiedBy: string;
}

export type Salutation = 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.' | 'Prof.';
export type SalutationType = Salutation;
export type ContactMethod = 'Email' | 'Phone' | 'Mobile' | 'WhatsApp';
export type PreferredContactMethod = ContactMethod;
export type ContactSource =
  | 'Direct'
  | 'Visiting Card OCR'
  | 'Web Form'
  | 'Referral'
  | 'Partner Referral'
  | 'Event'
  | 'Import'
  | 'Other';

export interface Contact {
  id: string;
  salutation: Salutation;
  firstName: string;
  middleName?: string;
  lastName: string;
  profileImage?: string;
  accountId: string;
  accountName: string;
  jobTitle: string;
  department?: string;
  reportsTo?: string;
  email: string;
  alternateEmail?: string;
  phone?: string;
  mobile?: string;
  linkedInUrl?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  preferredContactMethod: ContactMethod;
  emailOptOut?: boolean;
  doNotCall?: boolean;
  ownerId: string;
  ownerName: string;
  source: ContactSource;
  notes?: string;
  cardImageUrl?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage =
  | 'Qualification'
  | 'Needs Analysis'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type OpportunityStatus = 'Open' | 'Won' | 'Lost';

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  primaryContactId?: string;
  primaryContactName?: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  probability: number; // 0 to 100
  expectedRevenue: number;
  stage: OpportunityStage;
  status: OpportunityStatus;
  expectedCloseDate: string;
  actualCloseDate?: string;
  wonLostReason?: string;
  leadSource: string;
  nextStep?: string;
  description?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'Not Started' | 'In Progress' | 'Completed' | 'Deferred';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime?: string;
  assignedToId: string;
  assignedToName: string;
  relatedToType?: 'Account' | 'Contact' | 'Opportunity' | 'General';
  relatedToId?: string;
  relatedToName?: string;
  isDeleted?: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: 'General' | 'Meeting' | 'Call' | 'Strategy' | 'Proposal';
  relatedToType?: 'Account' | 'Contact' | 'Opportunity' | 'General';
  relatedToId?: string;
  relatedToName?: string;
  authorId: string;
  authorName: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'call'
  | 'Call'
  | 'meeting'
  | 'Meeting'
  | 'email'
  | 'Email'
  | 'stage_change'
  | 'Stage Change'
  | 'note'
  | 'Note'
  | 'task_completed'
  | 'Task Completed'
  | 'card_scanned'
  | 'OCR Card Scan'
  | 'opportunity_created'
  | 'Opportunity Created'
  | 'account_created'
  | 'Account Created';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  relatedToType?: 'Account' | 'Contact' | 'Opportunity' | 'General';
  relatedToId?: string;
  relatedToName?: string;
}

export type DocumentCategory =
  | 'Proposal'
  | 'Contract'
  | 'Quotation'
  | 'NDA'
  | 'Card Scan'
  | 'General';

export interface FileDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  category: DocumentCategory;
  relatedToType?: 'Account' | 'Contact' | 'Opportunity' | 'General';
  relatedToId?: string;
  relatedToName?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileData?: string;
}

export interface EmailComposerData {
  toEmail?: string;
  recipientName?: string;
  recipientTitle?: string;
  accountName?: string;
  contactId?: string;
  opportunityId?: string;
  initialSubject?: string;
  initialBody?: string;
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } | string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  confidence?: number;
  rawText?: string;
}

export type OcrExtractedData = CardOcrResult;
