import { MOCK_USERS } from './data';
import type {
  ApiError,
  PaginatedResult,
  SortState,
  User,
  UserFilters,
  UserRole,
} from '../types';

const USERS_STORAGE_KEY = 'crudfab_users';

// ------- LocalStorage helper'ları -------

function loadUsersFromStorage(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [...MOCK_USERS];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...MOCK_USERS];

    return parsed as User[];
  } catch {
    return [...MOCK_USERS];
  }
}

function saveUsersToStorage(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // 
  }
}

let usersDb: User[] = loadUsersFromStorage();

function ensureUsersDbLoaded(): void {
  if (!usersDb || usersDb.length === 0) {
    usersDb = loadUsersFromStorage();
  }
}

//  login

export interface LoginResponse {
  token: string;
  role: UserRole;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ensureUsersDbLoaded();

      const found = usersDb.find((u) => u.email === email);

      if (!found || password !== '123456') {
        const error: ApiError = {
          status: 401,
          message: 'E-posta veya şifre hatalı',
        };
        reject(error);
        return;
      }

      resolve({
        token: 'mock-jwt-token',
        role: found.role,
      });
    }, 400);
  });
}

//  listeleme

interface GetUsersParams {
  page: number;
  size: number;
  sort: SortState;
  filters: UserFilters;
}

export async function getUsers(
  params: GetUsersParams,
): Promise<PaginatedResult<User>> {
  const { page, size, sort, filters } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      ensureUsersDbLoaded();

      let result = [...usersDb];

      // isim soyad tc arama
      if (filters.search.trim()) {
        const raw = filters.search.trim();
        const search = raw.toLowerCase();

        result = result.filter((u) => {
          const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
          const email = u.email.toLowerCase();

          if (fullName.includes(search)) return true;
          if (email.includes(search)) return true;
          if (u.tckn.includes(raw)) return true;

          return false;
        });
      }

      if (filters.tcknPrefix.trim()) {
        result = result.filter((u) =>
          u.tckn.startsWith(filters.tcknPrefix.trim()),
        );
      }

      if (filters.professions.length > 0) {
        result = result.filter((u) =>
          filters.professions.includes(u.profession),
        );
      }

      if (sort.field) {
        const dir = sort.direction === 'asc' ? 1 : -1;
        result.sort((a, b) => {
          const field = sort.field!;
          const av = a[field];
          const bv = b[field];

          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return 0;
        });
      }

      const total = result.length;
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const pageData = result.slice(startIndex, endIndex);

      const response: PaginatedResult<User> = {
        data: pageData,
        page,
        size,
        total,
      };

      resolve(response);
    }, 300);
  });
}

type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export async function createUser(input: CreateUserInput): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      ensureUsersDbLoaded();

      const nextId =
        usersDb.length > 0
          ? Math.max(...usersDb.map((u) => u.id)) + 1
          : 1;

      const newUser: User = {
        id: nextId,
        createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        ...input,
      };

      usersDb = [newUser, ...usersDb];
      saveUsersToStorage(usersDb);

      resolve(newUser);
    }, 300);
  });
}
