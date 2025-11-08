
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, signIn, resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isForgotPassword) {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset instructions have been sent to your email!');
        setTimeout(() => setIsForgotPassword(false), 3000);
      }
    } else if (isSignUp) {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Success! Please check your email to verify your account before signing in.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in. Check your inbox for the confirmation link.');
        } else {
          setError(error.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-pink-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Safe Travels</h1>
          <p className="text-gray-600 mt-2">Your trusted companion for safe journeys</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back')}
            </CardTitle>
            <CardDescription>
              {isForgotPassword
                ? 'Enter your email to receive password reset instructions'
                : (isSignUp
                  ? 'Join our community of safety-conscious travelers'
                  : 'Sign in to access your safety dashboard'
                )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError('');
                          setMessage('');
                        }}
                        className="text-xs text-pink-600 hover:text-pink-800"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={isSignUp ? 8 : 6}
                  />
                  {isSignUp && (
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? 'Please wait...'
                  : (isForgotPassword
                    ? 'Send Reset Link'
                    : (isSignUp ? 'Create Account' : 'Sign In')
                  )
                }
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {isForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setMessage('');
                  }}
                  className="text-pink-600 hover:text-pink-800 text-sm"
                >
                  Back to sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setMessage('');
                  }}
                  className="text-pink-600 hover:text-pink-800 text-sm"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"
                  }
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing up, you agree to our commitment to women's safety and privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
