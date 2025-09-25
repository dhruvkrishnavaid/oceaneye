import { create } from 'zustand';

export interface Report {
  id: number;
  title: string;
  message: string;
  description: string;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  time: string; // human readable time
  severity: number; // 0-100, where 100 is highest severity
  type: string;
  author: string;
  unread: boolean;
  verified: 'pending' | 'verified' | 'fake';
  images: number;
  videos: number;
}

interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setReports: (reports: Report[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  markAsVerified: (id: number) => void;
  markAsFake: (id: number) => void;
  resetVerificationStatus: (id: number) => void;
  fetchReports: () => Promise<void>;
  
  // Computed getters
  getPendingReports: () => Report[];
  getVerifiedReports: () => Report[];
  getFakeReports: () => Report[];
  getUnreadCount: () => number;
  getVerifiedCount: () => number;
}

// Mock data combining both notification and report data
const mockReports: Report[] = [
  {
    id: 1,
    title: "High Wave Alert",
    message: "Unusual wave patterns detected at Marina Beach",
    description: "Unusual wave patterns observed, waves reaching 3-4 meters",
    location: "Marina Beach, Chennai",
    coordinates: [13.0478, 80.2619],
    timestamp: "2025-09-22T10:30:00Z",
    time: "2 minutes ago",
    severity: 85,
    type: "high_waves",
    author: "Coastal Volunteer",
    unread: true,
    verified: "pending",
    images: 2,
    videos: 1
  },
  {
    id: 2,
    title: "Storm Surge Warning",
    message: "Water levels rising rapidly in Visakhapatnam",
    description: "Water levels rising rapidly, flooding in low-lying areas",
    location: "Visakhapatnam Port",
    coordinates: [17.6868, 83.2185],
    timestamp: "2025-09-22T09:15:00Z",
    time: "15 minutes ago",
    severity: 90,
    type: "storm_surge",
    author: "Port Authority",
    unread: true,
    verified: "pending",
    images: 5,
    videos: 2
  },
  {
    id: 3,
    title: "System Update",
    message: "Coastal monitoring sensors updated successfully",
    description: "All coastal monitoring sensors have been updated with the latest firmware",
    location: "Multiple Locations",
    coordinates: [20.5937, 78.9629], // India center
    timestamp: "2025-09-22T07:00:00Z",
    time: "1 hour ago",
    severity: 15,
    type: "system_update",
    author: "System Administrator",
    unread: false,
    verified: "verified",
    images: 0,
    videos: 0
  },
  {
    id: 4,
    title: "New User Report",
    message: "Volunteer reported debris at Kovalam Beach",
    description: "Significant debris noticed after recent storms, cleanup required",
    location: "Kovalam Beach, Kerala",
    coordinates: [8.4004, 76.9784],
    timestamp: "2025-09-22T06:20:00Z",
    time: "2 hours ago",
    severity: 55,
    type: "coastal_damage",
    author: "Environmental Group",
    unread: false,
    verified: "verified",
    images: 8,
    videos: 1
  },
  {
    id: 5,
    title: "Weather Advisory",
    message: "Moderate to rough seas expected for next 24 hours",
    description: "False weather advisory - conditions are actually calm",
    location: "Bay of Bengal",
    coordinates: [15.0000, 85.0000],
    timestamp: "2025-09-22T05:15:00Z",
    time: "4 hours ago",
    severity: 45,
    type: "weather_advisory",
    author: "Fake Weather Service",
    unread: false,
    verified: "fake",
    images: 0,
    videos: 0
  },
  {
    id: 6,
    title: "Equipment Maintenance",
    message: "Scheduled maintenance of monitoring buoy #7",
    description: "Routine maintenance completed successfully on monitoring equipment",
    location: "Offshore Chennai",
    coordinates: [13.0827, 80.2707],
    timestamp: "2025-09-22T04:30:00Z",
    time: "6 hours ago",
    severity: 20,
    type: "maintenance",
    author: "Maintenance Team",
    unread: false,
    verified: "verified",
    images: 3,
    videos: 0
  },
  {
    id: 7,
    title: "Tidal Alert",
    message: "Exceptionally high tide expected at 3:00 PM",
    description: "Tide receding much faster than predicted, unusual patterns observed",
    location: "Puri Beach, Odisha",
    coordinates: [19.8135, 85.8312],
    timestamp: "2025-09-22T02:45:00Z",
    time: "8 hours ago",
    severity: 60,
    type: "unusual_tide",
    author: "Local Fisherman",
    unread: true,
    verified: "pending",
    images: 1,
    videos: 0
  },
  {
    id: 8,
    title: "Tsunami Drill Success",
    message: "Annual tsunami evacuation drill completed successfully",
    description: "All evacuation procedures tested and working properly",
    location: "Kanyakumari District",
    coordinates: [8.4875, 77.6784],
    timestamp: "2025-09-21T10:00:00Z",
    time: "1 day ago",
    severity: 10,
    type: "drill",
    author: "Emergency Management",
    unread: false,
    verified: "verified",
    images: 12,
    videos: 3
  }
];

// Mock API function
const fetchReportsAPI = async (): Promise<Report[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional API errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch reports');
  }
  
  return mockReports;
};

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: mockReports, // Initialize with mock data
  isLoading: false,
  error: null,

  // Computed getters as functions
  getPendingReports: () => {
    return get().reports.filter(r => r.verified === 'pending');
  },

  getVerifiedReports: () => {
    return get().reports.filter(r => r.verified === 'verified');
  },

  getFakeReports: () => {
    return get().reports.filter(r => r.verified === 'fake');
  },

  getUnreadCount: () => {
    return get().reports.filter(r => r.unread || r.verified === 'pending').length;
  },

  getVerifiedCount: () => {
    return get().reports.filter(r => r.verified === 'verified').length;
  },

  setReports: (reports: Report[]) => {
    set({ 
      reports,
      error: null 
    });
  },

  markAsRead: (id: number) => {
    const { reports } = get();
    const updatedReports = reports.map(r => 
      r.id === id ? { ...r, unread: false } : r
    );
    set({ reports: updatedReports });
  },

  markAllAsRead: () => {
    const { reports } = get();
    const updatedReports = reports.map(r => ({ ...r, unread: false }));
    set({ reports: updatedReports });
  },

  markAsVerified: (id: number) => {
    const { reports } = get();
    const updatedReports = reports.map(r => 
      r.id === id ? { ...r, verified: 'verified' as const, unread: false } : r
    );
    set({ reports: updatedReports });
  },

  markAsFake: (id: number) => {
    const { reports } = get();
    const updatedReports = reports.map(r => 
      r.id === id ? { ...r, verified: 'fake' as const, unread: false } : r
    );
    set({ reports: updatedReports });
  },

  resetVerificationStatus: (id: number) => {
    const { reports } = get();
    const updatedReports = reports.map(r => 
      r.id === id ? { ...r, verified: 'pending' as const, unread: true } : r
    );
    set({ reports: updatedReports });
  },

  fetchReports: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const reports = await fetchReportsAPI();
      set({ 
        reports,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },
}));