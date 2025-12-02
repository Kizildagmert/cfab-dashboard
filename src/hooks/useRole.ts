import { useMemo } from 'react';

interface AuthUser {
    role: 'admin' | 'user';
}

export const useRole = () => {
  // localStorage dan kullanıcı verisini oku
  const userString = localStorage.getItem('user');
  
  const user = useMemo(() => {
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        return parsedUser as AuthUser;
      } catch {
        return null;
      }
    }
    return null;
  }, [userString]);

  return {
    userRole: user?.role || null,
    isAdmin: user?.role === 'admin',
  };
};