'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';

function SuccessContent() {
    const searchParams = useSearchParams();
    const registrationId = searchParams.get('id');
    const verifying = searchParams.get('verifying') === '1';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!registrationId) {
            setError('No registration ID found');
            setLoading(false);
            return;
        }

        let isCancelled = false;
        let pollTimer;
        let attempts = 0;

        const fetchRegistration = async () => {
            try {
                const API_URL = '/api';

                const response = await fetch(
                    `${API_URL}/registrations/${registrationId}`
                );
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch registration details');
                }

                if (isCancelled) return;

                if (verifying && result.data?.status !== 'confirmed') {
                    attempts += 1;
                    if (attempts >= 15) {
                        setError('Payment verification is taking too long. Please refresh this page.');
                        setLoading(false);
                        return;
                    }

                    setLoading(true);
                    pollTimer = setTimeout(fetchRegistration, 1000);
                    return;
                }

                setData(result.data);
                setLoading(false);
            } catch (err) {
                if (isCancelled) return;
                setError(err?.message || 'Error fetching registration details');
                setLoading(false);
            }
        };

        fetchRegistration();

        return () => {
            isCancelled = true;
            if (pollTimer) clearTimeout(pollTimer);
        };
    }, [registrationId, verifying]);

    /* ================= PDF DOWNLOAD ================= */
    const downloadPDF = async () => {
        if (!data) return;

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Background Card
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(10, 10, pageWidth - 20, 277, 8, 8, 'F');

        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 51, 102);
        doc.text('CHAKRAVYUH 2.0', pageWidth / 2, 30, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(70);
        doc.text(
            'National Level Technical, Cultural & Innovation Fest',
            pageWidth / 2,
            38,
            { align: 'center' }
        );

        doc.setDrawColor(180);
        doc.line(20, 45, pageWidth - 20, 45);

        // Details
        doc.setFontSize(13);
        doc.setTextColor(0);

        doc.text('Registration ID :', 25, 60);
        doc.setFont('courier', 'bold');
        doc.text(data.registrationId, 75, 60);

        doc.setFont('helvetica', 'normal');
        doc.text('Team Name       :', 25, 72);
        doc.text(data.teamName || 'N/A', 75, 72);

        const participantNames = [data.fullName, ...(Array.isArray(data.teamMembers) ? data.teamMembers.map((m) => m?.name).filter(Boolean) : [])]
            .filter(Boolean)
            .join(', ');
        const participantText = participantNames || 'Registered Participant';
        const participantLines = doc.splitTextToSize(participantText, pageWidth - 95);

        doc.text('Participant     :', 25, 84);
        doc.text(participantLines, 75, 84);

        const emailY = 84 + Math.max(1, participantLines.length) * 6 + 6;
        doc.text('Email           :', 25, emailY);
        doc.text(data.email, 75, emailY);

        const qrLabelY = emailY + 19;
        const qrImgY = qrLabelY + 5;
        const qrHintY = qrImgY + 68;
        const venueLineY = qrHintY + 17;
        const venueTitleY = venueLineY + 13;
        const venueTextY = venueTitleY + 10;
        const footerText1Y = venueTextY + 32;
        const footerText2Y = footerText1Y + 8;

        // QR Code
        if (data.qrCode) {
            const img = new Image();
            img.src = data.qrCode;
            await new Promise((resolve) => (img.onload = resolve));

            doc.setFontSize(12);
            doc.text('ENTRY QR CODE', pageWidth / 2, qrLabelY, { align: 'center' });
            doc.addImage(img, 'PNG', pageWidth / 2 - 30, qrImgY, 60, 60);

            doc.setFontSize(10);
            doc.setTextColor(90);
            doc.text(
                'Scan this QR code at the entry gate',
                pageWidth / 2,
                qrHintY,
                { align: 'center' }
            );
        }

        // Venue
        doc.setDrawColor(200);
        doc.line(20, venueLineY, pageWidth - 20, venueLineY);

        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text('Event Venue', pageWidth / 2, venueTitleY, { align: 'center' });

        doc.setFontSize(11);
        doc.setTextColor(50);
        doc.text(
            `SVERI's College of Engineering (COE)\nPandharpur - 413304\nSolapur District, Maharashtra, India`,
            pageWidth / 2,
            venueTextY,
            { align: 'center' }
        );

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
            'Please carry this ticket (digital or printed) during the event.',
            pageWidth / 2,
            footerText1Y,
            { align: 'center' }
        );

        doc.text(
            '© Chakravyuh 2.0 | SVERI\'s COE, Pandharpur',
            pageWidth / 2,
            footerText2Y,
            { align: 'center' }
        );

        doc.save(`Chakravyuh_Ticket_${data.registrationId}.pdf`);
    };

    /* ================= UI STATES ================= */
    if (loading) {
        return (
            <div className="p-12 text-center">
                {verifying ? 'Verifying payment... Please wait' : 'Loading...'}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
                <h1 className="mb-4 font-bold text-2xl">Error</h1>
                <p>{error}</p>
                <Link href="/" className="mt-4 text-blue-600 hover:underline">
                    Go Home
                </Link>
            </div>
        );
    }

    /* ================= SUCCESS UI ================= */
    return (
        <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
            <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="mb-2 font-bold text-gray-900 text-2xl">
                    Registration Confirmed!
                </h1>
                <p className="mb-6 text-gray-600">
                    You're successfully registered for Chakravyuh 2.0
                </p>

                <div className="bg-gray-50 mb-6 p-6 border rounded-xl">
                    <p className="text-gray-500 text-sm">Registration ID</p>
                    <p className="mb-3 font-mono font-bold text-blue-600">
                        {data.registrationId}
                    </p>

                    <p className="text-gray-500 text-sm">Event</p>
                    <p className="mb-4 font-medium">{data.event}</p>

                    {data.qrCode && (
                        <div className="flex flex-col items-center">
                            <p className="mb-2 text-gray-500 text-sm">Entry QR Code</p>
                            <img
                                src={data.qrCode}
                                alt="QR Code"
                                className="border rounded-lg w-48 h-48"
                            />
                        </div>
                    )}
                </div>

                {/* DOWNLOAD BUTTON */}
                <button
                    onClick={downloadPDF}
                    className="flex justify-center items-center gap-2 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg hover:shadow-2xl mb-4 px-6 py-3 rounded-xl w-full font-semibold text-white text-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                    Download Entry Ticket
                </button>

                <p className="mb-4 text-gray-500 text-sm">
                    Confirmation email sent to <br />
                    <span className="font-medium">{data.email}</span>
                </p>

                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

/* ================= PAGE EXPORT ================= */
export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
