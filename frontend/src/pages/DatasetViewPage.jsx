import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Table2, Brain, Download, FileSpreadsheet } from 'lucide-react';
import { getDatasetData, downloadDataset } from '../api/datasets';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';

export default function DatasetViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDatasetData(id);
        setData(result.data);
        setStats(result.stats);
      } catch (error) {
        toast.error('Failed to load dataset data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  const handleDownload = async (format) => {
    try {
      setDownloading(true);
      await downloadDataset(id, format);
      toast.success(`Dataset exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error('Failed to download dataset.');
    } finally {
      setDownloading(false);
    }
  };

  const handleInsightsClick = () => {
    if (user?.activePlan !== 'pro') {
      setShowUpgradeModal(true);
    } else {
      navigate(`/datasets/${id}/insights`);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </PageWrapper>
    );
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <PageWrapper className="h-[calc(100vh-73px)] flex flex-col">
      <DocumentTitle title="Dataset View" />
      
      <div className="flex-none px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-divider bg-background">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-surface rounded-lg transition-colors text-secondary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary font-heading flex items-center gap-2">
              <Table2 className="text-brand" size={24} />
              Dataset View
            </h1>
            <p className="text-sm text-secondary">Showing up to 500 rows for preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/upload?datasetId=${id}`)}
            className="flex items-center gap-2 bg-surface hover:bg-surface-elevated text-secondary border border-divider px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Table2 size={18} />
            Edit Rules
          </button>
          
          <button
            onClick={() => handleDownload('csv')}
            disabled={downloading}
            className="flex items-center gap-2 bg-surface hover:bg-surface-elevated text-secondary border border-divider px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <Download size={18} />
            CSV
          </button>
          <button
            onClick={() => handleDownload('xlsx')}
            disabled={downloading}
            className="flex items-center gap-2 bg-surface hover:bg-surface-elevated text-secondary border border-divider px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>
          <div className="w-px h-8 bg-divider mx-1"></div>
          <button
            onClick={handleInsightsClick}
            className="flex items-center gap-2 bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Brain size={18} />
            AI Insights
          </button>
        </div>
      </div>

      {stats && (
        <div className="bg-surface px-4 sm:px-6 lg:px-8 py-4 border-b border-divider flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">Rows</span>
            <span className="text-lg font-bold text-primary">{stats.totalRows.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-divider"></div>
          <div className="flex flex-col">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">Columns</span>
            <span className="text-lg font-bold text-primary">{stats.totalColumns.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-divider"></div>
          <div className="flex flex-col">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">Null Values</span>
            <span className="text-lg font-bold text-amber-500">{stats.totalNulls.toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-divider"></div>
          <div className="flex flex-col">
            <span className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">Duplicates</span>
            <span className="text-lg font-bold text-rose-500">{stats.totalDuplicates.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-surface p-4 sm:p-6 lg:p-8">
        {data.length === 0 ? (
          <div className="text-center py-20 text-secondary">No data available.</div>
        ) : (
          <div className="border border-divider rounded-xl overflow-hidden bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary uppercase bg-surface-elevated border-b border-divider">
                  <tr>
                    <th className="px-4 py-3 font-medium text-center w-12 border-r border-divider">#</th>
                    {headers.map(header => (
                      <th key={header} className="px-6 py-3 font-medium tracking-wider whitespace-nowrap border-r border-divider last:border-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-secondary text-center border-r border-divider bg-surface/30">
                        {idx + 1}
                      </td>
                      {headers.map(header => (
                        <td key={header} className="px-6 py-3 whitespace-nowrap text-primary border-r border-divider last:border-0">
                          {row[header] !== null && row[header] !== undefined ? String(row[header]) : <span className="text-secondary italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-divider shadow-2xl rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-accent" />
              
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Brain size={32} />
              </div>
              
              <h2 className="text-2xl font-bold font-heading text-primary text-center mb-4">Unlock AI Insights</h2>
              <p className="text-secondary text-center mb-8">
                Generating automated charts and intelligent data summaries requires the computational power of the Pro plan. 
                Upgrade now to unlock AI Insights and much more!
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  View Pricing
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 bg-surface-elevated hover:bg-divider text-primary rounded-xl font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
}
