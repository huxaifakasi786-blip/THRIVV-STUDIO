import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message || 'Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-lg p-8 shadow-2xl relative overflow-hidden">

                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-[50px]"></div>

                <div className="text-center mb-8 relative z-10">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                        <span className="text-[var(--color-accent)]">THRIVV</span>ADMIN
                    </h1>
                    <p className="text-gray-400 text-sm tracking-wider uppercase">Restricted Access</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            placeholder="e.g. admin"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full btn-primary py-4 uppercase tracking-widest text-sm shadow-[0_4px_15px_rgba(0,255,255,0.2)]">
                        Login
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-600">
                    Demo Credentials: admin / admin123
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;
