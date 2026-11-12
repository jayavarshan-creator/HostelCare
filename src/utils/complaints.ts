import {
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  EmployeeCategory,
  User,
  CategoryMetadata,
  Notice,
} from '../types';

export const CATEGORIES_METADATA: CategoryMetadata[] = [
  {
    id: 'cleaning',
    title: 'Room Cleaning',
    subtitle: 'Report if the room or common area is not clean.',
    icon: 'broom',
    badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    accentColor: '#F59E0B',
    sampleIssues: ['Floor mopping required', 'Trash bin full', 'Corridor dustbin overflow', 'Washroom deep cleaning'],
    defaultTechnicianCategory: 'cleaning',
  },
  {
    id: 'electricity',
    title: 'Electricity / Lights',
    subtitle: 'Report if there is an issue with electricity or lights.',
    icon: 'lightbulb',
    badgeBg: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    accentColor: '#EAB308',
    sampleIssues: ['Study tube light flickering', 'Power socket not working', 'Main switch trip', 'Switchboard sparking'],
    defaultTechnicianCategory: 'electricity',
  },
  {
    id: 'water',
    title: 'Water Supply',
    subtitle: 'Report if there is no water or water supply issue.',
    icon: 'droplet',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    accentColor: '#06B6D4',
    sampleIssues: ['No running water in tap', 'Bathroom tap leaking continuously', 'Low water pressure', 'Geyser cold water only'],
    defaultTechnicianCategory: 'water',
  },
  {
    id: 'ac_fan',
    title: 'AC / Fan',
    subtitle: 'Report if AC or fan is not working properly.',
    icon: 'fan',
    badgeBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    accentColor: '#3B82F6',
    sampleIssues: ['Ceiling fan making squeaking noise', 'Fan regulator speed fixed at 1', 'AC not cooling properly', 'AC remote display broken'],
    defaultTechnicianCategory: 'ac_fan',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    subtitle: 'Report if any furniture is damaged or missing.',
    icon: 'armchair',
    badgeBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    accentColor: '#EA580C',
    sampleIssues: ['Study chair wheel broken', 'Cupboard lock jammed', 'Bed frame screw loose', 'Study table drawer stuck'],
    defaultTechnicianCategory: 'furniture',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi / Internet',
    subtitle: 'Report if Wi-Fi or internet is not working.',
    icon: 'wifi',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    accentColor: '#6366F1',
    sampleIssues: ['Hostel Wi-Fi captive portal login loop', 'No Wi-Fi signal in room 304', 'LAN port socket damaged', 'Very high latency / dropouts'],
    defaultTechnicianCategory: 'wifi',
  },
  {
    id: 'others',
    title: 'Others',
    subtitle: 'Report any other issue.',
    icon: 'message-circle',
    badgeBg: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    accentColor: '#A855F7',
    sampleIssues: ['Window mosquito mesh torn', 'Room door latch jammed', 'Noise complaint in quiet hours', 'Pest control needed'],
    defaultTechnicianCategory: 'others',
  },
];

