import { motion } from 'framer-motion';
import { Layers, Server, Database as DatabaseIcon, Cpu } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function TechStackPage() {
  const technologies = [
    {
      name: 'React.js',
      role: 'Frontend Experience',
      desc: 'Building highly interactive, glassmorphic UI components with Framer Motion for buttery-smooth animations.',
      icon: <Layers size={40} className="text-cyan-600 dark:text-cyan-400" />,
      glow: 'shadow-cyan-500/30 dark:shadow-cyan-400/30',
      border: 'border-cyan-200 dark:border-cyan-400/50',
      bg: 'from-cyan-50 to-white dark:from-cyan-900/40 dark:to-slate-900'
    },
    {
      name: 'Node.js',
      role: 'Backend Engine',
      desc: 'Handling robust API requests, chunking massive CSV uploads, and orchestrating AI prompts seamlessly.',
      icon: <Server size={40} className="text-green-600 dark:text-green-500" />,
      glow: 'shadow-green-500/30 dark:shadow-green-500/30',
      border: 'border-green-200 dark:border-green-500/50',
      bg: 'from-green-50 to-white dark:from-green-900/40 dark:to-slate-900'
    },
    {
      name: 'MongoDB',
      role: 'Data Persistence',
      desc: 'Securely storing user profiles, dataset metadata, and insights in a scalable NoSQL architecture.',
      icon: <DatabaseIcon size={40} className="text-emerald-600 dark:text-emerald-400" />,
      glow: 'shadow-emerald-500/30 dark:shadow-emerald-400/30',
      border: 'border-emerald-200 dark:border-emerald-400/50',
      bg: 'from-emerald-50 to-white dark:from-emerald-900/40 dark:to-slate-900'
    },
    {
      name: 'Google Gemini',
      role: 'AI Brain',
      desc: 'Generating deep, contextual insights and beautiful charts using state-of-the-art multimodal AI.',
      icon: <Cpu size={40} className="text-purple-600 dark:text-purple-500" />,
      glow: 'shadow-purple-500/30 dark:shadow-purple-500/30',
      border: 'border-purple-200 dark:border-purple-500/50',
      bg: 'from-purple-50 to-white dark:from-purple-900/40 dark:to-slate-900'
    }
  ];

  return (
    <PageWrapper>
      <DocumentTitle title="Tech Stack - CleanIQ" />
      
      <section className="min-h-screen pt-32 pb-32 relative overflow-hidden transition-colors">
        {/* Dark Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.05] dark:opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-divider text-sm font-medium mb-8 backdrop-blur-md"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <Cpu className="text-purple-500 dark:text-purple-400" size={16} />
            <span>Enterprise-Grade Infrastructure</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500 dark:to-purple-400">Modern Tech</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-24 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            CleanIQ leverages the absolute cutting-edge in web development and artificial intelligence to deliver unparalleled performance and scale.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 perspective-1000">
            {technologies.map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 0.3 + (idx * 0.1), 
                  type: "spring", 
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -15, 
                  rotateX: 10,
                  rotateY: -5,
                  scale: 1.05 
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b ${tech.bg} border ${tech.border} shadow-2xl ${tech.glow} backdrop-blur-xl group cursor-pointer`}
              >
                {/* 3D Floating Icon Container */}
                <div 
                  className={`w-24 h-24 mb-8 rounded-2xl bg-white dark:bg-slate-900/80 border ${tech.border} flex items-center justify-center transform translate-z-10 group-hover:translate-z-30 transition-transform duration-300 shadow-xl`}
                >
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 transform group-hover:translate-z-10 transition-transform" style={{ color: 'var(--color-text-primary)' }}>{tech.name}</h3>
                <span className="text-sm font-semibold uppercase tracking-wider mb-4 inline-block transform group-hover:translate-z-10 transition-transform" style={{ color: 'var(--color-text-secondary)' }}>{tech.role}</span>
                <p className="text-sm leading-relaxed transform group-hover:translate-z-10 transition-transform" style={{ color: 'var(--color-text-tertiary)' }}>{tech.desc}</p>
                
                {/* Bottom Reflection/Glow */}
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl ${tech.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
