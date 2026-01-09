'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIeeeCertificateRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/registration/ieeecertificate');
    }, [router]);

    return (
        <div className="p-6">Redirecting...</div>
    );
}
