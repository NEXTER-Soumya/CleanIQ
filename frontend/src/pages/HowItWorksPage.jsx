import { motion } from 'framer-motion';
import { Database, Sparkles, BarChart3, ArrowDown } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function HowItWorksPage() {
  const steps = [
    { 
      icon: <Database size={48} className="text-white drop-shadow-md" />, 
      title: '1. Connect & Upload Data', 
      desc: 'Securely upload your messy CSV or Excel files. We instantly parse millions of rows without breaking a sweat.',
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    { 
      icon: <Sparkles size={48} className="text-white drop-shadow-md" />, 
      title: '2. AI Auto-Cleaning', 
      desc: 'Our proprietary Gemini-powered engine automatically detects duplicates, infers data types, and handles null values flawlessly.',
      color: 'from-brand to-emerald-500',
      shadow: 'shadow-brand/20'
    },
    { 
      icon: <BarChart3 size={48} className="text-white drop-shadow-md" />, 
      title: '3. Instant Insights & Export', 
      desc: 'Click a button to generate beautiful charts, or export your pristine dataset back to CSV ready for your models.',
      color: 'from-accent to-orange-500',
      shadow: 'shadow-accent/20'
    }
  ];

  return (
    <PageWrapper>
      <DocumentTitle title="How it Works - CleanIQ" />
      
      <section className="min-h-screen pt-32 pb-32 bg-surface overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center p-3 bg-brand/10 text-brand rounded-2xl mb-6"
            >
              <Sparkles size={32} />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold font-heading mb-6 text-primary tracking-tight"
            >
              The Magic Behind CleanIQ
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-secondary text-xl max-w-2xl mx-auto"
            >
              We've abstracted away the complexity of data engineering into three beautiful, seamless steps.
            </motion.p>
          </div>
          
          <div className="relative">
            {/* Vertical Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand via-accent to-transparent -translate-x-1/2 hidden md:block opacity-20" />

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 relative ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Connector Dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface border-4 border-brand hidden md:block z-20 shadow-[0_0_15px_rgba(13,148,136,0.5)]" />

                {/* 3D Floating Icon Card */}
                <div className="flex-1 flex justify-center w-full md:w-auto perspective-1000">
                  <motion.div
                    whileHover={{ 
                      rotateX: 10, 
                      rotateY: idx % 2 === 1 ? -10 : 10,
                      scale: 1.05,
                      translateZ: 20
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className={`relative w-48 h-48 md:w-64 md:h-64 rounded-[2rem] bg-gradient-to-br ${step.color} shadow-2xl ${step.shadow} flex items-center justify-center p-1 group cursor-pointer`}
                  >
                    {/* Inner glowing element for 3D depth */}
                    <div className="absolute inset-2 rounded-[1.5rem] bg-white/10 backdrop-blur-sm border border-white/30 transform translate-z-10 group-hover:translate-z-20 transition-transform duration-300" />
                    
                    {/* Icon floating highest */}
                    <div className="relative z-20 transform translate-z-20 group-hover:translate-z-40 transition-transform duration-300">
                      {step.icon}
                    </div>

                    {/* Floor Shadow */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-full transform rotate-x-60" />
                  </motion.div>
                </div>

                {/* Content Box */}
                <div className={`flex-1 text-center ${idx % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-surface-elevated p-8 rounded-3xl border border-divider shadow-surface-sm hover:shadow-surface-md transition-shadow relative z-10 overflow-hidden">
                    <div className={`absolute top-0 ${idx % 2 === 1 ? 'right-0' : 'left-0'} w-2 h-full bg-gradient-to-b ${step.color}`} />
                    <h3 className="text-2xl font-bold font-heading mb-4 text-primary">{step.title}</h3>
                    <p className="text-secondary text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
