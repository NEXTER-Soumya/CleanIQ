import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Database, Brain, FileDown, BarChart3, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { upgradeSubscription, switchPlan } from '../api/subscription';
import PaymentModal from '../components/PaymentModal';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';

const freeTierFeatures = [
  { text: '5 dataset cleanings', included: true, icon: Database },
  { text: 'Data type inference', included: true, icon: Zap },
  { text: 'Null & duplicate detection', included: true, icon: BarChart3 },
  { text: 'CSV & Excel support', included: true, icon: FileDown },
  { text: 'AI-powered insights', included: false, icon: Brain },
  { text: 'Unlimited datasets', included: false, icon: Database },
  { text: 'Priority processing', included: false, icon: Zap },
  { text: 'Export to PostgreSQL & Snowflake', included: false, icon: FileDown },
];

const proTierFeatures = [
  { text: 'Unlimited dataset cleanings', included: true, icon: Database },
  { text: 'Data type inference', included: true, icon: Zap },
  { text: 'Null & duplicate detection', included: true, icon: BarChart3 },
  { text: 'CSV & Excel support', included: true, icon: FileDown },
  { text: 'AI-powered insights dashboard', included: true, icon: Brain },
  { text: 'Datasets up to 10GB', included: true, icon: Database },
  { text: 'Priority processing', included: true, icon: Zap },
  { text: 'Export to PostgreSQL & Snowflake', included: true, icon: FileDown },
];

export default function PricingPage() {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [switching, setSwitching] = useState(false);

  const hasSubscription = user?.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date();
  const isActivePro = user?.activePlan === 'pro';
  const isActiveFree = user?.activePlan === 'free';

  const handleUpgrade = async () => {
    const data = await upgradeSubscription();
    updateUserProfile(data.user);
  };

  const handleSwitch = async (plan) => {
    setSwitching(true);
    try {
      const data = await switchPlan(plan);
      updateUserProfile(data.user);
      toast.success(`Successfully switched to ${plan === 'pro' ? 'Pro' : 'Free'} plan.`);
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to switch to ${plan} plan.`);
    } finally {
      setSwitching(false);
    }
  };

  const handlePaymentClose = (upgraded) => {
    setShowPaymentModal(false);
    if (upgraded) {
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  return (
    <PageWrapper className="relative min-h-screen overflow-hidden pb-20">
      <DocumentTitle title="Pricing" />
      
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none blur-[100px] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brand rounded-full mix-blend-multiply filter animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-20 right-20 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold font-heading mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary" style={{ backgroundImage: 'linear-gradient(to right, var(--color-text-primary), var(--color-text-tertiary))' }}>
              Pricing that scales with you
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Start for free, upgrade when you need the full power of AI-driven data cleaning.
            </p>
          </motion.div>

          {/* Demo Mode Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
              color: 'var(--color-accent)',
            }}
          >
            <AlertTriangle size={16} />
            Demo Mode — no real payment is processed
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="rounded-3xl p-8 lg:p-10 border backdrop-blur-xl transition-all duration-300 relative"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
              borderColor: isActiveFree ? 'var(--color-primary)' : 'var(--color-border)',
              boxShadow: isActiveFree ? '0 8px 32px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'var(--shadow-md)',
            }}
          >
            {isActiveFree && (
              <span className="absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                Current Plan
              </span>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold font-heading mb-2" style={{ color: 'var(--color-text-primary)' }}>Free Starter</h3>
              <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Perfect for trying things out.</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-5xl font-bold font-heading" style={{ color: 'var(--color-text-primary)' }}>$0</span>
              <span className="text-base font-medium" style={{ color: 'var(--color-text-tertiary)' }}>/forever</span>
            </div>

            <div className="space-y-4 mb-10">
              {freeTierFeatures.map((feat) => (
                <div key={feat.text} className="flex items-center gap-4">
                  {feat.included ? (
                    <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <Check size={16} />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full" style={{ color: 'var(--color-text-tertiary)' }}>
                      <X size={16} />
                    </div>
                  )}
                  <span className={`text-base ${feat.included ? 'font-medium' : ''}`} style={{ color: feat.included ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            {isActivePro ? (
              <button
                onClick={() => handleSwitch('free')}
                disabled={switching}
                className="w-full py-4 rounded-xl font-semibold text-base border-2 transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                {switching ? 'Switching...' : 'Downgrade to Free'}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 rounded-xl font-semibold text-base border-2 opacity-50 cursor-default"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                Current Plan
              </button>
            )}
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="rounded-3xl p-8 lg:p-10 border-2 relative transform md:scale-105 z-10"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-brand)',
              boxShadow: '0 20px 40px color-mix(in srgb, var(--color-brand) 20%, transparent), 0 0 0 1px var(--color-brand)',
            }}
          >
            {/* Glowing background gradient inside card */}
            <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl" style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }} />

            {!isActivePro && (
              <span className="absolute -top-3 right-8 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg animate-pulse" style={{ background: 'linear-gradient(90deg, var(--color-brand), var(--color-accent))' }}>
                Most Popular
              </span>
            )}
            
            {isActivePro && (
              <span className="absolute -top-3 right-8 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: 'linear-gradient(90deg, var(--color-brand), var(--color-accent))' }}>
                Current Plan
              </span>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold font-heading mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                CleanIQ Pro <Sparkles size={20} className="text-brand" />
              </h3>
              <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>For serious data professionals.</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-5xl font-bold font-heading" style={{ color: 'var(--color-text-primary)' }}>$9</span>
              <span className="text-base font-medium" style={{ color: 'var(--color-text-tertiary)' }}>/month</span>
            </div>

            <div className="space-y-4 mb-10">
              {proTierFeatures.map((feat) => (
                <div key={feat.text} className="flex items-center gap-4">
                  <div className="p-1 rounded-full bg-brand/20 text-brand">
                    <Check size={16} />
                  </div>
                  <span className="text-base font-medium" style={{ color: 'var(--color-text-primary)' }}>{feat.text}</span>
                </div>
              ))}
            </div>

            {isActivePro ? (
              <button
                disabled
                className="w-full py-4 rounded-xl font-semibold text-base text-white opacity-60 cursor-default"
                style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}
              >
                Currently Active
              </button>
            ) : hasSubscription ? (
              <button
                onClick={() => handleSwitch('pro')}
                disabled={switching}
                className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all hover:brightness-110 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}
              >
                {switching ? 'Switching...' : 'Switch to Pro'} <Zap size={18} />
              </button>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-4 rounded-xl font-semibold text-base text-white transition-all hover:brightness-110 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}
              >
                Upgrade to Pro <Zap size={18} />
              </button>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-32 text-center"
        >
          <h2 className="text-3xl font-bold font-heading mb-12" style={{ color: 'var(--color-text-primary)' }}>Frequently asked questions</h2>
          <div className="grid sm:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--color-text-primary)' }}>What happens to my data?</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>We process your data securely and delete the raw files from our servers within 24 hours of analysis. Your insights remain available.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--color-text-primary)' }}>Can I cancel anytime?</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Yes, absolutely. You can downgrade to the Free plan at any time from this very page with a single click.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--color-text-primary)' }}>What's the difference in AI?</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>The Free plan uses heuristics and rules to clean data. The Pro plan utilizes Google's Gemini models to deeply analyze your data and generate a visual insights dashboard.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-lg" style={{ color: 'var(--color-text-primary)' }}>Is this a real payment?</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>No, this is a demo environment! The payment gateway is mocked, so feel free to type any numbers into the credit card form to test the flow.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            onClose={handlePaymentClose}
            onSuccess={handleUpgrade}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
