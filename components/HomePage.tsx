'use client';

import { Globe, Heart, MessageCircle, Shield, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm, type AuthFormData } from './auth/AuthForm';
import { Button } from './ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

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
        router.push('/chat');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-50/90 backdrop-blur-lg border-b border-blue-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold text-blue-800 tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                ChatApp
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleSignIn} 
                className="text-base font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-100/50 px-6 py-2.5 rounded-full transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(147,197,253,0.15),transparent_60%)] z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-800 mb-8 tracking-tight leading-tight">
              Connect with{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                the World
              </span>
            </h1>
            <p className="text-xl text-blue-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Dive into real-time messaging with a vibrant platform designed for global communities, private chats, and seamless connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-9 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Start Chatting
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleSignIn}
                className="text-blue-700 border-blue-300 hover:bg-blue-100/50 font-semibold px-9 py-3.5 rounded-full transition-all duration-300"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-4 tracking-tight">
              Why ChatApp?
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto leading-relaxed font-medium">
              A modern, secure platform crafted for exceptional communication experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Globe className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">Global Communities</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  Engage with a worldwide community in lively, open chat rooms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-indigo-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-7 h-7 text-indigo-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">Private Chats</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  Connect privately with friends or new contacts in secure conversations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-purple-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">Instant Messaging</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  Enjoy real-time messaging with instant delivery and notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">Secure & Private</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  Your conversations are protected with advanced encryption protocols.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-indigo-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <MessageCircle className="w-7 h-7 text-indigo-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">User Discovery</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  Easily find and connect with users by name or email address.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl bg-blue-50">
              <CardHeader className="p-6">
                <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Heart className="w-7 h-7 text-purple-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-xl font-semibold text-blue-800 mb-2">Vibrant Design</CardTitle>
                <CardDescription className="text-blue-600 leading-relaxed">
                  A stunning, responsive interface that shines on every device.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,197,253,0.2),transparent_50%)] z-0" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-8 tracking-tight">
            Ready to Join the Chat?
          </h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands of users on ChatApp. Create your account today and spark your first conversation.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-blue-50 text-blue-900 hover:bg-blue-100 font-semibold px-9 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight">ChatApp</span>
            </div>
            <p className="text-blue-200 text-sm text-center md:text-right font-medium">
              © 2025 ChatApp. Built with Next.js, TypeScript, and PostgreSQL.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}