'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthData {
  username: string | null;  // email
  name: string | null;
  user_id: string | null;   // VD: DEMO_ADMIN
  user_group: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthData {
  setAuthData: (data: Partial<AuthData>) => void;
  logout: () => Promise<void>;
}

const defaultAuthData: AuthData = {
  username: null,
  name: null,
  user_id: null,
  user_group: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData>(defaultAuthData);

  // Hàm lấy thông tin user từ bảng public.users
  const fetchUserProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, name, user_group, user_status')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // Không tìm thấy profile → logout
      await supabase.auth.signOut();
      setAuth({ ...defaultAuthData, isLoading: false });
      return;
    }

    if (data.user_status !== 'active') {
      await supabase.auth.signOut();
      setAuth({ ...defaultAuthData, isLoading: false });
      return;
    }

    setAuth({
      username: email,
      name: data.name,
      user_id: data.user_id,
      user_group: data.user_group,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  useEffect(() => {
    // Kiểm tra session hiện tại khi app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email ?? '');
      } else {
        setAuth({ ...defaultAuthData, isLoading: false });
      }
    });

    // Lắng nghe thay đổi auth state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email ?? '');
        } else {
          setAuth({ ...defaultAuthData, isLoading: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setAuthData = (data: Partial<AuthData>) => {
    setAuth(prev => ({ ...prev, ...data }));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({ ...defaultAuthData, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { supabase };
