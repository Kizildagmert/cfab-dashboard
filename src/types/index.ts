export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'passive';

export interface User {
  id: number;
  tckn: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profession: string;
  status: UserStatus;
  createdAt: string;
}

export interface UserFilters {
  search: string;          // ad soyad 
  tcknPrefix: string;      // TC filtresi
  professions: string[];   // multi-select meslek
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof User | null;
  direction: SortDirection;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}

export interface ApiError {
  status: number;
  message: string;
}

