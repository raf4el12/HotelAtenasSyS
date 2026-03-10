import apiClient from '@/lib/axios';

export interface OccupancyStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  cleaningRooms: number;
  occupancyRate: number;
}

export interface StaysStats {
  activeStays: number;
  checkInsToday: number;
  checkOutsToday: number;
}

export interface ReservationsStats {
  pendingReservations: number;
  confirmedReservations: number;
  next7DaysReservations: number;
}

export interface RevenueStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  occupancy: OccupancyStats;
  stays: StaysStats;
  reservations: ReservationsStats;
  revenue: RevenueStats;
  totalGuests: number;
  lowStockProducts: number;
  recentActivity: RecentActivity[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
