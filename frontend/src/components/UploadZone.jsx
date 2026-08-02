import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileType, AlertCircle } from 'lucide-react';

export default function UploadZone({ onUpload }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setError(null);
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const onDropRejected = useCallback(fileRejections => {
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0].message || 'Invalid file type. Please upload a .csv, .xls, or .xlsx file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 transition-colors duration-300 cursor-pointer overflow-hidden
          ${isDragActive ? 'border-[var(--color-primary)] bg-brand bg-opacity-10' : 'border-dashed border-[var(--color-border)] bg-surface hover:bg-surface-elevated'}
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}
        `}
        animate={{ scale: isDragActive ? 1.02 : 1 }}
        whileHover={{ scale: isDragActive ? 1.02 : 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={error ? 'error' : isDragActive ? 'active' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center text-center p-6"
          >
            {error ? (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-lg font-semibold text-red-500 mb-2">Upload Failed</p>
                <p className="text-sm text-red-400">{error}</p>
              </>
            ) : (
              <>
                <div className={`p-4 rounded-full mb-6 ${isDragActive ? 'bg-brand text-white' : 'bg-surface-elevated text-brand shadow-surface-sm'}`}>
                  <Upload className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  {isDragActive ? 'Drop your dataset here' : 'Drop your dataset here or click to browse'}
                </h3>
                <p className="text-secondary mb-8">
                  Intelligent cleaning for messy data
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 text-xs font-medium bg-surface-elevated border border-divider rounded-full text-secondary flex items-center gap-1">
                    <FileType size={12} /> .CSV
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-surface-elevated border border-divider rounded-full text-secondary flex items-center gap-1">
                    <FileType size={12} /> .XLSX
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
