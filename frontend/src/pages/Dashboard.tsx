import { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, AlertOctagon, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [standups, setStandups] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  // New Update Form State
  const [showModal, setShowModal] = useState(false);
  const [didToday, setDidToday] = useState('');
  const [doNext, setDoNext] = useState('');
  const [blockers, setBlockers] = useState('');

  const fetchDashboardData = async () => {
    // 1. Fetch standups immediately (Fast)
    setLoading(true);
    api.get('/standups')
      .then(res => setStandups(res.data.standups))
      .catch(err => console.error('Error fetching standups', err))
      .finally(() => setLoading(false));

    // 2. Fetch AI summary in the background (Slow)
    setAiLoading(true);
    api.get('/ai/summary')
      .then(res => setAiSummary(res.data.summary))
      .catch(() => setAiSummary('AI summarization failed to load.'))
      .finally(() => setAiLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePostStandup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/standups', { didToday, doNext, blockers });
      setShowModal(false);
      setDidToday(''); setDoNext(''); setBlockers('');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex flex-col p-8 space-y-12 hidden md:flex">
        <div className="text-primary font-display font-bold text-3xl tracking-tighter uppercase">
          Dev<span className="text-white">Bridge</span>
        </div>
        
        <nav className="flex-1 space-y-4 font-sans text-sm font-medium">
          <Link to="/" className="flex items-center space-x-4 px-4 py-3 bg-surfaceDark text-primary rounded-full transition-colors">
            <span>• Daily Standups</span>
          </Link>
          <Link to="/decisions" className="flex items-center space-x-4 px-4 py-3 text-textMuted hover:text-white transition-colors">
            <span>Decisions Log</span>
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
            TOGETHER <br/> ON A DIGITAL <br/> JOURNEY
          </h1>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary hover:bg-white text-textDark font-medium rounded-full transition-colors flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-textDark"></span>
            <span>New Update</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* AI Summary Section */}
          {(aiLoading || aiSummary) && (
            <section className="dark-panel relative overflow-hidden group border border-surfaceDark/50">
              <div className="flex items-center space-x-4 mb-8 border-b border-surfaceDark/20 pb-6">
                <div className="p-3 bg-primary text-textDark rounded-full">
                  <Sparkles size={20} className={aiLoading ? "animate-pulse" : ""} />
                </div>
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight">AI Daily Summary</h2>
                {aiLoading && <span className="text-sm text-primary animate-pulse font-medium">Generating...</span>}
              </div>
              
              {aiLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-background rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-background rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-background rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none font-sans text-textMuted leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </div>
              )}
            </section>
          )}

          {/* Standup Feed */}
          <section>
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-8">Recent Updates</h3>
            {loading ? (
              <p className="text-textMuted">Loading updates...</p>
            ) : standups.length === 0 ? (
              <p className="text-textMuted">No standups found for this team yet.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {standups.map((s) => (
                  <div key={s.id} className="glass-panel group">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-surfaceDark text-white flex items-center justify-center font-display font-bold uppercase">
                          {s.user?.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-bold text-lg">{s.user?.name || 'Unknown'}</span>
                      </div>
                      <span className="text-sm font-medium text-textDark/60">{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-6 text-sm">
                      <div>
                        <p className="text-textDark/50 font-display font-bold uppercase tracking-widest text-xs mb-2">Completed Today</p>
                        <p className="font-medium text-lg leading-snug">{s.didToday}</p>
                      </div>
                      <div>
                        <p className="text-textDark/50 font-display font-bold uppercase tracking-widest text-xs mb-2">Planning Next</p>
                        <p className="font-medium text-lg leading-snug">{s.doNext}</p>
                      </div>
                      {s.blockers && (
                        <div>
                          <p className="text-textDark/50 font-display font-bold uppercase tracking-widest text-xs mb-2">Blockers</p>
                          <p className="inline-block px-4 py-2 rounded-full bg-surfaceDark text-white font-medium text-sm">
                            {s.blockers}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Create Standup Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface text-textDark w-full max-w-xl p-10 sm:p-14 rounded-[2rem] shadow-2xl scale-in-center">
              <h2 className="text-3xl font-display font-bold mb-8 uppercase tracking-tight">Submit Daily Update</h2>
              <form onSubmit={handlePostStandup} className="space-y-6">
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">What did you complete today?</label>
                  <textarea required value={didToday} onChange={e => setDidToday(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" rows={3} />
                </div>
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">What are you planning next?</label>
                  <textarea required value={doNext} onChange={e => setDoNext(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" rows={3} />
                </div>
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-3">Any blockers? (Optional)</label>
                  <input type="text" value={blockers} onChange={e => setBlockers(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl p-5 text-white font-medium focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex justify-end space-x-4 mt-10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-textDark/60 hover:text-textDark transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-primary hover:bg-textDark text-textDark hover:text-white font-bold rounded-full transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>Submit Update</span>
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
