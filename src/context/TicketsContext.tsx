import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Ticket, TicketStatus, TicketCategory, DashboardStats } from '@/types';

interface TicketsContextType {
  tickets: Ticket[];
  userTickets: Ticket[];
  stats: DashboardStats;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'userName'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  getTicketById: (id: string) => Ticket | undefined;
  filterTickets: (filters: { status?: TicketStatus; category?: TicketCategory; search?: string }) => Ticket[];
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

// Mock tickets data
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Nid de poule dangereux',
    description: 'Grand nid de poule sur l\'avenue Mohammed V, risque d\'accident',
    category: 'pothole',
    status: 'in_progress',
    location: { lat: 34.0209, lng: -6.8416, address: 'Avenue Mohammed V, Rabat' },
    images: ['/ticket-1.jpg'],
    createdAt: '2024-03-10T10:30:00Z',
    updatedAt: '2024-03-11T14:20:00Z',
    userId: '1',
    userName: 'Ahmed Benali'
  },
  {
    id: '2',
    title: 'Lampadaire hors service',
    description: 'Le lampadaire devant l\'école primaire ne fonctionne plus depuis une semaine',
    category: 'streetlight',
    status: 'pending',
    location: { lat: 34.0156, lng: -6.8365, address: 'Rue Al Farabi, Rabat' },
    images: ['/ticket-2.jpg'],
    createdAt: '2024-03-09T16:45:00Z',
    updatedAt: '2024-03-09T16:45:00Z',
    userId: '1',
    userName: 'Ahmed Benali'
  },
  {
    id: '3',
    title: 'Accumulation de déchets',
    description: 'Poubelles non ramassées, mauvaises odeurs',
    category: 'garbage',
    status: 'resolved',
    location: { lat: 34.0253, lng: -6.8478, address: 'Quartier Hassan, Rabat' },
    images: ['/ticket-3.jpg'],
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-08T11:30:00Z',
    userId: '1',
    userName: 'Ahmed Benali'
  },
  {
    id: '4',
    title: 'Graffiti sur mur public',
    description: 'Tags sur le mur de la bibliothèque municipale',
    category: 'graffiti',
    status: 'pending',
    location: { lat: 34.0187, lng: -6.8392, address: 'Bibliothèque Municipale, Rabat' },
    images: ['/ticket-4.jpg'],
    createdAt: '2024-03-11T08:20:00Z',
    updatedAt: '2024-03-11T08:20:00Z',
    userId: '3',
    userName: 'Fatima Zahra'
  },
  {
    id: '5',
    title: 'Canal de drainage bloqué',
    description: 'L\'eau ne s\'écoule plus, risque d\'inondation',
    category: 'canal',
    status: 'in_progress',
    location: { lat: 34.0124, lng: -6.8445, address: 'Rue Oued Sebou, Rabat' },
    images: ['/ticket-5.jpg'],
    createdAt: '2024-03-08T14:00:00Z',
    updatedAt: '2024-03-10T09:45:00Z',
    userId: '3',
    userName: 'Fatima Zahra'
  },
  {
    id: '6',
    title: 'Trottoir endommagé',
    description: 'Dalles cassées, danger pour les piétons',
    category: 'other',
    status: 'resolved',
    location: { lat: 34.0221, lng: -6.8389, address: 'Boulevard Ibn Sina, Rabat' },
    images: ['/ticket-6.jpg'],
    createdAt: '2024-03-01T11:30:00Z',
    updatedAt: '2024-03-06T16:00:00Z',
    userId: '4',
    userName: 'Karim Idrissi'
  }
];

function calculateStats(tickets: Ticket[]): DashboardStats {
  const stats: DashboardStats = {
    totalTickets: tickets.length,
    pendingTickets: tickets.filter(t => t.status === 'pending').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    rejectedTickets: tickets.filter(t => t.status === 'rejected').length,
    ticketsByCategory: {
      pothole: tickets.filter(t => t.category === 'pothole').length,
      streetlight: tickets.filter(t => t.category === 'streetlight').length,
      garbage: tickets.filter(t => t.category === 'garbage').length,
      graffiti: tickets.filter(t => t.category === 'graffiti').length,
      canal: tickets.filter(t => t.category === 'canal').length,
      other: tickets.filter(t => t.category === 'other').length,
    },
    ticketsByMonth: [
      { month: 'Jan', count: 12 },
      { month: 'Fév', count: 18 },
      { month: 'Mar', count: tickets.length },
    ]
  };
  return stats;
}

export function TicketsProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('nballghou-tickets');
    return saved ? JSON.parse(saved) : MOCK_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('nballghou-tickets', JSON.stringify(tickets));
  }, [tickets]);

  const userTickets = userId ? tickets.filter(t => t.userId === userId) : [];
  const stats = calculateStats(tickets);

  const addTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'userName'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userName: 'Current User' // Would come from auth context
    };
    setTickets(prev => [newTicket, ...prev]);
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status, updatedAt: new Date().toISOString() }
        : ticket
    ));
  }, []);

  const getTicketById = useCallback((id: string) => {
    return tickets.find(t => t.id === id);
  }, [tickets]);

  const filterTickets = useCallback((filters: { status?: TicketStatus; category?: TicketCategory; search?: string }) => {
    return tickets.filter(ticket => {
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.category && ticket.category !== filters.category) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.location.address?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [tickets]);

  return (
    <TicketsContext.Provider value={{
      tickets,
      userTickets,
      stats,
      addTicket,
      updateTicketStatus,
      getTicketById,
      filterTickets
    }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
}
