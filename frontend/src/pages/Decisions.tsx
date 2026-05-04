import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Decisions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [problem, setProblem] = useState('');
  const [options, setOptions] = useState('');
  const [finalDecision, setFinalDecision] = useState('');

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/decisions');
      setDecisions(res.data.decisions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handlePostDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/decisions', { problem, options, finalDecision });
      setShowModal(false);
      setProblem(''); setOptions(''); setFinalDecision('');
      fetchDecisions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex flex-col p-8 space-y-12 hidden md:flex">
        <Link to="/" className="text-primary font-display font-bold text-3xl tracking-tighter uppercase hover:opacity-80 transition-opacity">
          Dev<span className="text-white">Bridge</span>
        </Link>
        
        <nav className="flex-1 space-y-4 font-sans text-sm font-medium">
          <Link to="/" className="flex items-center space-x-4 px-4 py-3 text-textMuted hover:text-white transition-colors">
            <span>Daily Standups</span>
          </Link>
          <Link to="/decisions" className="flex items-center space-x-4 px-4 py-3 bg-surfaceDark text-primary rounded-full transition-colors">
            <span>• Decisions Log</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate w-24">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-textMuted">Member</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-textMuted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative pt-6 pr-8">
        <header className="h-24 flex items-center justify-between mb-4">
          <h1 className="font-display text-5xl font-bold tracking-tighter uppercase leading-none w-1/2">
            YOUR <br/> DECISIONS <br/> LOG
          </h1>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary hover:bg-white text-textDark font-medium rounded-full transition-colors flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-textDark"></span>
            <span>Log Decision</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {loading ? (
            <p className="text-textMuted">Loading decisions...</p>
          ) : decisions.length === 0 ? (
            <div className="glass-panel p-12 text-center border-dashed border-2 border-border">
              <p className="text-textDark/60 mb-4 font-medium">No major decisions have been logged yet.</p>
              <button onClick={() => setShowModal(true)} className="text-primary font-bold uppercase tracking-wide hover:underline">Log your first decision</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {decisions.map((d) => (
                <div key={d.id} className="glass-panel group">
                  <div className="flex justify-between items-start mb-8 pb-4 border-b border-border/10">
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-textDark">{d.problem}</h3>
                    <span className="text-xs font-medium text-textDark/60">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-2">Options Considered</h4>
                      <p className="text-base text-textDark font-medium leading-relaxed">{d.options}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-2">Final Decision</h4>
                      <p className="inline-block px-4 py-2 rounded-full bg-surfaceDark text-white font-medium text-sm leading-relaxed">{d.finalDecision}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface text-textDark w-full max-w-xl p-10 sm:p-14 rounded-[2rem] shadow-2xl scale-in-center">
              <h2 className="text-3xl font-display font-bold mb-8 uppercase tracking-tight">Log New Decision</h2>
              <form onSubmit={handlePostDecision} className="space-y-6">
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">What was the problem or requirement?</label>
                  <input required value={problem} onChange={e => setProblem(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Choosing a database for high-concurrency writes" />
                </div>
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">What options were considered?</label>
                  <textarea value={options} onChange={e => setOptions(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" rows={3} placeholder="e.g. 1. PostgreSQL (ACID), 2. MongoDB (Flexible), 3. DynamoDB (Scalable)" />
                </div>
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">What was the final decision and why?</label>
                  <textarea required value={finalDecision} onChange={e => setFinalDecision(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" rows={3} placeholder="e.g. We chose PostgreSQL because..." />
                </div>
                <div className="flex justify-end space-x-4 mt-10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-textDark/60 hover:text-textDark transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-primary hover:bg-textDark text-textDark hover:text-white font-bold rounded-full transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Log Decision</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