export const DEMO_USERS: User[] = [
  // Student
  {
    id: 'STU-1024',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@hostel.edu',
    role: 'student',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    roomNumber: 'B-304',
    hostelBlock: 'Block B (Nilgiri)',
  },
  // Warden
  {
    id: 'WARDEN-01',
    name: 'Dr. Rajesh Deshmukh',
    email: 'warden.deshmukh@hostel.edu',
    role: 'warden',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    designation: 'Chief Hostel Warden & Administrator',
    hostelBlock: 'All Blocks (A, B, C)',
  },
  // Employees for each domain
  {
    id: 'EMP-ELEC-01',
    name: 'Ramesh Verma',
    email: 'ramesh.verma@maintenance.hostel.edu',
    role: 'employee',
    employeeCategory: 'electricity',
    phone: '+91 98222 33445',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    designation: 'Senior Electrician (Tech Level 2)',
  },
  {
    id: 'EMP-PLUMB-01',
    name: 'Suresh Nair',
    email: 'suresh.nair@maintenance.hostel.edu',
    role: 'employee',
    employeeCategory: 'water',
    phone: '+91 98333 44556',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    designation: 'Lead Plumbing & Water Supply Tech',
  },
  {
    id: 'EMP-CLEAN-01',
    name: 'Sunita Devi',
    email: 'sunita.devi@maintenance.hostel.edu',
    role: 'employee',
    employeeCategory: 'cleaning',
    phone: '+91 98444 55667',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    designation: 'Housekeeping & Sanitation Supervisor',
  },
  {
    id: 'EMP-AC-01',
    name: 'Imran Khan',
    email: 'imran.khan@maintenance.hostel.edu',
    role: 'employee',
    employeeCategory: 'ac_fan',
    phone: '+91 98555 66778',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    designation: 'HVAC & Appliance Specialist',
  },
  {
    id: 'EMP-WIFI-01',
    name: 'Ananya Sen',
    email: 'ananya.sen@campus-net.hostel.edu',
    role: 'employee',
    employeeCategory: 'wifi',
    phone: '+91 98666 77889',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    designation: 'Network & Systems Engineer',
  },
  {
    id: 'EMP-FURN-01',
    name: 'David Raj',
    email: 'david.raj@maintenance.hostel.edu',
    role: 'employee',
    employeeCategory: 'furniture',
    phone: '+91 98777 88990',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    designation: 'Carpentry & Facilities Specialist',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'NOT-101',
    title: 'Overhead Water Tank Deep Cleaning & Disinfection',
    content: 'Water supply to Blocks A and B will be temporarily paused between 09:30 AM to 01:30 PM this Saturday for quarterly sanitation. Drinking water dispensers on Ground Floor will remain operational.',
    category: 'water',
    date: '12 Nov 2026',
    authorName: 'Dr. Rajesh Deshmukh',
    authorRole: 'Chief Warden',
    isImportant: true,
  },
  {
    id: 'NOT-102',
    title: 'High-Speed Wi-Fi Access Point Upgrade in Block B',
    content: 'Wi-Fi 6 routers have been deployed across 2nd & 3rd floors of Block B. In case of authentication prompt, please re-login via the captive portal with your Student ID.',
    category: 'wifi',
    date: '11 Nov 2026',
    authorName: 'Ananya Sen',
    authorRole: 'Network Engineer',
    isImportant: false,
  },
  {
    id: 'NOT-103',
    title: 'Fire Safety & Electrical Extension Cord Guidelines',
    content: 'High-power immersion rods and non-ISI heaters are strictly prohibited in hostel rooms. Please submit maintenance requests if any power switchboard is heating up.',
    category: 'electricity',
    date: '08 Nov 2026',
    authorName: 'Ramesh Verma',
    authorRole: 'Senior Electrician',
    isImportant: true,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  // 1. Complaint exactly matching the poster demo: Room Cleaning
  {
    id: 'HC-1001',
    category: 'cleaning',
    title: 'Room Cleaning & Trash Disposal',
    description: 'Room and corridor outside door needs sweeping and disinfectant mopping after heavy weekend dust.',
    studentId: 'STU-1024',
    studentName: 'Aarav Sharma',
    studentPhone: '+91 98765 43210',
    roomNumber: 'B-304',
    hostelBlock: 'Block B (Nilgiri)',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-11-11T10:30:00.000Z',
    preferredSlot: '11 Nov 2026, 02:00 - 04:00 PM',
    scheduledSlot: '11 Nov 2026, 02:00 - 04:00 PM',
    assignedEmployeeId: 'EMP-CLEAN-01',
    assignedEmployeeName: 'Sunita Devi',
    assignedEmployeePhone: '+91 98444 55667',
    assignedEmployeeCategory: 'cleaning',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    completionProofUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    technicianNotes: 'Thoroughly sanitized floor, cleared dustbins, applied air freshener. Confirmed with student.',
    verificationOtp: '8492',
    studentRating: 5,
    studentFeedback: 'Spotless cleaning, completed right on time! Thank you Sunita ji.',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Your complaint has been successfully registered.',
        timestamp: '11 Nov 2026, 10:30 AM',
        completed: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Scheduled on 11 Nov 2026, 02:00 - 04:00 PM',
        timestamp: '11 Nov 2026, 11:15 AM',
        completed: true,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Your complaint has been resolved.',
        timestamp: '11 Nov 2026, 04:15 PM',
        completed: true,
      },
    ],
  },
  // 2. Electricity issue in progress
  {
    id: 'HC-1002',
    category: 'electricity',
    title: 'Study Tube Light Flickering & Switchboard Spark',
    description: 'The tube light above study desk is rapidly blinking and the two-pin socket sparks when laptop charger is inserted.',
    studentId: 'STU-1024',
    studentName: 'Aarav Sharma',
    studentPhone: '+91 98765 43210',
    roomNumber: 'B-304',
    hostelBlock: 'Block B (Nilgiri)',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-11-12T08:15:00.000Z',
    preferredSlot: 'Today, 02:00 PM - 04:00 PM',
    scheduledSlot: 'Today, 02:30 PM - 03:30 PM',
    assignedEmployeeId: 'EMP-ELEC-01',
    assignedEmployeeName: 'Ramesh Verma',
    assignedEmployeePhone: '+91 98222 33445',
    assignedEmployeeCategory: 'electricity',
    photoUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    technicianNotes: 'Brought 20W LED replacement tube and new 6A modular socket. Currently on site.',
    verificationOtp: '3910',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Complaint logged for Electrical department.',
        timestamp: '12 Nov 2026, 08:15 AM',
        completed: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Assigned to Senior Electrician Ramesh Verma.',
        timestamp: '12 Nov 2026, 09:00 AM',
        completed: true,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Technician resolving on-site.',
        timestamp: 'Estimated 03:30 PM',
        completed: false,
        active: true,
      },
    ],
  },
  // 3. Water supply - Scheduled
  {
    id: 'HC-1003',
    category: 'water',
    title: 'Bathroom Tap Continuous Dripping & Low Pressure',
    description: 'Water tap in sink does not shut off completely, wasting water. Hot water geyser pressure also weak.',
    studentId: 'STU-1024',
    studentName: 'Aarav Sharma',
    studentPhone: '+91 98765 43210',
    roomNumber: 'B-304',
    hostelBlock: 'Block B (Nilgiri)',
    priority: 'medium',
    status: 'scheduled',
    createdAt: '2026-11-12T09:40:00.000Z',
    preferredSlot: 'Today, 04:00 PM - 06:00 PM',
    scheduledSlot: 'Today, 04:30 PM - 05:30 PM',
    assignedEmployeeId: 'EMP-PLUMB-01',
    assignedEmployeeName: 'Suresh Nair',
    assignedEmployeePhone: '+91 98333 44556',
    assignedEmployeeCategory: 'water',
    verificationOtp: '5721',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Your complaint has been successfully registered.',
        timestamp: '12 Nov 2026, 09:40 AM',
        completed: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Scheduled with Suresh Nair for 04:30 PM.',
        timestamp: '12 Nov 2026, 10:10 AM',
        completed: true,
        active: true,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Pending rectification.',
        timestamp: 'Pending',
        completed: false,
      },
    ],
  },
  // 4. Wi-Fi complaint - Newly Registered (Awaiting Warden/IT assignment)
  {
    id: 'HC-1004',
    category: 'wifi',
    title: 'Wi-Fi Frequent Dropouts & High Latency in Room',
    description: 'Cannot connect to hostel 5GHz network during evening online project calls. Signal keeps disconnecting.',
    studentId: 'STU-1024',
    studentName: 'Aarav Sharma',
    studentPhone: '+91 98765 43210',
    roomNumber: 'B-304',
    hostelBlock: 'Block B (Nilgiri)',
    priority: 'high',
    status: 'registered',
    createdAt: '2026-11-12T10:05:00.000Z',
    preferredSlot: 'Today, Evening 06:00 - 08:00 PM',
    verificationOtp: '6204',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Logged and routed to Warden & IT team queue.',
        timestamp: '12 Nov 2026, 10:05 AM',
        completed: true,
        active: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Pending technician slot allocation.',
        timestamp: 'Pending',
        completed: false,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Pending resolution.',
        timestamp: 'Pending',
        completed: false,
      },
    ],
  },
  // 5. AC / Fan complaint from student Priya (Room A-202)
  {
    id: 'HC-1005',
    category: 'ac_fan',
    title: 'Ceiling Fan Regulator Stuck at Max Speed with Vibrations',
    description: 'Ceiling fan makes grinding noise and wall regulator cannot lower the speed.',
    studentId: 'STU-1025',
    studentName: 'Priya Nair',
    studentPhone: '+91 98111 55443',
    roomNumber: 'A-202',
    hostelBlock: 'Block A (Sahyadri)',
    priority: 'medium',
    status: 'scheduled',
    createdAt: '2026-11-12T07:30:00.000Z',
    preferredSlot: 'Today, 11:00 AM - 01:00 PM',
    scheduledSlot: 'Today, 11:30 AM - 12:30 PM',
    assignedEmployeeId: 'EMP-AC-01',
    assignedEmployeeName: 'Imran Khan',
    assignedEmployeePhone: '+91 98555 66778',
    assignedEmployeeCategory: 'ac_fan',
    verificationOtp: '7193',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Successfully registered in system.',
        timestamp: '12 Nov 2026, 07:30 AM',
        completed: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Scheduled with Imran Khan.',
        timestamp: '12 Nov 2026, 08:45 AM',
        completed: true,
        active: true,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Pending rectification.',
        timestamp: 'Pending',
        completed: false,
      },
    ],
  },
  // 6. Furniture issue
  {
    id: 'HC-1006',
    category: 'furniture',
    title: 'Study Table Drawer Latch & Cupboard Key Broken',
    description: 'The wooden drawer has derailed and the steel almirah lock key is stuck inside the cylinder.',
    studentId: 'STU-1026',
    studentName: 'Rohan Mehta',
    studentPhone: '+91 98999 11223',
    roomNumber: 'C-108',
    hostelBlock: 'Block C (Aravali)',
    priority: 'low',
    status: 'registered',
    createdAt: '2026-11-12T09:10:00.000Z',
    preferredSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
    verificationOtp: '4038',
    timeline: [
      {
        step: 'registered',
        title: 'Complaint Registered',
        description: 'Registered in queue for Carpentry.',
        timestamp: '12 Nov 2026, 09:10 AM',
        completed: true,
        active: true,
      },
      {
        step: 'scheduled',
        title: 'Time Slot for Rectification',
        description: 'Awaiting warden slot assignment.',
        timestamp: 'Pending',
        completed: false,
      },
      {
        step: 'completed',
        title: 'Completed',
        description: 'Pending resolution.',
        timestamp: 'Pending',
        completed: false,
      },
    ],
  },
];

