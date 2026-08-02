import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, ShieldAlert, Save, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile, deleteAccount } from '../api/auth';
import { switchPlan } from '../api/subscription';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function SettingsPage() {
  const { user, updateUserProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    profession: user?.profession || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateProfile(formData);
      updateUserProfile(res.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action will permanently erase all your datasets and insights.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
  ];

  return (
    <PageWrapper className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DocumentTitle title="Settings" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-heading">Account Settings</h1>
        <p className="text-secondary mt-2">Manage your profile, subscription, and account security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand/10 text-brand'
                  : 'text-secondary hover:bg-surface-elevated hover:text-primary'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-divider">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-secondary hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface border border-divider rounded-2xl p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary font-heading mb-1">Profile Details</h2>
                  <p className="text-sm text-secondary">Update your personal information and how others see you.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <label className="block text-sm font-medium text-primary">Choose an Avatar</label>
                    <div className="flex flex-wrap gap-4 items-center">
                      {[
                        'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
                        'https://api.dicebear.com/9.x/notionists/svg?seed=Aneka',
                        'https://api.dicebear.com/9.x/notionists/svg?seed=Jasper',
                        'https://api.dicebear.com/9.x/notionists/svg?seed=Lily',
                        'https://api.dicebear.com/9.x/notionists/svg?seed=Oliver'
                      ].map((url) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setFormData({ ...formData, profilePicture: url })}
                          className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                            formData.profilePicture === url 
                              ? 'border-brand ring-4 ring-brand/20 scale-110' 
                              : 'border-transparent hover:border-divider bg-surface-elevated hover:scale-105'
                          }`}
                        >
                          <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, profilePicture: '' })}
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                          !formData.profilePicture
                            ? 'border-brand ring-4 ring-brand/20 scale-110 bg-brand/10 text-brand' 
                            : 'border-transparent hover:border-divider bg-surface-elevated text-secondary hover:scale-105'
                        }`}
                        title="Use Initials"
                      >
                        {user?.username?.charAt(0)?.toUpperCase() || <User size={24} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleProfileChange}
                        placeholder="Choose a username"
                        className="w-full px-4 py-2 bg-background border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Profession</label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleProfileChange}
                        placeholder="Data Scientist, Student, etc."
                        className="w-full px-4 py-2 bg-background border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-divider">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Phone Number (Locked)</label>
                      <input
                        type="text"
                        value={user?.phoneNumber || ''}
                        disabled
                        className="w-full px-4 py-2 bg-surface-elevated border border-divider rounded-lg text-secondary cursor-not-allowed opacity-70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">Real Name (Locked)</label>
                      <input
                        type="text"
                        value={user?.realName || ''}
                        disabled
                        placeholder="Not set"
                        className="w-full px-4 py-2 bg-surface-elevated border border-divider rounded-lg text-secondary cursor-not-allowed opacity-70"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-hover transition-colors disabled:opacity-70"
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'subscription' && (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary font-heading mb-1">Subscription Plan</h2>
                  <p className="text-sm text-secondary">Manage your billing and current tier.</p>
                </div>
                
                <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated border border-divider">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                      {user?.activePlan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {user?.activePlan === 'pro' 
                        ? 'Unlimited datasets and advanced AI insights.' 
                        : 'Basic access. Upgrade to Pro for unlimited datasets.'}
                    </p>
                  </div>
                </div>

                {user?.subscriptionExpiry && new Date(user?.subscriptionExpiry) > new Date() && (
                  <div className="p-4 rounded-xl bg-surface-elevated border border-divider flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-1">Subscription Valid Until</h4>
                      <p className="text-sm text-secondary">
                        {new Date(user.subscriptionExpiry).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    
                    <button
                      onClick={async () => {
                        try {
                          const newPlan = user.activePlan === 'pro' ? 'free' : 'pro';
                          const data = await switchPlan(newPlan);
                          updateUserProfile(data.user);
                          toast.success(`Successfully switched to ${newPlan === 'pro' ? 'Pro' : 'Free'} plan.`);
                        } catch (err) {
                          toast.error('Failed to switch plan.');
                        }
                      }}
                      className="px-4 py-2 rounded-lg font-medium text-sm transition-colors border shadow-sm hover:shadow-md"
                      style={{
                        backgroundColor: user.activePlan === 'pro' ? 'transparent' : 'var(--color-brand)',
                        borderColor: user.activePlan === 'pro' ? 'var(--color-border)' : 'var(--color-brand)',
                        color: user.activePlan === 'pro' ? 'var(--color-text-primary)' : '#fff',
                      }}
                    >
                      {user.activePlan === 'pro' ? 'Downgrade to Free' : 'Switch to Pro'}
                    </button>
                  </div>
                )}

                {user?.activePlan !== 'pro' && (!user?.subscriptionExpiry || new Date(user?.subscriptionExpiry) < new Date()) && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all hover:brightness-110 shadow-lg text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))' }}
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
              </motion.div>
            )}

            {activeTab === 'danger' && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-red-500 font-heading mb-1">Danger Zone</h2>
                  <p className="text-sm text-secondary">Irreversible and destructive actions.</p>
                </div>
                
                <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                  <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-red-500/80 dark:text-red-400/80 text-sm mt-1 mb-4">
                    Once you delete your account, there is no going back. Please be certain. All your datasets, insights, and history will be permanently wiped.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-70 shadow-lg shadow-red-600/20"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 size={18} />}
                    Permanently Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
