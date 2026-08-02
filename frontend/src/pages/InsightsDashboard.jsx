import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RefreshCw, BarChart3, Database, AlertCircle, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getInsights, generateInsights, askQuestion } from '../api/insights';
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
  
  // Custom Prompt State
  const [customPrompt, setCustomPrompt] = useState('');
  const [askingPrompt, setAskingPrompt] = useState(false);
  const [customInsights, setCustomInsights] = useState([]);

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

    const { type, xKey, yKey, title, aggregation = 'sum' } = config;

    let chartData = data;
    
    // Grouping logic based on aggregation
    const isXString = data.length > 0 && typeof data[0][xKey] === 'string';
    if (isXString && (type === 'bar' || type === 'pie')) {
      const groups = {};
      data.forEach(row => {
        const key = row[xKey] || 'Unknown';
        if (!groups[key]) groups[key] = { sum: 0, count: 0 };
        
        groups[key].count += 1;
        if (yKey && row[yKey] !== undefined && row[yKey] !== null && !isNaN(row[yKey])) {
          groups[key].sum += Number(row[yKey]);
        }
      });
      
      chartData = Object.keys(groups).map(key => {
        let val = 0;
        if (aggregation === 'average') {
          val = groups[key].count > 0 ? (groups[key].sum / groups[key].count) : 0;
          val = Math.round(val * 100) / 100; // round to 2 decimals
        } else if (aggregation === 'count') {
          val = groups[key].count;
        } else {
          val = groups[key].sum;
        }
        
        return {
          [xKey]: key,
          [yKey || 'value']: val
        };
      }).sort((a, b) => b[yKey || 'value'] - a[yKey || 'value']).slice(0, 10);
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
        key={`${title}-${index}`}
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

  const handleAskQuestion = async (e, overridePrompt = null) => {
    if (e) e.preventDefault();
    const promptToUse = overridePrompt || customPrompt;
    if (!promptToUse.trim() || askingPrompt) return;
    
    try {
      setAskingPrompt(true);
      const result = await askQuestion(id, promptToUse);
      setCustomInsights(prev => [result, ...prev]);
      if (!overridePrompt) setCustomPrompt('');
    } catch (err) {
      toast.error('Failed to answer your question.');
    } finally {
      setAskingPrompt(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setCustomPrompt(question);
    handleAskQuestion(null, question);
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
          <p className="text-secondary mt-1">Powered by Gemini 3.5 Flash</p>
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
          {/* Custom Prompt Input */}
          <div className="mb-10 bg-surface border border-brand/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
            <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              Ask your Data
            </h2>
            <form onSubmit={handleAskQuestion} className="flex gap-3">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Show me the average age of passengers by gender"
                className="flex-1 bg-background border border-divider rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                disabled={askingPrompt}
              />
              <button
                type="submit"
                disabled={askingPrompt || !customPrompt.trim()}
                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {askingPrompt ? <RefreshCw size={18} className="animate-spin" /> : <Brain size={18} />}
                Ask
              </button>
            </form>

            {insights.suggestedQuestions && insights.suggestedQuestions.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-secondary mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {insights.suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(question)}
                      disabled={askingPrompt}
                      className="px-4 py-2 bg-brand/5 hover:bg-brand/10 border border-brand/20 text-brand rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Render Custom Insights if any */}
          {customInsights.length > 0 && (
            <div className="mb-12 border-b border-divider pb-12">
              <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                Your Custom Insights
              </h2>
              <div className="flex flex-col gap-8">
                {customInsights.map((customInsight, idx) => (
                  <div key={idx} className="bg-brand/5 border border-brand/20 rounded-2xl p-6 shadow-sm">
                    {customInsight.generatedText?.map((text, i) => (
                      <p key={i} style={{ color: 'var(--color-text-primary)' }} className="mb-6 font-medium text-lg leading-relaxed">
                        {text}
                      </p>
                    ))}
                    {customInsight.chartConfigs && customInsight.chartConfigs.length > 0 && (
                      <div className="grid lg:grid-cols-2 gap-8">
                        {customInsight.chartConfigs.map((config, index) => renderChart(config, `custom-${idx}-${index}`))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
        </>
      )}
    </PageWrapper>
  );
}
