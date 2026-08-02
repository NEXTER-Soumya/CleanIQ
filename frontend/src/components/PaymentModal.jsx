import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PaymentModal({ onClose, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Format expiry as MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length > 0 
    && expiry.length > 0 
    && cvv.length > 0 
    && name.trim().length > 0;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      await onSuccess();
      setSuccess(true);
      // Auto-close after showing success
      setTimeout(() => {
        onClose(true);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && !success && onClose(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-2xl border overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* Success State */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-surface)] p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              >
                <CheckCircle2 size={72} className="text-green-500 mb-6" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold font-heading mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Welcome to Pro! 🎉
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Unlimited cleaning + AI insights unlocked
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>Payment Details</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>CleanIQ Pro — $9.00/month</p>
            </div>
          </div>
          <button
            onClick={() => !loading && onClose(false)}
            className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="p-6 space-y-5">
          {/* Demo Mode Notice */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--color-accent, #F59E0B)20', border: '1px solid var(--color-accent, #F59E0B)40' }}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>
              <strong>Demo Mode</strong> — No real payment is processed. This is a simulated flow for demonstration purposes.
            </span>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500 font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Card Number</label>
            <div className="relative">
              <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>
          </div>

          {/* Name on Card */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Name on Card</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-primary)',
              }}
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent)',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Lock size={16} /> Pay $9.00
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <Lock size={12} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Secured with 256-bit SSL encryption (simulated)
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
