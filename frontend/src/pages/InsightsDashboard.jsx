import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, BarChart3, Database, AlertCircle, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getInsights, generateInsights } from '../api/insights';
import { getDatasetData } from '../api/datasets';
import PageWrapper from '../components/PageWrapper';
import DocumentTitle from '../components/DocumentTitle';
import { useToast } from '../context/ToastContext';

const COLORS = ['#0D9488', '#F59E0B', '#6366F1', '#EC4899', '#10B981', '#F43F5E'];

export default function InsightsDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [insights, setInsights] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [requiresGeneration, setRequiresGeneration] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load dataset rows for charting
        const result = await getDatasetData(id);
        setData(result.data);

        // Try to get existing insights
        try {
          const existingInsights = await getInsights(id);
          setInsights(existingInsights);
          setRequiresGeneration(false);
        } catch (err) {
          if (err.response?.status === 404) {
            // No insights yet, require manual generation
            setRequiresGeneration(true);
          } else {
            throw err;
          }
        }
      } catch (err) {
        if (err.response?.status === 402) {
          navigate('/pricing');
        } else {
          toast.error(err.response?.data?.message || 'Failed to load insights.');
          setError(err.response?.data?.message || 'Failed to load insights.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setRequiresGeneration(false);
      setError(null);
      const newInsights = await generateInsights(id);
      setInsights(newInsights);
      toast.success('Insights generated successfully!');
    } catch (err) {
      if (err.response?.status === 402) {
        navigate('/pricing');
      } else {
        toast.error(err.response?.data?.message || 'Failed to generate insights.');
        setError(err.response?.data?.message || 'Failed to generate insights.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const renderChart = (config, index) => {
    if (!data || data.length === 0) return null;

    const { type, xKey, yKey, title } = config;

    // Aggregate data for categorical charts if many rows
    // (A simple approach: just use the raw data if it's small, or aggregate by xKey if it's string)
    // For simplicity, we assume Recharts handles it or data is already reasonable.
    // In a real app, we'd do smart aggregation here based on data types.
    let chartData = data;
    
    // Grouping logic for better visuals if xKey is categorical
    const isXString = data.length > 0 && typeof data[0][xKey] === 'string';
    if (isXString && (type === 'bar' || type === 'pie')) {
      const counts = {};
      data.forEach(row => {
        const key = row[xKey] || 'Unknown';
        counts[key] = (counts[key] || 0) + (yKey ? Number(row[yKey]) || 1 : 1);
      });
      chartData = Object.keys(counts).map(key => ({
        [xKey]: key,
        [yKey || 'value']: counts[key]
      })).sort((a, b) => b[yKey || 'value'] - a[yKey || 'value']).slice(0, 10);
    }

    const yDataKey = yKey || 'value';

    const renderChartElement = () => {
      switch (type) {
        case 'bar':
          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey={xKey} stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Bar dataKey={yDataKey} fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          );
        case 'line':
          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey={xKey} stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Line type="monotone" dataKey={yDataKey} stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-accent)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          );
        case 'pie':
          return (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Pie data={chartData} dataKey={yDataKey} nameKey={xKey} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          );
        default:
          return <p className="text-sm text-secondary">Unsupported chart type: {type}</p>;
      }
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-surface rounded-2xl border border-divider shadow-surface-sm p-6"
      >
        <h3 className="text-lg font-bold font-heading mb-6" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
        {renderChartElement()}
      </motion.div>
    );
  };

  if (loading || generating) {
    return (
      <PageWrapper className="min-h-screen flex flex-col items-center justify-center p-4">
        <DocumentTitle title="Generating Insights" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white mb-6 shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Brain size={32} />
        </motion.div>
        <h2 className="text-2xl font-bold font-heading text-primary mb-2">
          {generating ? 'Analyzing data with Gemini...' : 'Loading insights...'}
        </h2>
        <p className="text-secondary max-w-sm text-center">
          {generating ? 'Our AI is searching for patterns, anomalies, and generating visualizations for your dataset.' : 'Just a moment.'}
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DocumentTitle title="AI Insights Dashboard" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium mb-4"
          >
            <ArrowLeft size={16} /> Back to Dataset
          </button>
          <h1 className="text-4xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <Brain className="text-brand" size={36} />
            AI Insights
          </h1>
          <p className="text-secondary mt-2 text-lg">Powered by Gemini 2.5 Flash</p>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-elevated hover:bg-surface border border-divider rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
          Regenerate Insights
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {requiresGeneration ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-2xl border border-divider shadow-surface-sm text-center px-4">
          <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
            <Brain size={40} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-primary mb-3">
            AI Insights Not Generated
          </h2>
          <p className="text-secondary mb-8 max-w-md">
            Click the button below to analyze your dataset with our advanced AI and instantly create a beautiful, interactive dashboard full of insights.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all text-lg"
          >
            <Brain size={22} />
            Generate Beautiful Dashboard
          </button>
        </div>
      ) : insights && (
        <>
          {/* Text Insights */}
          <div className="mb-12">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Database size={20} className="text-accent" />
              Key Observations
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.generatedText.map((text, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface p-6 rounded-2xl border border-divider shadow-surface-sm hover:shadow-surface-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  <p style={{ color: 'var(--color-text-primary)' }} className="leading-relaxed">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts */}
          {insights.chartConfigs && insights.chartConfigs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <BarChart3 size={20} className="text-primary" />
                Suggested Visualizations
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {insights.chartConfigs.map((config, index) => renderChart(config, index))}
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
