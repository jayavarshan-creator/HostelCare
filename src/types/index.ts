export type UserRole = 'student' | 'warden' | 'employee';

export type EmployeeCategory =
  | 'cleaning'
  | 'electricity'
  | 'water'
  | 'ac_fan'
  | 'furniture'
  | 'wifi'
  | 'others';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeCategory?: EmployeeCategory;
  phone: string;
  avatar: string;
  roomNumber?: string;
  hostelBlock?: string;
  designation?: string;
}

export type ComplaintCategory =
  | 'cleaning'
  | 'electricity'
  | 'water'
  | 'ac_fan'
  | 'furniture'
  | 'wifi'
  | 'others';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'emergency';

export type ComplaintStatus =
  | 'registered'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'closed';

export interface ComplaintTimelineStep {
  step: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  roomNumber: string;
  hostelBlock: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  preferredSlot: string;
  scheduledSlot?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignedEmployeePhone?: string;
  assignedEmployeeCategory?: EmployeeCategory;
  photoUrl?: string;
  completionProofUrl?: string;
  technicianNotes?: string;
  verificationOtp: string;
  studentRating?: number;
  studentFeedback?: string;
  timeline: ComplaintTimelineStep[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'water' | 'electricity' | 'general' | 'wifi' | 'inspection';
  date: string;
  authorName: string;
  authorRole: string;
  isImportant?: boolean;
}

export interface CategoryMetadata {
  id: ComplaintCategory;
  title: string;
  subtitle: string;
  icon: string;
  badgeBg: string;
  accentColor: string;
  sampleIssues: string[];
  defaultTechnicianCategory: EmployeeCategory;
}
