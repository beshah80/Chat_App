'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, Code, Heart, Shield, Zap, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Instant message delivery with WebSocket technology for seamless communication.'
    },
    {
      icon: Users,
      title: 'Global Chat Room',
      description: 'Join a worldwide community where everyone can connect and share ideas.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with JWT authentication and encrypted communications.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern web technologies and efficient data handling.'
    }
  ];

  const techStack = [
    { name: 'Next.js', description: 'React framework for production' },
    { name: 'TypeScript', description: 'Type-safe JavaScript development' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Prisma', description: 'Modern database toolkit' },
    { name: 'PostgreSQL', description: 'Advanced open source database' },
    { name: 'Socket.IO', description: 'Real-time bidirectional communication' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">About ChatApp</h1>
            </div>
            <Button
              onClick={() => router.push('/chat')}
              variant="outline"
            >
              Back to Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Modern Chat Application</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            A full-stack real-time messaging platform built with modern web technologies, 
            designed for seamless communication and user experience.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Technology Stack</h3>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Built with Modern Technologies</CardTitle>
                  <CardDescription>
                    Leveraging the latest web development tools and frameworks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{tech.name}</h4>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
              <CardDescription className="text-lg max-w-3xl mx-auto">
                To create a seamless, secure, and enjoyable communication platform that brings people together 
                from around the world. We believe in the power of conversation to build connections, 
                share ideas, and foster understanding across communities.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Project Info */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Open Source</CardTitle>
                <CardDescription>
                  This project is built as a demonstration of modern full-stack web development practices. 
                  It showcases real-time communication, secure authentication, and responsive design.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Full-stack TypeScript implementation</li>
                  <li>• Real-time WebSocket communications</li>
                  <li>• PostgreSQL database with Prisma ORM</li>
                  <li>• JWT-based authentication system</li>
                  <li>• Responsive mobile-first design</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Development Details</CardTitle>
                <CardDescription>
                  Crafted with attention to detail, performance, and user experience. 
                  Every component is designed to be scalable and maintainable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Component-based architecture</li>
                  <li>• State management with Zustand</li>
                  <li>• API-first design with RESTful endpoints</li>
                  <li>• Comprehensive error handling</li>
                  <li>• Mobile-responsive interface</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">ChatApp</span>
          </div>
          <p className="text-gray-400">
            Built with ❤️ using Next.js, TypeScript, and PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
}