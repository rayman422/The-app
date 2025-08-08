import { useState } from 'react';
import { useAuth } from './AuthWrapper';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Fish, 
  User,
  AlertCircle,
  Loader
} from 'lucide-react';

const SocialButton = ({ provider, icon, onClick, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center justify-center space-x-2 bg-white text-gray-800 border border-gray-300 rounded-xl py-3 px-4 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {icon}
    <span>Continue with {provider}</span>
  </motion.button>
);

const InputField = ({ icon, type = "text", placeholder, value, onChange, error }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-slate-800 text-white rounded-xl py-3 pl-10 pr-4 border ${
        error ? 'border-red-500' : 'border-gray-600'
      } focus:border-emerald-500 focus:outline-none transition-colors`}
    />
  </div>
);

export const LoginScreen = ({ onToggleMode, isSignUp = false }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInAsGuest,
    resetPassword,
    error,
    clearError,
    isLoading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const validateForm = () => {
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return false;
    }
    
    if (isSignUp) {
      if (!name) {
        setLocalError('Please enter your name');
        return false;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return false;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return false;
      }
    }
    
    return true;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      clearError();
      if (isSignUp) {
        await signUpWithEmail(email, password, { name });
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      // Error is handled by AuthWrapper
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      clearError();
      setLocalError('');
      
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'apple':
          await signInWithApple();
          break;
        default:
          break;
      }
    } catch {
      // Error is handled by AuthWrapper
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      clearError();
      setLocalError('');
      await resetPassword(email);
      setResetEmailSent(true);
    } catch {
      // Error is handled by AuthWrapper
    }
  };

  const displayError = error || localError;

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Fish size={48} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">
              {resetEmailSent 
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'
              }
            </p>
          </div>

          {!resetEmailSent ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <InputField
                icon={<Mail size={20} />}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={setEmail}
                error={displayError}
              />

              {displayError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{displayError}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white rounded-xl py-3 px-4 font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? <Loader className="animate-spin" size={20} /> : 'Send Reset Email'}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-emerald-600/20 border border-emerald-600/30 rounded-xl p-4 mb-6">
                <p className="text-emerald-400">
                  Password reset email sent! Check your inbox and follow the instructions.
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Fish size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Start tracking your fishing adventures'
              : 'Sign in to continue your fishing journey'
            }
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <SocialButton
            provider="Google"
            icon={<div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-500">G</div>}
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
          />
          <SocialButton
            provider="Facebook"
            icon={<div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">f</div>}
            onClick={() => handleSocialAuth('facebook')}
            disabled={isLoading}
          />
          <SocialButton
            provider="Apple"
            icon={<div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center">🍎</div>}
            onClick={() => handleSocialAuth('apple')}
            disabled={isLoading}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-4 text-gray-400">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <InputField
              icon={<User size={20} />}
              placeholder="Full name"
              value={name}
              onChange={setName}
              error={displayError}
            />
          )}

          <InputField
            icon={<Mail size={20} />}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            error={displayError}
          />

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-800 text-white rounded-xl py-3 pl-10 pr-10 border ${
                displayError ? 'border-red-500' : 'border-gray-600'
              } focus:border-emerald-500 focus:outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isSignUp && (
            <InputField
              icon={<Lock size={20} />}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={displayError}
            />
          )}

          {displayError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-red-400 text-sm"
            >
              <AlertCircle size={16} />
              <span>{displayError}</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white rounded-xl py-3 px-4 font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6 space-y-2">
          {!isSignUp && (
            <button
              onClick={() => setShowForgotPassword(true)}
              className="block text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
            >
              Forgot your password?
            </button>
          )}
          
          <button
            onClick={onToggleMode}
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>

          <button
            onClick={signInAsGuest}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 w-full text-gray-400 hover:text-gray-300 transition-colors text-sm mt-4 py-2"
          >
            <User size={16} />
            <span>Continue as Guest</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};