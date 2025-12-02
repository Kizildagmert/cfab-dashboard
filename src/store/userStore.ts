// src/store/userStore.ts
import { create } from 'zustand';
import type {
  ApiError,
  PaginatedResult,
  SortState,
  User,
  UserFilters,
  UserRole,
} from '../types';
import * as api from '../services/api';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  tckn: string;
  email: string;
  profession: string;
  role: UserRole;
  status: User['status']; // 'active' | 'passive'
};

interface UserListState {
  users: User[];
  page: number;
  size: number;
  total: number;
  sort: SortState;
  filters: UserFilters;
  loading: boolean;
  error: string | null;

  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: SortState) => void;
  setFilters: (partial: Partial<UserFilters>) => void;
  fetchUsers: () => Promise<void>;
  createUser: (input: CreateUserInput) => Promise<void>;
}

const defaultFilters: UserFilters = {
  search: '',
  tcknPrefix: '',
  professions: [],
};

const defaultSort: SortState = {
  field: null,
  direction: 'asc',
};

function isApiError(err: unknown): err is ApiError {
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return true;
  }
  return false;
}

export const useUserStore = create<UserListState>((set, get) => ({
  users: [],
  page: 1,
  size: 10,
  total: 0,
  sort: defaultSort,
  filters: defaultFilters,
  loading: false,
  error: null,

  setPage: (page) => set({ page }),
  setSize: (size) => set({ size }),
  setSort: (sort) => set({ sort }),
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
      page: 1,
    })),

  fetchUsers: async () => {
    const { page, size, sort, filters } = get();
    set({ loading: true, error: null });

    try {
      const res: PaginatedResult<User> = await api.getUsers({
        page,
        size,
        sort,
        filters,
      });

      set({
        users: res.data,
        page: res.page,
        size: res.size,
        total: res.total,
        loading: false,
      });
    } catch (error: unknown) {
      if (isApiError(error)) {
        set({ loading: false, error: error.message });
      } else {
        set({ loading: false, error: 'Kullanıcı listesi alınamadı' });
      }
    }
  },
    createUser: async (input) => {
    set({ loading: true, error: null });

    try {
      await api.createUser(input);
      // Yeni kullanıcı eklendikten sonra listeyi baştan çek
      // İstersen her zaman 1. sayfaya dönebilirsin:
      set({ page: 1 });
      await get().fetchUsers();
    } catch (error: unknown) {
      if (isApiError(error)) {
        set({ loading: false, error: error.message });
      } else {
        set({ loading: false, error: 'Kullanıcı oluşturulamadı' });
      }
    }
  },

}));
