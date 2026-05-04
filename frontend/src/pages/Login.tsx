import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Activity } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
      } else {
        const res = await api.post('/auth/register', { email, password, name });
        login(res.data.token, res.data.user);
      }
      navigate('/'); // Go to dashboard
    } catch (err: any) {
      console.error("Login Error:", err);
      const serverError = err.response?.data?.error;
      const errorMessage = typeof serverError === 'object' ? serverError.message : serverError;
      setError(errorMessage || err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-panel w-full max-w-lg p-10 sm:p-14">
        <div className="text-center font-display font-bold text-3xl tracking-tighter mb-10 text-textDark uppercase">
          Dev<span className="text-primary">Bridge</span>
        </div>
        
        <h2 className="text-3xl font-display font-bold tracking-tight uppercase text-center mb-10 text-textDark">
          {isLogin ? 'Welcome Back' : 'Join the Journey'}
        </h2>

        {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-2">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-primary transition-colors placeholder-textMuted" placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-primary transition-colors placeholder-textMuted" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-textDark/50 mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-background border-2 border-transparent rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-primary transition-colors placeholder-textMuted" placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full bg-primary hover:bg-textDark hover:text-white text-textDark font-bold py-4 rounded-full transition-colors mt-8 flex justify-center items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{isLogin ? 'Sign In' : 'Register'}</span>
          </button>
        </form>

        <p className="text-center text-sm font-medium text-textDark/50 mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
