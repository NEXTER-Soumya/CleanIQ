import { motion } from 'framer-motion';
import { Globe, Mail, Phone, MapPin, GraduationCap, Code, Sparkles, Award } from 'lucide-react';

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function AboutDeveloperPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-surface relative overflow-hidden py-24 lg:py-32">
      <DocumentTitle title="About the Developer - CleanIQ" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Card (Glassmorphism) */}
          <motion.div 
            variants={itemVariants}
            className="bg-surface-elevated/70 backdrop-blur-xl rounded-[2.5rem] border border-divider shadow-2xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-accent/10 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-brand to-accent rounded-full blur-xl opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <img 
                  src="/soumya-profile.jpg" 
                  alt="Soumya Biswas" 
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-surface shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-semibold mb-4"
                >
                  <Sparkles size={16} /> CleanIQ Creator
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4 text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Soumya Biswas
                </h1>
                <p className="text-xl md:text-2xl text-secondary mb-8 flex items-center justify-center md:justify-start gap-3 font-medium">
                  <Code size={24} className="text-accent" /> Computer Science Engineer
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a href="https://github.com/NEXTER-Soumya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-surface hover:bg-surface-elevated border border-divider hover:border-brand/50 px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-primary font-medium hover:-translate-y-1">
                    <GithubIcon size={20} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/soumyabiswas2003/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/30 px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-[#0077b5] font-medium hover:-translate-y-1">
                    <LinkedinIcon size={20} /> LinkedIn
                  </a>
                  <a href="https://biswasoumya.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-accent font-medium hover:-translate-y-1">
                    <Globe size={20} /> Portfolio
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education Card */}
            <motion.div variants={itemVariants} className="bg-surface-elevated rounded-[2rem] border border-divider shadow-lg p-8 md:p-10 hover:border-brand/30 transition-colors">
              <h2 className="text-2xl font-bold text-primary font-heading mb-8 flex items-center gap-3">
                <div className="p-2.5 bg-brand/10 text-brand rounded-xl"><GraduationCap size={24} /></div>
                Education Background
              </h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand/50 before:to-transparent">
                
                {/* Degree 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-surface bg-brand text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-surface border border-divider shadow-sm group-hover:border-brand/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand uppercase tracking-wider">2024 - 2027</span>
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-1 leading-tight">B.Tech in Computer Science & Engineering</h3>
                    <p className="text-sm text-secondary mb-3">Gargi Memorial Institute of Technology, MAKAUT</p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold">
                      <Award size={14} /> CGPA: 8.46
                    </div>
                  </div>
                </div>

                {/* Degree 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-surface bg-secondary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-surface border border-divider shadow-sm group-hover:border-secondary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">2021 - 2024</span>
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-1 leading-tight">Diploma in Computer Science & Technology</h3>
                    <p className="text-sm text-secondary mb-3">Uluberia Government Polytechnic</p>
                    <div className="flex flex-col gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold w-fit">
                        <Award size={14} /> CGPA: 7.7
                      </div>
                      <span className="text-xs font-medium text-tertiary">Percentage: 75.8% (Distinction)</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div variants={itemVariants} className="bg-surface-elevated rounded-[2rem] border border-divider shadow-lg p-8 md:p-10 hover:border-accent/30 transition-colors flex flex-col">
              <h2 className="text-2xl font-bold text-primary font-heading mb-8 flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 text-accent rounded-xl"><Mail size={24} /></div>
                Get In Touch
              </h2>
              
              <div className="flex-1 flex flex-col justify-center gap-8">
                <a href="tel:+919163356190" className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-colors border border-transparent hover:border-divider">
                  <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-xl font-medium text-primary group-hover:text-brand transition-colors">+91 91633 56190</p>
                  </div>
                </a>
                
                <a href="mailto:soumyabratabiswas2003@gmail.com" className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-colors border border-transparent hover:border-divider">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg sm:text-xl font-medium text-primary group-hover:text-accent transition-colors break-all">soumyabratabiswas2003@gmail.com</p>
                  </div>
                </a>

                <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-colors border border-transparent hover:border-divider">
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium text-primary">Budge Budge, South 24 Parganas,<br/>743318 WB, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
