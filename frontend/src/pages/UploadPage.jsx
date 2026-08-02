import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileSpreadsheet, RotateCcw } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import SummaryCards from '../components/SummaryCards';
import ColumnTable from '../components/ColumnTable';
import { SkeletonCards, SkeletonTable } from '../components/SkeletonLoader';
import UpgradePrompt from '../components/UpgradePrompt';
import { uploadDataset, cleanDataset } from '../api/datasets';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';
import { getDatasetReport } from '../api/datasets';

export default function UploadPage() {
  const [state, setState] = useState('idle');
  const [report, setReport] = useState(null);
  const [updatingColumns, setUpdatingColumns] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editDatasetId = params.get('datasetId');
    if (editDatasetId) {
      loadExistingDataset(editDatasetId);
    }
  }, [location.search]);

  const loadExistingDataset = async (id) => {
    try {
      setState('analyzing');
      const data = await getDatasetReport(id);
      
      setReport({
        datasetId: data.dataset._id,
        totalRows: data.dataset.rowCount,
        totalColumns: data.dataset.columnCount,
        totalNulls: data.columns.reduce((acc, col) => acc + (col.nullCount || 0), 0),
        totalDuplicates: 0, // In existing report, we might not have duplicate count stored at dataset level initially, but it's fine for editing
        columns: data.columns.map(col => ({
          id: col._id,
          name: col.columnName,
          type: col.inferredDtype,
          nullCount: col.nullCount,
          duplicates: col.duplicateCount || 0,
          hasMisprints: col.misprintedValues?.length > 0,
          samples: col.sampleValues || []
        }))
      });
      setState('report');
    } catch (error) {
      toast.error('Failed to load dataset for editing.');
      setState('idle');
    }
  };

  const handleUpload = async (file) => {
    try {
      setState('uploading');
      const data = await uploadDataset(file);
      setState('analyzing');
      setReport({
        datasetId: data.datasetId,
        totalRows: data.analysis.totalRows,
        totalColumns: data.analysis.columns.length,
        totalNulls: data.analysis.columns.reduce((acc, col) => acc + (col.nullCount || 0), 0),
        totalDuplicates: data.analysis.totalDuplicates,
        columns: data.analysis.columns.map(col => ({
          id: col._id,
          name: col.columnName,
          type: col.inferredDtype,
          nullCount: col.nullCount,
          duplicates: col.duplicateCount || 0,
          hasMisprints: col.misprintedValues?.length > 0,
          samples: col.sampleValues || []
        }))
      });
      setState('report');
    } catch (error) {
      if (error.response?.status === 402) {
        setState('upgrade_required');
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload dataset.');
        setState('idle');
      }
    }
  };

  const handleApplyCleaning = async () => {
    try {
      setState('cleaning');
      await cleanDataset(report.datasetId);
      navigate(`/datasets/${report.datasetId}/data`);
    } catch (error) {
      if (error.response?.status === 402) {
        setState('upgrade_required');
      } else {
        toast.error(error.response?.data?.message || 'Failed to clean dataset.');
        setState('report');
      }
    }
  };

  const reset = () => {
    setState('idle');
    setReport(null);
    navigate('/upload', { replace: true });
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DocumentTitle title="Upload Dataset" />
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <FileSpreadsheet className="text-brand" size={36} />
          Dataset Analysis
        </h1>
        <p className="text-secondary mt-2 text-lg">Upload your data and let CleanIQ handle the mess.</p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-12"
          >
            <UploadZone onUpload={handleUpload} />
          </motion.div>
        )}

        {(state === 'uploading' || state === 'analyzing') && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="animate-spin w-6 h-6 border-2 border-brand border-t-transparent rounded-full" />
                <span className="text-lg font-medium text-primary">
                  {state === 'uploading' ? 'Uploading dataset...' : 'Analyzing columns...'}
                </span>
              </div>
            </div>
            <SkeletonCards />
            <SkeletonTable />
          </motion.div>
        )}

        {(state === 'report' || state === 'cleaning' || state === 'upgrade_required') && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-24"
          >
            <div className="flex justify-end mb-4">
              <button onClick={reset} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium">
                <RotateCcw size={16} /> Start Over
              </button>
            </div>
            
            <SummaryCards report={report} />
            <ColumnTable 
              columns={report?.columns} 
              datasetId={report?.datasetId} 
              onUpdateChange={(isUpdating) => setUpdatingColumns(prev => isUpdating ? prev + 1 : Math.max(0, prev - 1))}
            />

            <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-t border-divider p-4 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
                <button
                  onClick={handleApplyCleaning}
                  disabled={state === 'cleaning' || updatingColumns > 0}
                  className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-70"
                >
                  {state === 'cleaning' || updatingColumns > 0 ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Applying Fixes...
                    </>
                  ) : (
                    <>
                      Apply Cleaning <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'upgrade_required' && (
          <UpgradePrompt onDismiss={() => setState('report')} />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
