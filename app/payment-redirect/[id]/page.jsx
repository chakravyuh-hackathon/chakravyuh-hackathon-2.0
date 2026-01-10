'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        if (!id) return;

        const timeoutId = setTimeout(() => {
            router.replace(`/payment/${id}`);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [id, router]);

    if (!id) {
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-red-50 to-pink-100 min-h-screen font-semibold text-red-600">
                Invalid payment link
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 px-4 min-h-screen">
            <div className="bg-white/80 shadow-xl backdrop-blur-xl p-8 border border-white/40 rounded-2xl w-full max-w-lg">
                <h1 className="mb-3 font-extrabold text-gray-900 text-2xl text-center tracking-tight">
                    Redirecting to Payment
                </h1>

                <p className="mb-8 text-gray-600 text-sm text-center">
                    Please wait a moment...
                </p>

                <div className="flex justify-center">
                    <div className="border-4 border-indigo-600 border-t-transparent rounded-full w-12 h-12 animate-spin" />
                </div>

                <p className="mt-8 text-gray-500 text-xs text-center">
                    If you are not redirected automatically, please go back and click the link again.
                </p>
            </div>
        </div>
    );
}
