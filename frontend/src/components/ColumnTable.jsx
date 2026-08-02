import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { updateColumn } from '../api/datasets';

export default function ColumnTable({ columns, datasetId, onUpdateChange }) {
  if (!columns || columns.length === 0) return null;

  return (
    <div className="bg-surface rounded-2xl shadow-surface-md border border-divider overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-elevated border-b border-divider text-secondary text-sm">
              <th className="p-4 font-semibold sticky left-0 bg-surface-elevated z-10">Column Name</th>
              <th className="p-4 font-semibold">Inferred Type</th>
              <th className="p-4 font-semibold">Null Count</th>
              <th className="p-4 font-semibold">Duplicates</th>
              <th className="p-4 font-semibold min-w-[200px]">Sample Values</th>
              <th className="p-4 font-semibold">Null Handling</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, idx) => (
              <ColumnRow key={col.id || col.name} col={col} idx={idx} datasetId={datasetId} onUpdateChange={onUpdateChange} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ColumnRow({ col, idx, datasetId, onUpdateChange }) {
  const [nullHandling, setNullHandling] = useState('leave');
  const [typeOverride, setTypeOverride] = useState(col.type);
  const [updating, setUpdating] = useState(false);

  const handleUpdateStart = () => {
    setUpdating(true);
    if (onUpdateChange) onUpdateChange(true);
  };

  const handleUpdateEnd = () => {
    setUpdating(false);
    if (onUpdateChange) onUpdateChange(false);
  };

  const handleTypeChange = async (e) => {
    const val = e.target.value;
    setTypeOverride(val);
    try {
      handleUpdateStart();
      await updateColumn(datasetId, col.id, { userOverrideDtype: val });
    } catch (error) {
      console.error('Failed to update column type', error);
    } finally {
      handleUpdateEnd();
    }
  };

  const handleNullChange = async (e) => {
    const val = e.target.value;
    setNullHandling(val);
    try {
      handleUpdateStart();
      await updateColumn(datasetId, col.id, { nullHandling: val });
    } catch (error) {
      console.error('Failed to update null handling', error);
    } finally {
      handleUpdateEnd();
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'number': return 'bg-blue-600 text-white dark:bg-blue-500 border-blue-700';
      case 'string': return 'bg-emerald-600 text-white dark:bg-emerald-500 border-emerald-700';
      case 'date': return 'bg-purple-600 text-white dark:bg-purple-500 border-purple-700';
      case 'boolean': return 'bg-amber-500 text-white dark:bg-amber-400 dark:text-gray-900 border-amber-600';
      default: return 'bg-red-600 text-white dark:bg-red-500 border-red-700';
    }
  };

  const getNullColor = (count, total = 100) => {
    if (count === 0) return 'text-secondary';
    if (count > total * 0.5) return 'text-red-500 font-medium';
    return 'text-amber-500 font-medium';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="border-b border-divider hover:bg-surface-elevated transition-colors"
    >
      <td className="p-4 sticky left-0 bg-surface z-10 flex items-center gap-2">
        <span className="font-mono text-sm font-medium bg-surface-elevated px-2 py-1 rounded text-primary border border-divider shadow-surface-sm flex items-center gap-2">
          {col.name}
          {updating && <Loader2 size={12} className="animate-spin text-brand" />}
        </span>
        {col.hasMisprints && (
          <div className="relative group cursor-help">
            <AlertCircle size={16} className="text-amber-500" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-surface shadow-surface-lg rounded-lg border border-divider text-xs z-50 text-center">
              Contains potential misprints or formatting inconsistencies.
            </div>
          </div>
        )}
      </td>
      <td className="p-4">
        <select
          value={typeOverride}
          onChange={handleTypeChange}
          disabled={updating}
          className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer outline-none disabled:opacity-50 ${getTypeColor(typeOverride)}`}
        >
          <option value="string" className="bg-slate-800 text-white">String</option>
          <option value="number" className="bg-slate-800 text-white">Number</option>
          <option value="date" className="bg-slate-800 text-white">Date</option>
          <option value="boolean" className="bg-slate-800 text-white">Boolean</option>
        </select>
      </td>
      <td className={`p-4 ${getNullColor(col.nullCount)}`}>
        {col.nullCount.toLocaleString()}
      </td>
      <td className={`p-4 ${getNullColor(col.duplicates)}`}>
        {col.duplicates.toLocaleString()}
      </td>
      <td className="p-4">
        <div className="flex gap-1 flex-wrap">
          {col.samples?.slice(0, 3).map((val, i) => (
            <span key={i} className="text-xs truncate max-w-[80px] bg-surface-elevated px-2 py-0.5 rounded border border-divider text-secondary">
              {val === null || val === undefined ? 'null' : String(val)}
            </span>
          ))}
        </div>
      </td>
      <td className="p-4">
        <select
          value={nullHandling}
          onChange={handleNullChange}
          disabled={updating}
          className="bg-surface border border-divider rounded-lg px-3 py-1.5 text-sm text-primary focus:ring-2 focus:ring-brand outline-none w-full max-w-[150px] disabled:opacity-50"
        >
          <option value="leave">Leave as-is</option>
          <option value="drop">Drop rows</option>
          <option value="fill_mean">Fill with mean</option>
          <option value="fill_mode">Fill with mode</option>
        </select>
      </td>
    </motion.tr>
  );
}
