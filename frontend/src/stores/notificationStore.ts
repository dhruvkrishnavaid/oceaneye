import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  unread: boolean;
  verified?: 'pending' | 'verified' | 'fake';
}

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  markAsVerified: (id: number) => void;
  markAsFake: (id: number) => void;
  fetchNotifications: () => Promise<void>;
}

// Mock API call
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "High Wave Alert",
    message: "Unusual wave patterns detected at Marina Beach",
    time: "2 minutes ago",
    severity: "high",
    unread: true,
    verified: "pending",
  },
  {
    id: 2,
    title: "Storm Surge Warning",
    message: "Water levels rising rapidly in Visakhapatnam",
    time: "15 minutes ago",
    severity: "high",
    unread: true,
    verified: "pending",
  },
  {
    id: 3,
    title: "System Update",
    message: "Coastal monitoring sensors updated successfully",
    time: "1 hour ago",
    severity: "low",
    unread: false,
    verified: "verified",
  },
  {
    id: 4,
    title: "New User Report",
    message: "Volunteer reported debris at Kovalam Beach",
    time: "2 hours ago",
    severity: "medium",
    unread: false,
    verified: "verified",
  },
  {
    id: 5,
    title: "Weather Advisory",
    message: "Moderate to rough seas expected for next 24 hours",
    time: "4 hours ago",
    severity: "medium",
    unread: false,
    verified: "fake",
  },
  {
    id: 6,
    title: "Equipment Maintenance",
    message: "Scheduled maintenance of monitoring buoy #7",
    time: "6 hours ago",
    severity: "low",
    unread: true,
    verified: "pending",
  },
  {
    id: 7,
    title: "Tidal Alert",
    message: "Exceptionally high tide expected at 3:00 PM",
    time: "8 hours ago",
    severity: "medium",
    unread: true,
    verified: "pending",
  },
];

// Mock API function
const fetchNotificationsAPI = async (): Promise<Notification[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional API errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch notifications');
  }
  
  return mockNotifications;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,

  setNotifications: (notifications: Notification[]) => {
    const unreadCount = notifications.filter(n => n.unread).length;
    set({ 
      notifications,
      unreadCount,
      error: null 
    });
  },

  markAsRead: (id: number) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    const unreadCount = updatedNotifications.filter(n => n.unread).length;
    set({ 
      notifications: updatedNotifications,
      unreadCount 
    });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => ({ ...n, unread: false }));
    set({ 
      notifications: updatedNotifications,
      unreadCount: 0 
    });
  },

  markAsVerified: (id: number) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, verified: 'verified' as const } : n
    );
    set({ notifications: updatedNotifications });
  },

  markAsFake: (id: number) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, verified: 'fake' as const } : n
    );
    set({ notifications: updatedNotifications });
  },

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const notifications = await fetchNotificationsAPI();
      const unreadCount = notifications.filter(n => n.unread).length;
      set({ 
        notifications,
        unreadCount,
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