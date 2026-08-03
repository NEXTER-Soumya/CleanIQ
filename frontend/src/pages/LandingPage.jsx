import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Database, BarChart3, Users, Zap, Shield, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/index';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-divider py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-primary">{question}</span>
        <ChevronDown
          className={`text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-secondary leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  const { user } = useAuth();
  const [dynamicStats, setDynamicStats] = useState({
    users: 0,
    datasets: 0,
    hoursSaved: 0,
    dataPoints: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.data.success) {
          setDynamicStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch landing stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
    return num.toString();
  };

  const stats = [
    { label: 'Active Users', value: formatNumber(dynamicStats.users) },
    { label: 'Datasets Cleaned', value: formatNumber(dynamicStats.datasets) },
    { label: 'Hours Saved', value: formatNumber(dynamicStats.hoursSaved) },
    { label: 'Data Points Processed', value: formatNumber(dynamicStats.dataPoints) }
  ];

  const useCases = [
    {
      title: 'Data Analysts',
      desc: 'Stop writing repetitive Pandas scripts. Clean and format datasets in seconds so you can focus on building models.',
      icon: <Database size={24} />,
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30'
    },
    {
      title: 'Marketing Teams',
      desc: 'Scrub messy CRM exports, remove duplicate leads, and format campaign data without relying on IT.',
      icon: <Users size={24} />,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30'
    },
    {
      title: 'Founders & Execs',
      desc: 'Upload a raw spreadsheet and instantly get AI-generated insights and beautiful charts for your pitch deck.',
      icon: <BarChart3 size={24} />,
      color: 'from-orange-500/20 to-rose-500/20',
      border: 'border-orange-500/30'
    }
  ];

  return (
    <PageWrapper>
      <DocumentTitle title="CleanIQ - The Ultimate Data Cleaning Tool" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 perspective-1000">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0D9488]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated/50 backdrop-blur-md border border-divider text-sm font-medium mb-8 shadow-[0_0_15px_rgba(13,148,136,0.2)]"
          >
            <Sparkles className="text-brand" size={16} />
            <span className="text-primary">CleanIQ 1.0 is now live</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight text-primary leading-tight"
          >
            Transform messy data into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9488] via-[#3b82f6] to-[#F59E0B]">
              beautiful insights.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-secondary max-w-2xl mx-auto mb-10"
          >
            The fastest, AI-powered platform for teams to clean, merge, and visualize datasets without writing a single line of code.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link 
              to="/login?mode=signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl font-semibold shadow-[0_0_40px_rgba(13,148,136,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start for free <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-divider bg-surface-elevated/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-2"
              >
                <div className="text-4xl md:text-5xl font-bold text-brand font-heading">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-secondary uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section - 3D Layout */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary">Who is CleanIQ For?</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">Built for anyone who handles data, regardless of technical skill.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {useCases.map((useCase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`bg-surface p-8 rounded-3xl border ${useCase.border} shadow-xl backdrop-blur-md relative overflow-hidden group cursor-pointer`}
              >
                {/* 3D Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 transform group-hover:translate-z-20 transition-transform duration-300">
                  <div className="w-14 h-14 bg-surface-elevated text-brand rounded-2xl flex items-center justify-center mb-6 border border-divider shadow-md">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 text-primary">{useCase.title}</h3>
                  <p className="text-secondary leading-relaxed">{useCase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities (Bento Box) - 3D Layout */}
      <section className="py-24 bg-surface-elevated overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary">Core Capabilities</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">Everything you need to turn raw data into gold.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px] perspective-1000">
            {/* Box 1 (Large) */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 15 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="md:col-span-2 md:row-span-1 bg-surface p-8 rounded-3xl border border-divider shadow-lg relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 transform group-hover:translate-z-10">
                <Sparkles size={160} className="text-brand" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end transform group-hover:translate-z-30 transition-transform duration-300">
                <div className="w-12 h-12 bg-[#0D9488]/10 text-brand rounded-xl flex items-center justify-center mb-4 shadow-sm border border-brand/20">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2 text-primary">Lightning Fast AI Engine</h3>
                <p className="text-secondary max-w-md">Our Gemini-powered engine instantly recognizes data patterns, fixes mismatched types, and handles null values seamlessly.</p>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 15 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="md:col-span-1 md:row-span-1 bg-surface p-8 rounded-3xl border border-divider shadow-lg flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4 shadow-sm border border-accent/20 transform group-hover:translate-z-20 transition-transform duration-300">
                <Shield size={24} />
              </div>
              <div className="transform group-hover:translate-z-20 transition-transform duration-300">
                <h3 className="text-xl font-bold font-heading mb-2 text-primary">Bank-grade Security</h3>
                <p className="text-secondary">Your data is encrypted at rest and in transit. We never use your private data to train public models.</p>
              </div>
            </motion.div>

            {/* Box 3 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: -15 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ rotateX: -5, rotateY: -5, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="md:col-span-1 md:row-span-1 bg-surface p-8 rounded-3xl border border-divider shadow-lg flex flex-col justify-between group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-500/20 transform group-hover:translate-z-20 transition-transform duration-300">
                <Database size={24} />
              </div>
              <div className="transform group-hover:translate-z-20 transition-transform duration-300">
                <h3 className="text-xl font-bold font-heading mb-2 text-primary">Any Format</h3>
                <p className="text-secondary">Drag and drop CSV or Excel files of any size. CleanIQ handles parsing flawlessly.</p>
              </div>
            </motion.div>

            {/* Box 4 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: -15 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ rotateX: -5, rotateY: 5, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-8 rounded-3xl border border-brand/50 shadow-[0_20px_50px_rgba(13,148,136,0.3)] text-white flex flex-col justify-center group cursor-pointer overflow-hidden relative"
            >
              {/* Animated 3D background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10 transform group-hover:translate-z-30 transition-transform duration-300">
                <BarChart3 size={48} className="mb-6 opacity-90 drop-shadow-lg" />
                <h3 className="text-2xl font-bold font-heading mb-2 text-white drop-shadow-md">Instant Visualizations</h3>
                <p className="text-white/90 max-w-md drop-shadow-sm">Once your data is clean, click a single button to generate stunning, interactive charts and insights automatically.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-primary">Frequently Asked Questions</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <FaqItem 
              question="Do I need to know how to code to use CleanIQ?" 
              answer="Not at all! CleanIQ is designed with a completely visual interface. If you can use a spreadsheet, you can use CleanIQ." 
            />
            <FaqItem 
              question="What file types are supported?" 
              answer="Currently, we support .CSV and .XLSX (Excel) files. We are actively working on adding direct database connections (PostgreSQL, MySQL) in the near future." 
            />
            <FaqItem 
              question="Is my data secure?" 
              answer="Yes. We use industry-standard encryption for all data uploads. We do not sell your data or use it to train public AI models." 
            />
            <FaqItem 
              question="Can I export my cleaned data?" 
              answer="Absolutely. You can export your fully cleaned dataset back into a standard CSV file with a single click, ready to be used in any other tool." 
            />
          </div>
        </div>
      </section>

      {/* Final CTA - 3D Floating Banner */}
      <section className="py-24 perspective-1000">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand via-[#3b82f6] to-accent opacity-10 dark:opacity-20 rounded-3xl blur-2xl" />
          
          <motion.div 
            whileHover={{ rotateX: 2, rotateY: 2, scale: 1.01 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative bg-surface p-12 md:p-20 rounded-3xl border border-divider shadow-2xl text-center overflow-hidden"
          >
            <div className="transform translate-z-20">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-primary">Ready to stop wrestling with spreadsheets?</h2>
              <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">Join analysts and founders using CleanIQ to prepare their data in seconds.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/login?mode=signup"
                  className="w-full sm:w-auto px-10 py-5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold shadow-[0_10px_30px_rgba(13,148,136,0.4)] transition-transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                >
                  Create Free Account <ArrowRight size={24} />
                </Link>
              </div>
              <p className="mt-6 text-sm text-secondary">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-divider py-10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-brand text-white p-1 rounded-lg">
              <Sparkles size={16} />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-primary">CleanIQ</span>
          </div>
          <p className="text-secondary text-sm font-medium">
            Created by - <a href="https://biswasoumya.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-hover underline underline-offset-4 decoration-brand/30 hover:decoration-brand transition-colors">Soumya Biswas</a>
          </p>
        </div>
      </footer>
    </PageWrapper>
  );
}
