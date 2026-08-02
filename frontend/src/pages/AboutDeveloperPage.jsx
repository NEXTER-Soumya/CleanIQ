import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, Mail, Phone, MapPin, GraduationCap, Code } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';

export default function AboutDeveloperPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-surface py-20 lg:py-32">
      <DocumentTitle title="About the Developer - CleanIQ" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-surface-elevated rounded-3xl border border-divider shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-brand to-accent p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <motion.img 
                src="/soumya-profile.jpg" 
                alt="Soumya Biswas" 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              />
              <div className="text-center md:text-left">
                <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold font-heading mb-2">
                  Soumya Biswas
                </motion.h1>
                <motion.p variants={itemVariants} className="text-xl text-white/90 mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Code size={20} /> Full-Stack Developer
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a href="https://github.com/NEXTER-Soumya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-colors text-sm font-medium">
                    <Github size={18} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/soumyabiswas2003/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-colors text-sm font-medium">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                  <a href="https://biswasoumya.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-colors text-sm font-medium">
                    <Globe size={18} /> Portfolio
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Education */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-primary font-heading mb-6 flex items-center gap-2">
                <GraduationCap className="text-brand" /> Education
              </h2>
              
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-brand/30">
                  <div className="absolute w-3 h-3 bg-brand rounded-full -left-[7px] top-1.5" />
                  <h3 className="text-lg font-bold text-primary">Bachelor of Technology in Computer Science & Engineering</h3>
                  <p className="text-secondary mt-1">Gargi Memorial Institute of Technology, MAKAUT</p>
                  <p className="text-tertiary text-sm mt-1">2024 - 2027</p>
                  <p className="text-brand font-medium mt-2">CGPA: 8.46</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-brand/30">
                  <div className="absolute w-3 h-3 bg-brand rounded-full -left-[7px] top-1.5" />
                  <h3 className="text-lg font-bold text-primary">Diploma in Computer Science & Technology</h3>
                  <p className="text-secondary mt-1">Uluberia Government Polytechnic</p>
                  <p className="text-tertiary text-sm mt-1">2021 - 2024</p>
                  <p className="text-brand font-medium mt-2">CGPA: 7.7 | Percentage: 75.8% (Distinction)</p>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-primary font-heading mb-6 flex items-center gap-2">
                <Mail className="text-brand" /> Contact Info
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-tertiary uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+919163356190" className="text-lg text-primary hover:text-brand transition-colors">+91 91633 56190</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-tertiary uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:soumyabratabiswas2003@gmail.com" className="text-lg text-primary hover:text-brand transition-colors">soumyabratabiswas2003@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-tertiary uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg text-primary">Budge Budge, South 24 Parganas,<br/>743318 WB, India</p>
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
