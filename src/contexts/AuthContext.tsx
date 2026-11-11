import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Read the stored session synchronously so protected routes don't redirect
  // to /login on the first render after a page reload.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? (JSON.parse(storedUser) as User) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Query Supabase for user with matching email and password
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .limit(1);

      if (error) {
        console.error('Supabase query error:', error);
        return false;
      }

      if (!users || users.length === 0) {
        console.error('Invalid email or password');
        return false;
      }

      const foundUser = users[0];

      // Create user object without password
      const userToStore: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as 'admin' | 'user',
        password: '' // Don't store password
      };

      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
