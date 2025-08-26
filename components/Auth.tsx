import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, MessageCircle, Loader2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useChatStore } from '../store/chatStore';

type AuthMode = 'login' | 'signup';

interface AuthProps {
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
}

export function Auth({ mode, onSwitchMode }: AuthProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useChatStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    } else if (mode === 'signup' && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const success = mode === 'login' 
      ? await login(formData.email, formData.password)
      : await signup(formData.name, formData.email, formData.password);
    setLoading(false);

    if (!success) {
      setErrors({ [mode === 'login' ? 'password' : 'email']: 
        mode === 'login' ? 'Invalid email or password' : 'Account creation failed' 
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-semibold text-foreground">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join our chat community today'
            }
          </p>
        </div>

        {/* Form */}
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`${errors.name ? 'border-destructive' : ''} pl-10`}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                className={`${errors.password ? 'border-destructive' : ''} pr-10`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={`${errors.confirmPassword ? 'border-destructive' : ''} pr-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
                I agree to the{' '}
                <button type="button" className="text-primary hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </Button>
        </motion.form>

        {/* Switch Mode */}
        <div className="text-center">
          <p className="text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {mode === 'login' && (
          <motion.div
            className="text-center p-4 bg-muted rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
            <p className="text-xs text-muted-foreground">Email: demo@example.com</p>
            <p className="text-xs text-muted-foreground">Password: demo123</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}