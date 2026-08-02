import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, Zap, Shield, LayoutDashboard, BrainCircuit } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function ProductPage() {
  const features = [
    {
      title: "Smart Inference",
      desc: "Our AI automatically detects dates, emails, and categorical values without manual mapping.",
      icon: <BrainCircuit size={32} className="text-brand" />,
      color: "from-brand/20 to-teal-500/20",
      border: "border-brand/40"
    },
    {
      title: "Null Imputation",
      desc: "Intelligently fill missing values using advanced statistical means or predictive modeling.",
      icon: <Zap size={32} className="text-accent" />,
      color: "from-accent/20 to-orange-500/20",
      border: "border-accent/40"
    },
    {
      title: "Bank-Grade Security",
      desc: "Enterprise-level encryption ensures your data remains completely private and secure.",
      icon: <Shield size={32} className="text-blue-500" />,
      color: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/40"
    },
    {
      title: "Beautiful Dashboards",
      desc: "Instantly generate interactive charts and graphs from your cleaned datasets.",
      icon: <LayoutDashboard size={32} className="text-purple-500" />,
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/40"
    }
  ];

  return (
    <PageWrapper>
      <DocumentTitle title="Product - CleanIQ" />
      
      <section className="relative overflow-hidden pt-32 pb-32 min-h-screen bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent dark:from-brand/10" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-divider text-sm font-medium mb-8 shadow-sm"
            >
              <Sparkles className="text-brand" size={16} />
              <span className="text-primary">Meet CleanIQ 1.0</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold font-heading mb-6 text-primary tracking-tight"
            >
              The Modern Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">
                Command Center
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-secondary max-w-2xl mx-auto mb-10"
            >
              Everything you need to ingest, clean, and visualize your data in one incredibly fast, intuitive platform.
            </motion.p>
          </div>

          {/* 3D Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 perspective-1000">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1), type: 'spring', stiffness: 100 }}
                whileHover={{ 
                  y: -10, 
                  rotateX: idx % 2 === 0 ? 5 : -5,
                  rotateY: idx % 2 === 0 ? -5 : 5, 
                  scale: 1.02 
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative bg-surface p-10 rounded-3xl border ${feature.border} shadow-xl backdrop-blur-md group cursor-pointer overflow-hidden`}
              >
                {/* 3D Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 transform group-hover:translate-z-30 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-divider shadow-md flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4 text-primary">{feature.title}</h3>
                  <p className="text-secondary text-lg leading-relaxed">{feature.desc}</p>
                </div>
                
                {/* 3D Drop shadow effect */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-4 rounded-full blur-xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 text-center perspective-1000"
          >
            <motion.div 
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="inline-block"
            >
              <Link 
                to="/login?mode=signup"
                className="px-10 py-5 bg-brand hover:bg-brand-hover text-white rounded-2xl font-bold shadow-[0_15px_40px_rgba(13,148,136,0.4)] transition-all flex items-center justify-center gap-3 text-lg transform translate-z-20"
              >
                Start Cleaning Now <ArrowRight size={24} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
