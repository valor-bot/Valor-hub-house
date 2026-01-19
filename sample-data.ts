export type JobStatus = 'Lead' | 'Scheduled' | 'In Progress' | 'Complete' | 'Invoiced' | 'Paid';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  address: string;
  scheduledDate: Date;
  scheduledTime: string;
  assignedStaff: string;
  status: JobStatus;
  notes: string;
  checklistItems: ChecklistItem[];
  estimateAmount?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Estimate {
  id: string;
  clientId: string;
  clientName: string;
  jobId?: string;
  items: EstimateItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Declined';
  createdAt: Date;
}

export interface EstimateItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  jobId: string;
  items: EstimateItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Paid';
  createdAt: Date;
  dueDate: Date;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  phone: string;
}

// Sample Clients
export const sampleClients: Client[] = [
  {
    id: 'c1',
    name: 'John Anderson',
    phone: '(555) 123-4567',
    email: 'john.anderson@email.com',
    address: '123 Oak Street, Springfield, IL 62701',
    notes: 'Prefers morning appointments. Has a dog.',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'c2',
    name: 'Sarah Mitchell',
    phone: '(555) 234-5678',
    email: 'sarah.m@email.com',
    address: '456 Maple Avenue, Springfield, IL 62702',
    notes: 'Gate code: 1234',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'c3',
    name: 'Robert Chen',
    phone: '(555) 345-6789',
    email: 'robert.chen@email.com',
    address: '789 Pine Road, Springfield, IL 62703',
    notes: 'Commercial property manager. Multiple units.',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'c4',
    name: 'Emily Watson',
    phone: '(555) 456-7890',
    email: 'emily.w@email.com',
    address: '321 Cedar Lane, Springfield, IL 62704',
    notes: '',
    createdAt: new Date('2024-04-05'),
  },
  {
    id: 'c5',
    name: 'Michael Torres',
    phone: '(555) 567-8901',
    email: 'm.torres@email.com',
    address: '654 Birch Drive, Springfield, IL 62705',
    notes: 'Referred by John Anderson',
    createdAt: new Date('2024-05-12'),
  },
];

// Sample Staff
export const sampleStaff: Staff[] = [
  {
    id: 's1',
    name: 'Mike Johnson',
    email: 'mike@valorhome.com',
    role: 'admin',
    phone: '(555) 111-2222',
  },
  {
    id: 's2',
    name: 'Dave Wilson',
    email: 'dave@valorhome.com',
    role: 'staff',
    phone: '(555) 222-3333',
  },
  {
    id: 's3',
    name: 'Tom Rodriguez',
    email: 'tom@valorhome.com',
    role: 'staff',
    phone: '(555) 333-4444',
  },
];

