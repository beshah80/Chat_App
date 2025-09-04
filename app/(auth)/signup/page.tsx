'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm, type AuthFormData } from '../../../components/auth/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ success state

  const handleSignup = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null); // clear previous messages

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
        // Store token
        localStorage.setItem('auth-token', result.token);

        // Show success message
        setSuccessMessage(`Account created successfully! Welcome, ${result.user.name}.`);

        // Delay redirect to show message
        setTimeout(() => {
          router.push('/chat');
        }, 1000); // 1 second delay
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    // Clear messages when switching modes
    setError(null);
    setSuccessMessage(null);
    router.push('/login');
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage} // ✅ pass to AuthForm
      onModeSwitch={handleModeSwitch}
    />
  );
}
