'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AuthForm, type AuthFormData } from './auth/AuthForm';
import { MessageCircle, Users, Shield, Zap, Globe, Heart } from 'lucide-react';

export function HomePage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleAuthSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (authMode === 'login') {
        result = await login(data.email, data.password);
      } else {
        result = await register(data.name || '', data.email, data.password);
      }

      if (result.success) {
        // Navigate to chat after successful authentication
        router.push('/chat');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setError(null);
  };

  if (showAuth) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuthSubmit}
        isLoading={isLoading}
        error={error}
        onModeSwitch={handleModeSwitch}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ChatApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Connect with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Experience seamless real-time messaging with our modern chat platform. 
              Join global conversations, create private chats, and stay connected with friends and colleagues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
              >
                Start Chatting Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleSignIn}
                className="text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ChatApp?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and designed for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Global Chat Room</CardTitle>
                <CardDescription>
                  Join a vibrant global community where everyone can connect and share ideas together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Private Messaging</CardTitle>
                <CardDescription>
                  Have one-on-one conversations with friends, colleagues, or new connections you discover.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Experience instant messaging with real-time delivery, read receipts, and online presence.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your conversations are protected with enterprise-grade security and encryption.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>User Search</CardTitle>
                <CardDescription>
                  Easily find and connect with other users by searching their name or email address.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Modern Design</CardTitle>
                <CardDescription>
                  Beautiful, responsive interface that works seamlessly across all your devices.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Start Chatting?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users already connecting on ChatApp. Create your account today and start your first conversation.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-3"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">ChatApp</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 ChatApp. Built with Next.js, TypeScript, and PostgreSQL.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}