import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';

export default function SignInForm() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const { error } = await signIn(email, password);

    if (error) {
      setErrors({ general: error.message || 'Invalid email or password' });
      setIsLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle('Aura');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 rounded w-3/4 animate-pulse" style={{ backgroundColor: 'var(--theme-border)' }} />
        <div className="h-4 rounded w-full animate-pulse" style={{ backgroundColor: 'var(--theme-border)' }} />
        <div className="space-y-4 mt-8">
          <div className="h-11 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--theme-border)' }} />
          <div className="h-11 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--theme-border)' }} />
        </div>
        <div className="h-11 rounded-xl animate-pulse mt-6" style={{ backgroundColor: 'var(--theme-border)' }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-center mb-8">
        <h1 style={{ color: 'var(--theme-text)' }} className="font-serif text-2xl font-medium tracking-tight mb-2">
          Welcome back
        </h1>
        <p style={{ color: 'var(--theme-text-muted)' }} className="text-xs">
          Sign in to save reports and track allocations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-red-50/50 border border-red-200/60 text-xs text-red-700"
            role="alert"
            aria-live="polite"
          >
            {errors.general}
          </motion.div>
        )}

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2EBF0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50/50"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2EBF0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50/50"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--theme-text-muted)' }}
            className="text-xs font-semibold transition-colors hover:opacity-70"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#B2533E] text-white rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--theme-border)' }} />
        </div>
        <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-wider">
          <span style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text-soft)' }} className="px-4">
            or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="px-4 py-3 border rounded-xl text-xs font-semibold text-[#57534E] hover:text-[#1C1917] border-[#E7E5E4] cursor-pointer hover:bg-gray-50 transition-all"
        >
          <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="px-4 py-3 border rounded-xl text-xs font-semibold text-[#57534E] hover:text-[#1C1917] border-[#E7E5E4] cursor-pointer hover:bg-gray-50 transition-all"
        >
          <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 19c-5 1.5-5.2-5.7-3m14 6v-3.87a3.37 3.37 0 0 0-9.4-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          GitHub
        </button>
      </div>

      <p style={{ color: 'var(--theme-text-muted)' }} className="mt-6 text-center text-xs">
        Don't have an account?{' '}
        <Link
          to="/signup"
          style={{ color: 'var(--theme-brand)' }}
          className="font-semibold transition-colors hover:opacity-70"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