// Sample Jobs
export const sampleJobs: Job[] = [
  {
    id: 'j1',
    clientId: 'c1',
    clientName: 'John Anderson',
    serviceType: 'Kitchen Remodel',
    address: '123 Oak Street, Springfield, IL 62701',
    scheduledDate: new Date(),
    scheduledTime: '09:00 AM',
    assignedStaff: 'Dave Wilson',
    status: 'In Progress',
    notes: 'Installing new cabinets today',
    checklistItems: [
      { id: 'ch1', text: 'Remove old cabinets', completed: true },
      { id: 'ch2', text: 'Install new cabinets', completed: false },
      { id: 'ch3', text: 'Install countertops', completed: false },
      { id: 'ch4', text: 'Final inspection', completed: false },
    ],
    estimateAmount: 12500,
  },
  {
    id: 'j2',
    clientId: 'c2',
    clientName: 'Sarah Mitchell',
    serviceType: 'Bathroom Renovation',
    address: '456 Maple Avenue, Springfield, IL 62702',
    scheduledDate: new Date(),
    scheduledTime: '02:00 PM',
    assignedStaff: 'Tom Rodriguez',
    status: 'Scheduled',
    notes: 'Full bathroom remodel - master bath',
    checklistItems: [
      { id: 'ch5', text: 'Demo existing fixtures', completed: false },
      { id: 'ch6', text: 'Plumbing rough-in', completed: false },
      { id: 'ch7', text: 'Tile installation', completed: false },
      { id: 'ch8', text: 'Install new fixtures', completed: false },
    ],
    estimateAmount: 8750,
  },
  {
    id: 'j3',
    clientId: 'c3',
    clientName: 'Robert Chen',
    serviceType: 'Deck Installation',
    address: '789 Pine Road, Springfield, IL 62703',
    scheduledDate: new Date(Date.now() + 86400000),
    scheduledTime: '08:00 AM',
    assignedStaff: 'Dave Wilson',
    status: 'Scheduled',
    notes: 'Composite deck, 400 sq ft',
    checklistItems: [
      { id: 'ch9', text: 'Site preparation', completed: false },
      { id: 'ch10', text: 'Frame construction', completed: false },
      { id: 'ch11', text: 'Decking installation', completed: false },
      { id: 'ch12', text: 'Railing installation', completed: false },
    ],
    estimateAmount: 15000,
  },
  {
    id: 'j4',
    clientId: 'c4',
    clientName: 'Emily Watson',
    serviceType: 'Window Replacement',
    address: '321 Cedar Lane, Springfield, IL 62704',
    scheduledDate: new Date(Date.now() - 86400000 * 2),
    scheduledTime: '10:00 AM',
    assignedStaff: 'Tom Rodriguez',
    status: 'Complete',
    notes: '8 windows replaced',
    checklistItems: [
      { id: 'ch13', text: 'Remove old windows', completed: true },
      { id: 'ch14', text: 'Install new windows', completed: true },
      { id: 'ch15', text: 'Seal and insulate', completed: true },
      { id: 'ch16', text: 'Clean up', completed: true },
    ],
    estimateAmount: 6200,
  },
  {
    id: 'j5',
    clientId: 'c5',
    clientName: 'Michael Torres',
    serviceType: 'Roof Repair',
    address: '654 Birch Drive, Springfield, IL 62705',
    scheduledDate: new Date(Date.now() - 86400000 * 5),
    scheduledTime: '07:00 AM',
    assignedStaff: 'Dave Wilson',
    status: 'Invoiced',
    notes: 'Storm damage repair',
    checklistItems: [
      { id: 'ch17', text: 'Inspect damage', completed: true },
      { id: 'ch18', text: 'Replace damaged shingles', completed: true },
      { id: 'ch19', text: 'Check for leaks', completed: true },
    ],
    estimateAmount: 2800,
  },
  {
    id: 'j6',
    clientId: 'c1',
    clientName: 'John Anderson',
    serviceType: 'Fence Installation',
    address: '123 Oak Street, Springfield, IL 62701',
    scheduledDate: new Date(Date.now() + 86400000 * 3),
    scheduledTime: '08:00 AM',
    assignedStaff: 'Tom Rodriguez',
    status: 'Lead',
    notes: 'Interested in privacy fence, needs estimate',
    checklistItems: [],
    estimateAmount: undefined,
  },
];

// Sample Estimates
export const sampleEstimates: Estimate[] = [
  {
    id: 'e1',
    clientId: 'c1',
    clientName: 'John Anderson',
    jobId: 'j1',
    items: [
      { description: 'Kitchen Cabinets', quantity: 1, unitPrice: 5500 },
      { description: 'Countertops (Granite)', quantity: 30, unitPrice: 150 },
      { description: 'Labor', quantity: 40, unitPrice: 75 },
    ],
    total: 12500,
    status: 'Approved',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'e2',
    clientId: 'c2',
    clientName: 'Sarah Mitchell',
    jobId: 'j2',
    items: [
      { description: 'Bathroom Fixtures', quantity: 1, unitPrice: 2500 },
      { description: 'Tile (sq ft)', quantity: 100, unitPrice: 25 },
      { description: 'Labor', quantity: 45, unitPrice: 75 },
    ],
    total: 8750,
    status: 'Approved',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'e3',
    clientId: 'c1',
    clientName: 'John Anderson',
    items: [
      { description: 'Privacy Fence (linear ft)', quantity: 150, unitPrice: 45 },
      { description: 'Gate', quantity: 1, unitPrice: 350 },
      { description: 'Labor', quantity: 24, unitPrice: 75 },
    ],
    total: 8900,
    status: 'Sent',
    createdAt: new Date('2024-06-01'),
  },
];

// Sample Invoices
export const sampleInvoices: Invoice[] = [
  {
    id: 'i1',
    clientId: 'c4',
    clientName: 'Emily Watson',
    jobId: 'j4',
    items: [
      { description: 'Windows (8 units)', quantity: 8, unitPrice: 550 },
      { description: 'Installation Labor', quantity: 16, unitPrice: 75 },
    ],
    total: 5600,
    status: 'Paid',
    createdAt: new Date('2024-05-20'),
    dueDate: new Date('2024-06-20'),
  },
  {
    id: 'i2',
    clientId: 'c5',
    clientName: 'Michael Torres',
    jobId: 'j5',
    items: [
      { description: 'Roofing Materials', quantity: 1, unitPrice: 1200 },
      { description: 'Labor', quantity: 20, unitPrice: 80 },
    ],
    total: 2800,
    status: 'Sent',
    createdAt: new Date('2024-06-10'),
    dueDate: new Date('2024-07-10'),
  },
];
