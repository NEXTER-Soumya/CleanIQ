import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';

export default function UpgradePrompt({ onDismiss }) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onDismiss();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div
          className="p-8 text-white text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))' }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
            <Sparkles size={120} />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur mb-6">
            <Sparkles size={32} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">You've used all 5 free cleanings! 🎉</h2>
          <p className="opacity-80 relative z-10">Upgrade to CleanIQ Pro for unlimited dataset cleaning + AI insights</p>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            {[
              'Unlimited datasets up to 10GB',
              'Advanced AI inference for misprints',
              'Export to PostgreSQL & Snowflake',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-full">
                  <Check size={16} />
                </div>
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full py-4 text-white font-semibold rounded-xl transition-all text-lg hover:brightness-110"
            style={{
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent)',
            }}
          >
            Upgrade to Pro — $9/mo
          </button>
          
          <button
            onClick={onDismiss}
            className="w-full mt-4 py-2 transition-colors text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
