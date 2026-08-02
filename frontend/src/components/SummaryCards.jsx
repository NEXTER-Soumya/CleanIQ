import { motion } from 'framer-motion';
import { Rows3, Columns3, AlertTriangle, Copy } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SummaryCards({ report }) {
  if (!report) return null;

  const cards = [
    {
      title: 'Total Rows',
      value: report.totalRows,
      icon: Rows3,
      color: 'text-brand',
      bg: 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]'
    },
    {
      title: 'Total Columns',
      value: report.totalColumns,
      icon: Columns3,
      color: 'text-brand',
      bg: 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]'
    },
    {
      title: 'Total Nulls',
      value: report.totalNulls,
      icon: AlertTriangle,
      color: report.totalNulls > 0 ? 'text-amber-500' : 'text-green-500',
      bg: report.totalNulls > 0 ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-green-50 dark:bg-green-900/30'
    },
    {
      title: 'Duplicate Rows',
      value: report.totalDuplicates,
      icon: Copy,
      color: report.totalDuplicates > 0 ? 'text-amber-500' : 'text-green-500',
      bg: report.totalDuplicates > 0 ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-green-50 dark:bg-green-900/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-surface rounded-2xl p-6 shadow-surface-sm border border-divider flex items-center gap-4 hover:shadow-surface-md transition-shadow"
        >
          <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
            <card.icon size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-bold text-primary mt-1">
              {card.value.toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
