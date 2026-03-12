// User types
export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

// Ticket types
export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
export type TicketCategory = 'pothole' | 'streetlight' | 'garbage' | 'graffiti' | 'canal' | 'other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
}

// Language types
export type Language = 'fr' | 'ar';

export interface Translations {
  [key: string]: string | Translations;
}

// Map types
export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  status: TicketStatus;
  category: TicketCategory;
}

// Stats types
export interface DashboardStats {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  rejectedTickets: number;
  ticketsByCategory: Record<TicketCategory, number>;
  ticketsByMonth: { month: string; count: number }[];
}
