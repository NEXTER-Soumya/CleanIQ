import { motion } from 'framer-motion';
import { Globe, Mail, Phone, MapPin, GraduationCap, Code, Sparkles, Award, User, ChevronRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function AboutDeveloperPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background relative overflow-hidden py-16 lg:py-24">
      <DocumentTitle title="About the Developer - CleanIQ" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="bg-surface rounded-2xl border border-divider shadow-sm p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Document Header */}
          <motion.div variants={itemVariants} className="border-b border-divider pb-8 mb-8">
            <div className="flex items-center gap-2 text-brand text-sm font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={16} />
              <span>CleanIQ Creator Documentation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-primary tracking-tight">
              Soumya Biswas
            </h1>
            
            <p className="text-xl text-secondary flex items-center gap-2 font-medium">
              <Code size={20} className="text-accent" /> Computer Science Engineer
            </p>
          </motion.div>

          {/* Links Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <User size={18} className="text-secondary" /> Profiles & Repositories
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://github.com/NEXTER-Soumya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-background hover:bg-surface-elevated border border-divider hover:border-brand/50 px-4 py-2.5 rounded-lg transition-colors text-primary text-sm font-medium">
                <GithubIcon size={18} className="text-secondary" /> GitHub <ChevronRight size={14} className="ml-auto text-tertiary" />
              </a>
              <a href="https://www.linkedin.com/in/soumyabiswas2003/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-background hover:bg-surface-elevated border border-divider hover:border-[#0077b5]/50 px-4 py-2.5 rounded-lg transition-colors text-primary text-sm font-medium">
                <LinkedinIcon size={18} className="text-[#0077b5]" /> LinkedIn <ChevronRight size={14} className="ml-auto text-tertiary" />
              </a>
              <a href="https://biswasoumya.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-background hover:bg-surface-elevated border border-divider hover:border-accent/50 px-4 py-2.5 rounded-lg transition-colors text-primary text-sm font-medium">
                <Globe size={18} className="text-accent" /> Portfolio <ChevronRight size={14} className="ml-auto text-tertiary" />
              </a>
            </div>
          </motion.div>

          {/* Education Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-xl font-bold font-heading text-primary border-b border-divider pb-2 mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-brand" /> Education Background
            </h2>
            
            <div className="space-y-8 pl-2">
              
              {/* Degree 1 */}
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] before:w-px before:bg-divider last:before:hidden">
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-brand ring-4 ring-surface" />
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-primary">B.Tech in Computer Science & Engineering</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand/10 text-brand text-xs font-bold">2024 - 2027</span>
                </div>
                <p className="text-sm text-secondary mb-2">Gargi Memorial Institute of Technology, MAKAUT</p>
                <div className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                  <Award size={14} /> CGPA: 8.46
                </div>
              </div>

              {/* Degree 2 */}
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] before:w-px before:bg-divider last:before:hidden">
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-secondary ring-4 ring-surface" />
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-primary">Diploma in Computer Science & Technology</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary/10 text-secondary text-xs font-bold">2021 - 2024</span>
                </div>
                <p className="text-sm text-secondary mb-2">Uluberia Government Polytechnic</p>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <Award size={14} /> CGPA: 7.7
                  </div>
                  <span className="text-sm text-tertiary">Percentage: 75.8% (Distinction)</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold font-heading text-primary border-b border-divider pb-2 mb-6 flex items-center gap-2">
              <Mail size={20} className="text-accent" /> Contact Information
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 bg-background rounded-xl p-6 border border-divider">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:+919163356190" className="text-sm font-medium text-primary hover:text-brand transition-colors">+91 91633 56190</a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:soumyabratabiswas2003@gmail.com" className="text-sm font-medium text-primary hover:text-accent transition-colors">soumyabratabiswas2003@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin size={18} className="text-secondary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-medium text-primary">Budge Budge, South 24 Parganas, 743318 WB, India</p>
                </div>
              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </PageWrapper>
  );
}
