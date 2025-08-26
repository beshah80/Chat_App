'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm, type AuthFormData } from '../../../components/auth/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
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
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    router.push('/login');
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
      onModeSwitch={handleModeSwitch}
    />
  );
}