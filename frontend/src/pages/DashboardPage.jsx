import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, FileSpreadsheet, ArrowRight, Brain, CheckCircle2, ChevronRight, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { getDatasets, deleteDataset } from '../api/datasets';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const data = await getDatasets();
        setDatasets(data);
      } catch (error) {
        toast.error('Failed to load your datasets.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, [toast]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this dataset? This cannot be undone.')) return;
    
    try {
      await deleteDataset(id);
      setDatasets(datasets.filter(d => d._id !== id));
      toast.success('Dataset deleted successfully.');
      if (selectedIds.has(id)) {
        const next = new Set(selectedIds);
        next.delete(id);
        setSelectedIds(next);
      }
    } catch (error) {
      toast.error('Failed to delete dataset.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} datasets? This cannot be undone.`)) return;
    
    setIsDeletingBulk(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteDataset(id)));
      setDatasets(datasets.filter(d => !selectedIds.has(d._id)));
      toast.success(`Successfully deleted ${selectedIds.size} datasets.`);
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    } catch (error) {
      toast.error('Some datasets failed to delete. Please refresh and try again.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleSelection = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === datasets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(datasets.map(d => d._id)));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'cleaned':
        return <CheckCircle2 size={12} />;
      case 'insights_generated':
        return <Brain size={12} />;
      default:
        return <Database size={12} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'cleaned': return 'Cleaned';
      case 'insights_generated': return 'Analyzed';
      default: return 'Not Cleaned';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'cleaned': return { bg: 'var(--color-emerald-100)', text: 'var(--color-emerald-800)', border: 'var(--color-emerald-200)' };
      case 'insights_generated': return { bg: 'var(--color-brand-100)', text: 'var(--color-brand-800)', border: 'var(--color-brand-200)' };
      default: return { bg: 'var(--color-red-100)', text: 'var(--color-red-800)', border: 'var(--color-red-200)' };
    }
  };

  const [expandedCardId, setExpandedCardId] = useState(null);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DocumentTitle title="Dashboard" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading" style={{ color: 'var(--color-text-primary)' }}>Your Datasets</h1>
          <p className="text-secondary mt-1">Manage and view insights for your uploaded files.</p>
        </div>
        <div className="flex items-center gap-3">
          {datasets.length > 0 && (
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedIds(new Set());
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium border transition-colors ${
                isSelectionMode 
                  ? 'bg-surface-elevated text-primary border-divider' 
                  : 'bg-surface text-secondary border-divider hover:bg-surface-elevated hover:text-primary'
              }`}
            >
              {isSelectionMode ? <X size={18} /> : <CheckSquare size={18} />}
              {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
            </button>
          )}
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
          >
            <Plus size={20} />
            New Dataset
          </Link>
        </div>
      </div>

      {datasets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-divider border-dashed rounded-3xl p-12 text-center shadow-surface-sm"
        >
          <div className="w-20 h-20 mx-auto bg-surface-elevated rounded-full flex items-center justify-center mb-6">
            <FileSpreadsheet className="text-secondary" size={32} />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3" style={{ color: 'var(--color-text-primary)' }}>No datasets yet</h2>
          <p className="text-secondary max-w-md mx-auto mb-8">
            Upload your first messy CSV or Excel file and let CleanIQ do the heavy lifting for you.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all"
          >
            Upload First Dataset <ArrowRight size={20} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {datasets.map((dataset, idx) => (
              <motion.div
                key={dataset._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelection(dataset._id);
                  }
                }}
                className={`group relative border rounded-2xl p-6 transition-all hover:shadow-lg flex flex-col ${
                  isSelectionMode ? 'cursor-pointer' : ''
                } ${
                  selectedIds.has(dataset._id) 
                    ? 'bg-brand/5 border-brand ring-1 ring-brand' 
                    : 'bg-surface border-[var(--color-border)]'
                }`}
              >
                {isSelectionMode && (
                  <div className="absolute top-4 right-4 z-10 pointer-events-none text-brand">
                    {selectedIds.has(dataset._id) ? (
                      <CheckSquare size={24} className="fill-brand/20" />
                    ) : (
                      <Square size={24} className="text-secondary opacity-50" />
                    )}
                  </div>
                )}
                
                <div className={`flex justify-between items-start mb-4 ${isSelectionMode ? 'pr-8' : ''}`}>
                  <div className={`p-3 rounded-xl ${selectedIds.has(dataset._id) ? 'bg-brand/20' : 'bg-brand/10'} text-brand`}>
                    <FileSpreadsheet size={24} />
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: getStatusColor(dataset.status).bg,
                      color: getStatusColor(dataset.status).text,
                      borderColor: getStatusColor(dataset.status).border
                    }}
                  >
                    {getStatusIcon(dataset.status)}
                    {getStatusLabel(dataset.status)}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-1 truncate" style={{ color: 'var(--color-text-primary)' }} title={dataset.originalFilename}>
                  {dataset.originalFilename}
                </h3>
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>{dataset.rowCount.toLocaleString()} rows</span>
                  <span>•</span>
                  <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
                </div>
                
                {!isSelectionMode && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCardId(expandedCardId === dataset._id ? null : dataset._id);
                    }}
                    className="w-full py-2 text-sm text-secondary border border-divider rounded-lg hover:bg-surface-elevated transition-colors mb-2"
                  >
                    {expandedCardId === dataset._id ? 'Hide Actions' : 'Show Actions'}
                  </button>
                )}

                <AnimatePresence>
                  {expandedCardId === dataset._id && !isSelectionMode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <Link
                          to={`/datasets/${dataset._id}/data`}
                          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-surface-elevated text-sm font-medium transition-colors hover:text-brand"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          View Dataset <ChevronRight size={16} />
                        </Link>
                        
                        {(dataset.status === 'cleaned' || dataset.status === 'insights_generated') && (
                          <Link
                            to={`/datasets/${dataset._id}/insights`}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-brand/10 text-brand text-sm font-medium transition-colors hover:bg-brand hover:text-white"
                          >
                            Insights <ChevronRight size={16} />
                          </Link>
                        )}
                        
                        <button
                          onClick={(e) => handleDelete(dataset._id, e)}
                          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors mt-2"
                        >
                          Delete Dataset <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border border-slate-700"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedIds.size}</span>
              <span className="text-slate-300">selected</span>
            </div>
            
            <div className="w-px h-6 bg-slate-600"></div>
            
            <button
              onClick={selectAll}
              className="text-sm font-medium hover:text-brand-300 transition-colors"
            >
              {selectedIds.size === datasets.length ? 'Deselect All' : 'Select All'}
            </button>
            
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0 || isDeletingBulk}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
            >
              {isDeletingBulk ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
}