// Pure Helper Logic & Calculations

/**
 * Filter complaints based on the current user's role and category
 */
export function filterComplaintsForUser(complaints: Complaint[], user: User): Complaint[] {
  if (!user) return [];
  if (user.role === 'warden') {
    return complaints;
  }
  if (user.role === 'student') {
    return complaints.filter((c) => c.studentId === user.id);
  }
  if (user.role === 'employee') {
    return complaints.filter((c) => {
      // Show if assigned directly to this employee, OR if unassigned matching employee category
      const matchesCategory = user.employeeCategory ? c.category === user.employeeCategory : true;
      const isAssignedToMe = c.assignedEmployeeId === user.id;
      return isAssignedToMe || (matchesCategory && c.status === 'registered');
    });
  }
  return [];
}

/**
 * Calculate KPI summary metrics
 */
export function calculateComplaintMetrics(complaints: Complaint[]) {
  const total = complaints.length;
  const registered = complaints.filter((c) => c.status === 'registered').length;
  const scheduled = complaints.filter((c) => c.status === 'scheduled').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const completed = complaints.filter((c) => c.status === 'completed' || c.status === 'closed').length;
  const highOrEmergency = complaints.filter(
    (c) => (c.priority === 'high' || c.priority === 'emergency') && c.status !== 'completed' && c.status !== 'closed'
  ).length;

  const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by category
  const categoryCounts = complaints.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    registered,
    scheduled,
    inProgress,
    completed,
    highOrEmergency,
    resolutionRate,
    categoryCounts,
  };
}

