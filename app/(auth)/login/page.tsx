'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthForm, type AuthFormData } from '../../../components/auth/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ new success state

  const handleSignup = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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

        // ✅ Show success message in AuthForm
        setSuccessMessage(`Account created successfully! Welcome, ${result.user.name}.`);

        // Redirect after a short delay so message is visible
        setTimeout(() => {
          router.push('/chat');
        }, 1000);
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
    router.push('/login');
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleSignup}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage} // ✅ pass success message
      onModeSwitch={handleModeSwitch}
    />
  );
}
