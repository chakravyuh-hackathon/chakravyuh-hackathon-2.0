'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
    const router = useRouter();

    const API_URL = useMemo(() => {
        return '/api';
    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [setupKey, setSetupKey] = useState('');

    const [adminExists, setAdminExists] = useState(false);
    const [setupKeyRequired, setSetupKeyRequired] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/setup`, { method: 'GET' });
                const text = await res.text();
                const json = text ? JSON.parse(text) : null;
                if (cancelled) return;
                if (res.ok && json?.success) {
                    setAdminExists(Boolean(json.adminExists));
                    setSetupKeyRequired(Boolean(json.setupKeyRequired));
                }
            } catch {
                if (!cancelled) {
                    setAdminExists(false);
                    setSetupKeyRequired(false);
                }
            }
        };

        loadStatus();
        return () => {
            cancelled = true;
        };
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (adminExists) {
            router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (setupKeyRequired && !(setupKey || '').trim()) {
            setError('Secret key is required');
            return;
        }

        setLoading(true);
        try {
            const body = {
                name,
                email,
                password
            };

            const trimmedSetupKey = (setupKey || '').trim();
            if (trimmedSetupKey) {
                body.setupKey = trimmedSetupKey;
            }

            const res = await fetch(`${API_URL}/admin/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const text = await res.text();
            let json = null;
            try {
                json = text ? JSON.parse(text) : null;
            } catch {
                json = null;
            }

            if (!res.ok || !json?.success || !json?.token) {
                if (!json) {
                    const snippet = (text || '').toString().slice(0, 250);
                    throw new Error(`Admin setup failed (HTTP ${res.status}). ${snippet || 'No response body'}`);
                }
                throw new Error(json?.message || `Admin setup failed (HTTP ${res.status})`);
            }

            localStorage.setItem('adminToken', json.token);
            if (json.user) {
                localStorage.setItem('adminUser', JSON.stringify(json.user));
            }

            setSuccess('Admin created successfully. Redirecting...');
            router.replace('/registration/ieeecertificate');
        } catch (err) {
            const message = err?.message || 'Admin setup failed';
            if (err instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-black px-4 min-h-screen text-white">
            <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border border-white/10 rounded-2xl w-full max-w-md">
                <div className="mb-6">
                    <h1 className="font-extrabold text-2xl">Create Admin / Set Password</h1>
                    <p className="mt-1 text-gray-400 text-sm">
                        Use this only once to create the first admin
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 mb-4 p-4 border border-red-400/20 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 mb-4 p-4 border border-green-400/20 rounded-xl text-green-200 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-300 text-sm">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/5 px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-full text-white placeholder:text-gray-500"
                            placeholder="Enter Your Name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-full text-white placeholder:text-gray-500"
                            placeholder="admin@email.com"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/5 px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-full text-white placeholder:text-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 text-sm">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-white/5 px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-full text-white placeholder:text-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 text-sm">SECRET KEY</label>
                        <input
                            type="text"
                            value={setupKey}
                            onChange={(e) => setSetupKey(e.target.value)}
                            className="bg-white/5 px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-full text-white placeholder:text-gray-500"
                            placeholder="Enter Secret Key"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-linear-to-r from-cyan-500 to-blue-600 disabled:opacity-40 shadow-lg px-5 py-3 rounded-xl w-full font-medium text-white hover:scale-[1.01] transition"
                    >
                        {loading ? 'Creating...' : 'Create Admin'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/admin/login')}
                        className="bg-white/5 hover:bg-white/10 px-5 py-3 border border-white/10 rounded-xl w-full font-medium text-gray-200 text-sm transition"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}
