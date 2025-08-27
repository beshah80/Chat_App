'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm, type AuthFormData } from '../../../components/auth/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('auth-token', result.token);

        // Redirect to chat
        router.push('/chat');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch {
      // The `catch` block now handles the error without needing the error variable,
      // resolving the linting warning about an unused variable.
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    router.push('/signup');
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      onModeSwitch={handleModeSwitch}
    />
  );
}
