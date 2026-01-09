'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AdminLoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const API_URL = useMemo(
        () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        []
    );

    const nextPath = searchParams.get('next') || '/registration/ieeecertificate';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const json = await res.json();

            if (!res.ok || !json?.success || !json?.token) {
                throw new Error(json?.message || 'Login failed');
            }

            localStorage.setItem('adminToken', json.token);
            if (json.user) {
                localStorage.setItem('adminUser', JSON.stringify(json.user));
            }

            router.replace(nextPath);
        } catch (err) {
            setError(err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-black px-4 min-h-screen text-white">
            <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border border-white/10 rounded-2xl w-full max-w-md">
                <div className="mb-6">
                    <h1 className="font-extrabold text-2xl">Admin Login</h1>
                    <p className="mt-1 text-gray-400 text-sm">
                       Only Login for Admin's
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 mb-4 p-4 border border-red-400/20 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-linear-to-r from-cyan-500 to-blue-600 disabled:opacity-40 shadow-lg px-5 py-3 rounded-xl w-full font-medium text-white hover:scale-[1.01] transition"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/admin/setup')}
                        className="bg-white/5 hover:bg-white/10 px-5 py-3 border border-white/10 rounded-xl w-full font-medium text-gray-200 text-sm transition"
                    >
                        Create Admin / Set Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
            <AdminLoginContent />
        </Suspense>
    );
}
