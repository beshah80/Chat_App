'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
  isOnline: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Generate unique session ID for this browser session
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  };

  // Get auth token from localStorage with session tracking
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  };

  // Set auth token in localStorage
  const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-session', getSessionId());
    }
  };

  // Clear auth token from localStorage
  const clearToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-session');
      sessionStorage.removeItem('session-id');
    }
  };

  // Make authenticated API request with better error handling
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const sessionId = getSessionId();
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(sessionId && { 'X-Session-ID': sessionId }),
        ...options.headers,
      },
    });
  };

  // Update user's online status
  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      const token = getToken();
      if (!token) return;

      await fetch('/api/auth/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isOnline }),
      });
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  };

  // Check authentication status with improved handling
  const checkAuth = async (): Promise<void> => {
    try {
      const token = getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await makeAuthenticatedRequest('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          // Update online status when auth is checked
          updateOnlineStatus(true);
        } else {
          clearToken();
          setUser(null);
        }
      } else {
        // If token is invalid or expired, clear it
        clearToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't clear token on network errors, only on auth failures
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - keep trying
        console.warn('Network error during auth check, will retry');
      } else {
        clearToken();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login function with better session handling
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const sessionId = getSessionId();
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with session handling
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const sessionId = getSessionId();
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function with proper cleanup
  const logout = async (): Promise<void> => {
    try {
      // Update online status before logout
      await updateOnlineStatus(false);
      
      // Call logout endpoint to update user status
      await makeAuthenticatedRequest('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state and token
      clearToken();
      setUser(null);
    }
  };

  // Update user data with optimistic updates
  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Handle page visibility changes for better online status
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isAuthenticated && !document.hidden) {
        updateOnlineStatus(true);
      } else if (isAuthenticated && document.hidden) {
        // Don't immediately go offline when hidden, use a delay
        setTimeout(() => {
          if (document.hidden) {
            updateOnlineStatus(false);
          }
        }, 5000); // 5 second delay
      }
    };

    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        // Send beacon to update status on page unload
        navigator.sendBeacon('/api/auth/status', JSON.stringify({ isOnline: false }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-refresh auth periodically with exponential backoff
  useEffect(() => {
    if (isAuthenticated) {
      let refreshInterval = 5 * 60 * 1000; // Start with 5 minutes
      let retryCount = 0;

      const scheduleRefresh = () => {
        return setTimeout(async () => {
          try {
            await checkAuth();
            retryCount = 0; // Reset on success
            refreshInterval = 5 * 60 * 1000; // Reset to 5 minutes
          } catch (error) {
            retryCount++;
            refreshInterval = Math.min(refreshInterval * 2, 30 * 60 * 1000); // Max 30 minutes
            console.warn(`Auth refresh failed (attempt ${retryCount}), retrying in ${refreshInterval / 1000}s`);
          }
          
          if (isAuthenticated) {
            interval = scheduleRefresh();
          }
        }, refreshInterval);
      };

      let interval = scheduleRefresh();

      return () => clearTimeout(interval);
    }
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;