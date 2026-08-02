import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../api/auth';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [realName, setRealName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    if (mode === 'signup' && !realName.trim()) {
      setError('Please enter your real name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await sendOtp(phoneNumber, mode);
      setDevOtp(data.devOtp);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only accept digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace: clear current and move back
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);

    // Focus the next empty box or the last one
    const nextEmpty = newOtp.findIndex(v => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    // Auto-submit if full
    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    }
  };

  const handleVerifyOtp = async (otpString) => {
    setLoading(true);
    setError(null);

    try {
      const data = await verifyOtp(phoneNumber, otpString || otp.join(''), mode === 'signup' ? realName.trim() : undefined);
      login(data.token, data.user);
      toast.success('Successfully signed in!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    setOtp(['', '', '', '', '', '']);

    try {
      const data = await sendOtp(phoneNumber, mode);
      setDevOtp(data.devOtp);
      toast.success('OTP resent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center px-4 py-12">
      <DocumentTitle title="Login" />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary)] text-white mb-4 shadow-lg shadow-[var(--color-primary)]/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold text-primary font-heading">
            {mode === 'signup' ? 'Create an Account' : 'Welcome back'}
          </h1>
          <p className="text-secondary mt-2">
            {mode === 'signup' ? 'Sign up with your phone number to get started' : 'Sign in with your phone number'}
          </p>
        </div>

        {/* Dev OTP Banner */}
        <AnimatePresence>
          {devOtp && step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl px-4 py-3 text-center"
            >
              <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                🧪 Demo mode — your OTP is: <span className="font-mono font-bold text-lg tracking-wider">{devOtp}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-center"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-surface-md border border-divider p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Phone Number */}
            {step === 'phone' && (
              <motion.form
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSendOtp}
              >
                <label className="block text-sm font-semibold text-primary mb-2">
                  Phone Number
                </label>
                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value); setError(null); }}
                    placeholder="+1 (555) 000-0000"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-elevated border border-divider rounded-xl text-primary placeholder-tertiary text-lg font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  />
                </div>

                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    >
                      <label className="block text-sm font-semibold text-primary mb-2 mt-4">
                        Real Name
                      </label>
                      <div className="relative mb-6">
                        <input
                          type="text"
                          value={realName}
                          onChange={(e) => { setRealName(e.target.value); setError(null); }}
                          placeholder="John Doe"
                          className="w-full px-4 py-3.5 bg-surface-elevated border border-divider rounded-xl text-primary placeholder-tertiary text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.replace(/\D/g, '').length < 10}
                  className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <>{mode === 'signup' ? 'Send OTP' : 'Send OTP'} <ArrowRight size={20} /></>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-secondary text-sm">
                    {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                      className="text-brand font-semibold hover:underline"
                    >
                      {mode === 'signup' ? 'Log in' : 'Sign up'}
                    </button>
                  </p>
                </div>
              </motion.form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(null); setDevOtp(null); }}
                  className="flex items-center gap-1 text-secondary hover:text-primary text-sm font-medium mb-6 transition-colors"
                >
                  <ArrowLeft size={16} /> Change number
                </button>

                <p className="text-sm text-secondary mb-1">Enter the 6-digit code sent to</p>
                <p className="font-mono text-lg font-semibold text-primary mb-6">{phoneNumber}</p>

                {/* OTP Input Boxes */}
                <div className="flex gap-3 mb-6 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      autoFocus={index === 0}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-surface-elevated border-2 border-divider rounded-xl text-primary focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all caret-transparent"
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={loading || otp.join('').length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <>Verify & Sign In <ShieldCheck size={20} /></>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm text-secondary hover:text-brand font-medium transition-colors disabled:opacity-50"
                  >
                    Didn't receive it? Resend OTP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-tertiary mt-6">
          By continuing, you agree to CleanIQ's Terms of Service and Privacy Policy.
        </p>
      </div>
    </PageWrapper>
  );
}