/**
 * Validates a complaint submission
 */
export function validateComplaintSubmission(data: {
  category: string;
  title: string;
  description: string;
  roomNumber: string;
  studentPhone: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Please choose a complaint category.';
  }
  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Please provide a clear description (at least 10 characters).';
  }
  if (!data.roomNumber || data.roomNumber.trim().length < 2) {
    errors.roomNumber = 'Please specify a valid room number (e.g., B-304).';
  }
  if (!data.studentPhone || data.studentPhone.trim().length < 8) {
    errors.studentPhone = 'Please provide a valid contact number.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generate a random 4-digit verification OTP
 */
export function generateVerificationOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Checks if a status transition is permitted
 */
export function canTransitionStatus(
  current: ComplaintStatus,
  target: ComplaintStatus,
  hasAssignedEmployee: boolean
): { allowed: boolean; reason?: string } {
  if (current === target) return { allowed: true };

  if (target === 'scheduled' && !hasAssignedEmployee) {
    return { allowed: false, reason: 'A technician must be assigned before scheduling.' };
  }

  if (current === 'completed' && target === 'registered') {
    return { allowed: false, reason: 'Completed complaints cannot be reverted to registered.' };
  }

  return { allowed: true };
}

/**
 * Formats a short timestamp for the timeline
 */
export function formatTimelineDate(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export interface UserRegistrationData {
  role: 'student' | 'warden' | 'employee';
  name: string;
  id: string;
  email: string;
  phone?: string;
  roomNumber?: string;
  hostelBlock?: string;
  designation?: string;
  employeeCategory?: EmployeeCategory;
}

/**
 * Validates registration for Student, Warden, or Employee
 */
export function validateUserRegistration(data: UserRegistrationData): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!data.id || data.id.trim().length < 2) {
    errors.id = 'ID / Employee Code is required.';
  }
  if (!data.email || !data.email.includes('@')) {
    errors.email = 'A valid email address is required.';
  }

  if (data.role === 'student') {
    if (!data.roomNumber || data.roomNumber.trim().length < 2) {
      errors.roomNumber = 'Room number is required (e.g. B-304).';
    }
  } else if (data.role === 'warden') {
    if (!data.designation || data.designation.trim().length < 2) {
      errors.designation = 'Designation is required (e.g. Assistant Warden).';
    }
  } else if (data.role === 'employee') {
    if (!data.employeeCategory) {
      errors.employeeCategory = 'Please choose a maintenance trade/department.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
