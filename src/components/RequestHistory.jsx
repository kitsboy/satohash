import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, Check, X, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'satohash-request-history';

export const useRequestHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  const addRequest = (request) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...request
    };
    const updated = [entry, ...history].slice(0, 5); // Keep last 5
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const retryRequest = (entry, onRetry) => {
    onRetry(entry);
  };

  return { history, addRequest, clearHistory, retryRequest };
};

export default function RequestHistory({ history, onRetry, onClear }) {
  const [expanded, setExpanded] = useState(null);

  if (history.length === 0) return null;

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="mt-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Recent Requests ({history.length})
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="bg-black/30 rounded-lg p-3 cursor-pointer hover:bg-black/50 transition-colors"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  entry.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  entry.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {entry.method}
                </span>
                <span className="text-sm text-gray-300 truncate max-w-[150px]">
                  {entry.endpoint}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {entry.success ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span>
              </div>
            </div>

            <AnimatePresence>
              {expanded === entry.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-gray-700"
                >
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(entry.body || {}, null, 2)}
                  </pre>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetry(entry);
                    }}
                    className="mt-2 text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry this request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
