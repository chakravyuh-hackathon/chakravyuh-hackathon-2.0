'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IeeeCertificatesPage() {
    const router = useRouter();
    const API_URL = useMemo(() => {
        return '/api';
    }, []);

    const [token, setToken] = useState('');
    const [authChecked, setAuthChecked] = useState(false);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [previewTab, setPreviewTab] = useState('details');
    const [memberFilter, setMemberFilter] = useState('all');
    const [search, setSearch] = useState('');

    const [certificateBlobUrl, setCertificateBlobUrl] = useState('');
    const [certificateLoading, setCertificateLoading] = useState(false);
    const [certificateError, setCertificateError] = useState('');

    const [paymentBlobUrl, setPaymentBlobUrl] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const [approveLoading, setApproveLoading] = useState(false);
    const [approveError, setApproveError] = useState('');
    const [approveSuccess, setApproveSuccess] = useState('');

    const downloadExcel = async () => {
        try {
            if (!Array.isArray(visibleRows) || visibleRows.length === 0) return;

            const excelMod = await import('exceljs');
            const fileSaverMod = await import('file-saver');

            const ExcelJS = excelMod?.default || excelMod;
            const saveAs = fileSaverMod?.saveAs || fileSaverMod?.default;

            const workbook = new ExcelJS.Workbook();

            const addSheet = async (sheetName, data, includeQr) => {
                const ws = workbook.addWorksheet(sheetName);
                const maxExtraMembers = Math.max(
                    0,
                    ...data.map((r) => (Array.isArray(r?.teamMembers) ? r.teamMembers.length : 0))
                );

                const columns = [
                    { header: 'REGISTRATION ID', key: 'registrationId', width: 22 },
                    { header: 'STATUS', key: 'status', width: 14 },
                    { header: 'PAYMENT STATUS', key: 'paymentStatus', width: 16 },
                    { header: 'AMOUNT', key: 'amount', width: 10 },
                    { header: 'EVENT', key: 'event', width: 16 },
                    { header: 'TYPE', key: 'type', width: 12 },
                    { header: 'TEAM NAME', key: 'teamName', width: 22 },
                    { header: 'LEADER NAME', key: 'fullName', width: 22 },
                    { header: 'LEADER EMAIL', key: 'email', width: 28 },
                    { header: 'LEADER PHONE', key: 'phone', width: 16 },
                    { header: 'COLLEGE', key: 'college', width: 30 },
                    { header: 'IEEE MEMBER', key: 'ieeeMember', width: 14 },
                    { header: 'IEEE ID', key: 'ieeeId', width: 16 }
                ];

                if (includeQr) {
                    columns.push({ header: 'QR (SCAN)', key: 'qr', width: 22 });
                }

                for (let i = 0; i < maxExtraMembers; i++) {
                    const memberNo = i + 2;
                    columns.push(
                        { header: `MEMBER ${memberNo} NAME`, key: `m${memberNo}Name`, width: 20 },
                        { header: `MEMBER ${memberNo} EMAIL`, key: `m${memberNo}Email`, width: 26 },
                        { header: `MEMBER ${memberNo} PHONE`, key: `m${memberNo}Phone`, width: 18 }
                    );
                }

                ws.columns = columns;

                ws.getRow(1).font = { bold: true };
                ws.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                ws.getRow(1).height = 22;

                for (let i = 0; i < data.length; i++) {
                    const r = data[i];
                    const members = Array.isArray(r?.teamMembers) ? r.teamMembers : [];
                    const memberMap = {};
                    members.forEach((m, idx) => {
                        const memberNo = idx + 2;
                        memberMap[`m${memberNo}Name`] = m?.name || '';
                        memberMap[`m${memberNo}Email`] = m?.email || '';
                        memberMap[`m${memberNo}Phone`] = m?.phone || '';
                    });

                    const row = ws.addRow({
                        registrationId: r?.registrationId || '',
                        status: r?.status || '',
                        paymentStatus: r?.payment?.status || '',
                        amount: r?.payment?.amount || '',
                        event: r?.event || '',
                        type: r?.isTeam ? 'Team' : 'Individual',
                        teamName: r?.teamName || '',
                        fullName: r?.fullName || '',
                        email: r?.email || '',
                        phone: r?.phone || '',
                        college: r?.college || '',
                        ieeeMember: r?.ieeeMember || '',
                        ieeeId: r?.ieeeId || '',
                        ...memberMap
                    });

                    row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

                    if (includeQr && r?.qrCode && typeof r.qrCode === 'string') {
                        try {
                            const base64 = r.qrCode.includes('base64,')
                                ? r.qrCode.split('base64,')[1]
                                : r.qrCode;
                            const imgId = workbook.addImage({ base64, extension: 'png' });

                            const qrColIndex = columns.findIndex((c) => c.key === 'qr');
                            if (qrColIndex >= 0) {
                                row.height = 95;
                                ws.addImage(imgId, {
                                    tl: { col: qrColIndex + 0.1, row: i + 1.15 },
                                    ext: { width: 90, height: 90 }
                                });
                            }
                        } catch {
                            // ignore QR embed failures
                        }
                    }
                }
            };

            const confirmedRows = visibleRows.filter(
                (r) => (r?.status || '').toString().toLowerCase() === 'confirmed'
            );

            if (confirmedRows.length > 0) {
                await addSheet('CONFIRMED (QR)', confirmedRows, true);
            }

            await addSheet('ALL REGISTRATIONS', visibleRows, false);

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            if (typeof saveAs === 'function') {
                saveAs(blob, `registrations_${Date.now()}.xlsx`);
            }
        } catch (e) {
            const message = e?.message || 'Failed to export Excel';
            setError(message);
        }
    };

    useEffect(() => {
        try {
            const t = localStorage.getItem('adminToken') || '';
            if (!t) {
                router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                return;
            }
            setToken(t);
        } finally {
            setAuthChecked(true);
        }
    }, [router]);

    useEffect(() => {
        const fetchRows = async () => {
            if (!token) return;
            try {
                setLoading(true);
                setError('');

                const res = await fetch(`${API_URL}/admin/registrations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json().catch(() => null);

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('adminToken');
                    router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                    return;
                }

                if (!res.ok || !json?.success) {
                    throw new Error(json?.message || 'Failed to fetch registrations');
                }

                setRows(Array.isArray(json?.data) ? json.data : []);
            } catch (e) {
                const message = e?.message || 'Failed to fetch registrations';
                if (e instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                    setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
                } else {
                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, [API_URL, router, token]);

    const filteredRows = useMemo(() => {
        const q = (search || '').trim().toLowerCase();
        if (!q) return rows;

        return rows.filter((r) => {
            const haystack = [
                r?.registrationId,
                r?.fullName,
                r?.email,
                r?.phone,
                r?.college,
                r?.teamName,
                r?.ieeeId
            ]
                .filter(Boolean)
                .map((v) => String(v).toLowerCase())
                .join(' | ');

            return haystack.includes(q);
        });
    }, [rows, search]);

    const visibleRows = useMemo(() => {
        if (memberFilter === 'all') return filteredRows;

        return filteredRows.filter((r) => {
            const isIeee = (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
            return memberFilter === 'ieee' ? isIeee : !isIeee;
        });
    }, [filteredRows, memberFilter]);

    const counts = useMemo(() => {
        let ieee = 0;
        let nonIeee = 0;

        for (const r of filteredRows) {
            const isIeee = (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
            if (isIeee) ieee += 1;
            else nonIeee += 1;
        }

        return { total: filteredRows.length, ieee, nonIeee };
    }, [filteredRows]);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return visibleRows.find((r) => String(r._id) === String(selectedId)) || null;
    }, [selectedId, visibleRows]);

    const previewRecord = selectedDetails || selected;

    const hasPreviewCertificate = useMemo(() => {
        if (!previewRecord) return false;
        if (typeof previewRecord.hasIeeeCertificate !== 'undefined') return Boolean(previewRecord.hasIeeeCertificate);
        const isIeeeYes = (previewRecord.ieeeMember || 'no').toString().toLowerCase() === 'yes';
        const cert = previewRecord.ieeeMembershipCertificate;
        return Boolean(isIeeeYes && cert && (cert.contentType || cert.fileName));
    }, [previewRecord]);

    const hasPreviewPaymentProof = useMemo(() => {
        if (!previewRecord) return false;
        const utr = previewRecord?.payment?.utrNumber || previewRecord?.utrNumber;
        const screenshotMeta = previewRecord?.payment?.screenshot || previewRecord?.paymentScreenshot;
        return Boolean(utr || screenshotMeta?.contentType || screenshotMeta?.fileName);
    }, [previewRecord]);

    useEffect(() => {
        if (!selectedId) return;
        const stillExists = visibleRows.some((r) => String(r._id) === String(selectedId));
        if (!stillExists) {
            setSelectedId('');
            setSelectedDetails(null);
            setDetailsError('');
            setDetailsLoading(false);
            setPreviewTab('details');
        }
    }, [selectedId, visibleRows]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!token || !selectedId) {
                setSelectedDetails(null);
                setDetailsError('');
                setDetailsLoading(false);
                return;
            }

            try {
                setDetailsLoading(true);
                setDetailsError('');

                const res = await fetch(`${API_URL}/admin/registrations/${selectedId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json().catch(() => null);

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('adminToken');
                    router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                    return;
                }

                if (!res.ok || !json?.success) {
                    throw new Error(json?.message || 'Failed to fetch registration details');
                }

                setSelectedDetails(json?.data || null);
            } catch (e) {
                setSelectedDetails(null);
                const message = e?.message || 'Failed to fetch registration details';
                if (e instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                    setDetailsError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
                } else {
                    setDetailsError(message);
                }
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [API_URL, router, selectedId, token]);

    useEffect(() => {
        if (!certificateBlobUrl) return;
        return () => {
            URL.revokeObjectURL(certificateBlobUrl);
        };
    }, [certificateBlobUrl]);

    useEffect(() => {
        if (!paymentBlobUrl) return;
        return () => {
            URL.revokeObjectURL(paymentBlobUrl);
        };
    }, [paymentBlobUrl]);

    useEffect(() => {
        const fetchCertificate = async () => {
            setCertificateError('');

            if (!token || !previewRecord || !hasPreviewCertificate || previewTab !== 'certificate') {
                setCertificateLoading(false);
                setCertificateError('');
                setCertificateBlobUrl('');
                return;
            }

            try {
                setCertificateLoading(true);
                setCertificateError('');
                setCertificateBlobUrl('');

                const res = await fetch(`${API_URL}/admin/registrations/${previewRecord._id}/ieee-certificate`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('adminToken');
                        router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                        return;
                    }
                    const json = await res.json().catch(() => null);
                    throw new Error(json?.message || 'Failed to fetch IEEE certificate');
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setCertificateBlobUrl(url);
            } catch (e) {
                setCertificateBlobUrl('');
                const message = e?.message || 'Failed to fetch IEEE certificate';
                if (e instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                    setCertificateError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
                } else {
                    setCertificateError(message);
                }
            } finally {
                setCertificateLoading(false);
            }
        };

        fetchCertificate();
    }, [API_URL, hasPreviewCertificate, previewRecord, previewTab, router, token]);

    useEffect(() => {
        const fetchPaymentProof = async () => {
            setPaymentError('');

            if (!token || !previewRecord || !hasPreviewPaymentProof || previewTab !== 'payment') {
                setPaymentLoading(false);
                setPaymentError('');
                setPaymentBlobUrl('');
                return;
            }

            try {
                setPaymentLoading(true);
                setPaymentError('');
                setPaymentBlobUrl('');

                const res = await fetch(`${API_URL}/registrations/${previewRecord._id}/payment-screenshot`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('adminToken');
                        router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                        return;
                    }
                    const json = await res.json().catch(() => null);
                    throw new Error(json?.message || 'Failed to fetch payment proof');
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setPaymentBlobUrl(url);
            } catch (e) {
                setPaymentBlobUrl('');
                const message = e?.message || 'Failed to fetch payment proof';
                if (e instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                    setPaymentError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
                } else {
                    setPaymentError(message);
                }
            } finally {
                setPaymentLoading(false);
            }
        };

        fetchPaymentProof();
    }, [API_URL, hasPreviewPaymentProof, previewRecord, previewTab, router, token]);

    const renderValue = (value) => {
        if (value === null || value === undefined || value === '') return '-';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        }
        return String(value);
    };

    const renderField = (label, value) => (
        <div className="bg-white/5 p-3 border border-white/10 rounded-xl" key={label}>
            <div className="text-gray-400 text-xs">{label}</div>
            <div className="font-medium text-white text-sm wrap-break-word">{renderValue(value)}</div>
        </div>
    );

    const refreshRowInState = (id, patch) => {
        setRows((prev) =>
            Array.isArray(prev)
                ? prev.map((r) => (String(r?._id) === String(id) ? { ...r, ...patch } : r))
                : prev
        );
        setSelectedDetails((prev) => {
            if (!prev || String(prev?._id) !== String(id)) return prev;
            return { ...prev, ...patch };
        });
    };

    const handleFinalApprove = async () => {
        try {
            setApproveLoading(true);
            setApproveError('');
            setApproveSuccess('');

            if (!token) {
                router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                return;
            }

            if (!previewRecord?._id) {
                throw new Error('No registration selected');
            }

            const res = await fetch(`${API_URL}/registrations/${previewRecord._id}/final-approve`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await res.json().catch(() => null);
            if (!res.ok || !json?.success) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('adminToken');
                    router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                    return;
                }
                throw new Error(json?.message || 'Failed to approve payment');
            }

            refreshRowInState(previewRecord._id, {
                status: 'confirmed',
                payment: {
                    ...(previewRecord.payment || {}),
                    status: 'captured'
                },
                qrCode: json?.data?.qrCode || previewRecord.qrCode
            });

            const emailQueued = Boolean(json?.data?.emailQueued);
            const emailRecipients = Number(json?.data?.emailRecipients || 0);
            if (emailQueued && emailRecipients > 0) {
                setApproveSuccess(
                    `Payment confirmed successfully. Confirmation email queued for ${emailRecipients} recipient(s).`
                );
            } else {
                setApproveSuccess('Payment confirmed successfully. Email not queued (EMAIL_USER/EMAIL_PASS not configured).');
            }
        } catch (e) {
            const message = e?.message || 'Failed to approve payment';
            if (e instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                setApproveError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } else {
                setApproveError(message);
            }
        } finally {
            setApproveLoading(false);
        }
    };

    if (!authChecked) {
        return (
            <div className="bg-linear-to-r from-[#0f172a] via-[#020617] to-black p-6 min-h-screen text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-4 mb-8">
                        <div>
                            <h1 className="bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 font-extrabold text-transparent text-3xl">
                                Registrations
                            </h1>
                            <p className="text-gray-400 text-sm">Loading admin session...</p>
                        </div>
                    </div>

                    <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-white/10 border-b">
                                <div className="bg-white/10 rounded-xl w-40 h-6" />
                                <div className="bg-white/10 mt-3 rounded-xl w-24 h-4" />
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                            </div>
                        </div>

                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-white/10 border-b">
                                <div className="bg-white/10 rounded-xl w-28 h-6" />
                                <div className="bg-white/10 mt-3 rounded-xl w-60 h-4" />
                            </div>
                            <div className="p-4">
                                <div className="bg-white/10 rounded-2xl h-[62vh]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-r from-[#0f172a] via-[#020617] to-black p-6 min-h-screen text-white">
            <div className="mx-auto max-w-7xl">
                <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-4 mb-8">
                    <div>
                        <h1 className="bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 font-extrabold text-transparent text-3xl">
                            Registrations
                        </h1>
                        <p className="text-gray-400 text-sm">
                            All registrations (IEEE certificate uploaded entries are highlighted)
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-white/10 border-b">
                                <div className="bg-white/10 rounded-xl w-40 h-6" />
                                <div className="bg-white/10 mt-3 rounded-xl w-24 h-4" />
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                                <div className="bg-white/10 rounded-xl h-14" />
                            </div>
                        </div>

                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-white/10 border-b">
                                <div className="bg-white/10 rounded-xl w-28 h-6" />
                                <div className="bg-white/10 mt-3 rounded-xl w-60 h-4" />
                            </div>
                            <div className="p-4">
                                <div className="bg-white/10 rounded-2xl h-[62vh]" />
                            </div>
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-500/10 shadow-lg p-6 border border-red-400/30 rounded-2xl text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
                        {/* LEFT LIST */}
                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 border-white/10 border-b">
                                <div className="flex justify-between items-end gap-3">
                                    <div>
                                        <div className="text-gray-400 text-sm">Total</div>
                                        <div className="font-bold text-white text-2xl">{visibleRows.length}</div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setMemberFilter('all')}
                                                className={`px-2 py-1 border rounded-full font-medium text-xs transition ${memberFilter === 'all' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/15'}`}
                                            >
                                                All: {counts.total}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMemberFilter('ieee')}
                                                className={`px-2 py-1 border rounded-full font-medium text-xs transition ${memberFilter === 'ieee' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/15'}`}
                                            >
                                                IEEE: {counts.ieee}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMemberFilter('nonIeee')}
                                                className={`px-2 py-1 border rounded-full font-medium text-xs transition ${memberFilter === 'nonIeee' ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30' : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/15'}`}
                                            >
                                                Non-IEEE: {counts.nonIeee}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-2">
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search..."
                                            className="bg-white/5 px-4 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500 text-sm"
                                        />
                                        <button
                                            onClick={downloadExcel}
                                            className="flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 shadow-lg px-3 py-1.5 rounded-2xl font-bold text-white hover:scale-105 transition-all"
                                        >
                                            <span>Download Excel (.xlsx)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
                                {visibleRows.length === 0 ? (
                                    <div className="p-6 text-gray-400">No registrations found.</div>
                                ) : (
                                    visibleRows.map((r) => {
                                        const isActive = String(selectedId) === String(r._id);
                                        const title = r.isTeam ? (r.teamName || 'Team') : (r.fullName || 'Participant');
                                        const hasCert = Boolean(r.hasIeeeCertificate);
                                        const registrationStatus = r.status || 'unknown';
                                        const paymentStatus = r.payment?.status || 'not_started';

                                        const regBadgeClass =
                                            registrationStatus === 'confirmed'
                                                ? 'bg-green-500/10 text-green-400 border border-green-400/20'
                                                : registrationStatus === 'cancelled'
                                                    ? 'bg-red-500/10 text-red-400 border border-red-400/20'
                                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/20';

                                        const payBadgeClass =
                                            paymentStatus === 'captured'
                                                ? 'bg-green-500/10 text-green-400 border border-green-400/20'
                                                : paymentStatus === 'failed'
                                                    ? 'bg-red-500/10 text-red-400 border border-red-400/20'
                                                    : paymentStatus === 'created'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-400/20'
                                                        : 'bg-gray-500/10 text-gray-400 border border-gray-400/20';

                                        return (
                                            <button
                                                key={r._id}
                                                type="button"
                                                onClick={() => setSelectedId(r._id)}
                                                className={`w-full text-left p-4 transition-all hover:bg-white/10 ${isActive ? 'bg-white/10' : ''} ${hasCert ? 'border-l-4 border-cyan-400' : 'border-l-4 border-transparent'}`}
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <div className="font-semibold text-white">{title}</div>
                                                        <div className="mt-1 text-gray-400 text-sm">
                                                            Leader: {r.fullName} | {r.email} | {r.phone}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${regBadgeClass}`}>
                                                                Registration: {registrationStatus}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${payBadgeClass}`}>
                                                                Payment: {paymentStatus}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-gray-600 text-sm">
                                                            College: {r.college} {r.ieeeId ? `| IEEE ID: ${r.ieeeId}` : ''}
                                                        </div>
                                                        <div className={`mt-1 text-sm ${hasCert ? 'text-green-700' : 'text-gray-500'}`}>
                                                            {hasCert ? 'IEEE Certificate: Uploaded' : 'IEEE Certificate: Not uploaded'}
                                                        </div>
                                                    </div>
                                                    <div className="font-mono text-gray-500 text-xs">{r.registrationId}</div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* RIGHT PREVIEW */}
                        <div className="bg-white/5 shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="flex justify-between items-center gap-3 p-4 border-white/10 border-b">
                                <div>
                                    <div className="font-semibold text-white">Preview</div>
                                    <div className="text-gray-400 text-sm">
                                        {previewRecord ? (
                                            <span>
                                                {previewRecord.isTeam ? (previewRecord.teamName || 'Team') : previewRecord.fullName}
                                            </span>
                                        ) : (
                                            <span>Select a record to preview</span>
                                        )}
                                    </div>
                                </div>

                                {previewRecord && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-white/10 px-2 py-1 rounded-full font-medium text-gray-300 text-xs">
                                            Registration: {previewRecord.status || 'unknown'}
                                        </span>
                                        <span className="bg-white/10 px-2 py-1 rounded-full font-medium text-gray-300 text-xs">
                                            Payment: {previewRecord.payment?.status || 'not_started'}
                                        </span>
                                    </div>
                                )}

                                {previewRecord && hasPreviewCertificate && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (certificateBlobUrl) {
                                                window.open(certificateBlobUrl, '_blank', 'noreferrer');
                                                return;
                                            }
                                            setPreviewTab('certificate');
                                        }}
                                        className="bg-linear-to-r from-blue-500 to-cyan-500 shadow-lg px-4 py-2 rounded-xl font-medium text-white text-sm hover:scale-105 transition"
                                    >
                                        View in New Tab
                                    </button>
                                )}

                                {previewRecord && (
                                    <button
                                        type="button"
                                        disabled={approveLoading || (previewRecord.status || '').toString().toLowerCase() === 'confirmed'}
                                        onClick={handleFinalApprove}
                                        className={`shadow-lg px-4 py-2 rounded-xl font-medium text-white text-sm transition ${approveLoading || (previewRecord.status || '').toString().toLowerCase() === 'confirmed' ? 'bg-white/10 opacity-50 cursor-not-allowed' : 'bg-linear-to-r from-emerald-500 to-teal-600 hover:scale-105'}`}
                                    >
                                        {approveLoading ? 'Confirming...' : 'Final Confirm Payment'}
                                    </button>
                                )}
                            </div>

                            <div className="bg-black/40 h-[70vh]">
                                {!previewRecord ? (
                                    <div className="flex justify-center items-center h-full text-gray-400">No preview</div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-2 p-3 border-white/10 border-b">
                                            <button
                                                type="button"
                                                onClick={() => setPreviewTab('details')}
                                                className={`px-3 py-1.5 rounded-xl text-sm transition ${previewTab === 'details' ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                                            >
                                                Details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewTab('certificate')}
                                                disabled={!hasPreviewCertificate}
                                                className={`px-3 py-1.5 rounded-xl text-sm transition ${previewTab === 'certificate' ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'} ${!hasPreviewCertificate ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                Certificate
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewTab('payment')}
                                                disabled={!hasPreviewPaymentProof}
                                                className={`px-3 py-1.5 rounded-xl text-sm transition ${previewTab === 'payment' ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'} ${!hasPreviewPaymentProof ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                Payment Proof
                                            </button>
                                        </div>

                                        {previewTab === 'certificate' ? (
                                            hasPreviewCertificate ? (
                                                certificateLoading ? (
                                                    <div className="flex justify-center items-center text-gray-400 grow">
                                                        Loading certificate...
                                                    </div>
                                                ) : certificateError ? (
                                                    <div className="flex justify-center items-center text-red-300 grow">
                                                        {certificateError}
                                                    </div>
                                                ) : certificateBlobUrl ? (
                                                    <iframe
                                                        src={certificateBlobUrl}
                                                        title="IEEE Certificate Preview"
                                                        className="w-full grow"
                                                    />
                                                ) : (
                                                    <div className="flex justify-center items-center text-gray-400 grow">
                                                        No preview available
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex justify-center items-center text-gray-400 grow">
                                                    No certificate uploaded for this registration
                                                </div>
                                            )
                                        ) : previewTab === 'payment' ? (
                                            hasPreviewPaymentProof ? (
                                                paymentLoading ? (
                                                    <div className="flex justify-center items-center text-gray-400 grow">
                                                        Loading payment proof...
                                                    </div>
                                                ) : paymentError ? (
                                                    <div className="flex justify-center items-center text-red-300 grow">
                                                        {paymentError}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col h-full">
                                                        <div className="space-y-4 p-4 overflow-y-auto">
                                                            {approveSuccess && (
                                                                <div className="bg-emerald-500/10 p-4 border border-emerald-400/20 rounded-xl text-emerald-200 text-sm">
                                                                    {approveSuccess}
                                                                </div>
                                                            )}
                                                            {approveError && (
                                                                <div className="bg-red-500/10 p-4 border border-red-400/20 rounded-xl text-red-300 text-sm">
                                                                    {approveError}
                                                                </div>
                                                            )}

                                                            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                                                                {renderField('UTR Number', previewRecord?.payment?.utrNumber || previewRecord?.utrNumber)}
                                                                {renderField('Status', previewRecord?.status)}
                                                            </div>
                                                        </div>

                                                        <div className="bg-black/40 grow">
                                                            {paymentBlobUrl ? (
                                                                <iframe
                                                                    src={paymentBlobUrl}
                                                                    title="Payment Proof Preview"
                                                                    className="w-full h-full"
                                                                />
                                                            ) : (
                                                                <div className="flex justify-center items-center h-full text-gray-400">
                                                                    No preview available
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex justify-center items-center text-gray-400 grow">
                                                    No payment proof uploaded for this registration
                                                </div>
                                            )
                                        ) : (
                                            <div className="space-y-4 p-4 overflow-y-auto grow">
                                                {detailsLoading && (
                                                    <div className="bg-white/5 p-4 border border-white/10 rounded-xl text-gray-300 text-sm">
                                                        Loading details...
                                                    </div>
                                                )}

                                                {!detailsLoading && detailsError && (
                                                    <div className="bg-red-500/10 p-4 border border-red-400/20 rounded-xl text-red-300 text-sm">
                                                        {detailsError}
                                                    </div>
                                                )}

                                                <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                                                    {renderField('Registration ID', previewRecord.registrationId)}
                                                    {renderField('Event', previewRecord.event)}
                                                    {renderField('Type', previewRecord.isTeam ? 'Team' : 'Individual')}
                                                    {renderField('Team Name', previewRecord.teamName)}
                                                    {renderField('Full Name', previewRecord.fullName)}
                                                    {renderField('Email', previewRecord.email)}
                                                    {renderField('Phone', previewRecord.phone)}
                                                    {renderField('College', previewRecord.college)}
                                                    {renderField('IEEE Member', previewRecord.ieeeMember)}
                                                    {renderField('IEEE ID', previewRecord.ieeeId)}
                                                    {renderField('Status', previewRecord.status)}
                                                    {renderField('Payment Status', previewRecord.payment?.status)}
                                                    {renderField('Payment Amount', previewRecord.payment?.amount)}
                                                    {renderField('Certificate Uploaded', hasPreviewCertificate)}
                                                </div>

                                                {previewRecord.isTeam && Array.isArray(previewRecord.teamMembers) && previewRecord.teamMembers.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="font-semibold text-white">Group Members</div>
                                                        <div className="gap-3 grid grid-cols-1">
                                                            {previewRecord.teamMembers.map((m, idx) => (
                                                                <div key={`${m?.email || m?.phone || idx}`} className="bg-white/5 p-3 border border-white/10 rounded-xl">
                                                                    <div className="text-gray-400 text-xs">Member {idx + 2}</div>
                                                                    <div className="gap-2 grid grid-cols-1 sm:grid-cols-3 mt-2">
                                                                        <div>
                                                                            <div className="text-gray-400 text-xs">Name</div>
                                                                            <div className="font-medium text-white text-sm wrap-break-word">{renderValue(m?.name)}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-gray-400 text-xs">Email</div>
                                                                            <div className="font-medium text-white text-sm wrap-break-word">{renderValue(m?.email)}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-gray-400 text-xs">Phone</div>
                                                                            <div className="font-medium text-white text-sm wrap-break-word">{renderValue(m?.phone)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

































// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// export default function IeeeCertificatesPage() {
//     const router = useRouter();
//     const API_URL = useMemo(() => '/api', []);

//     // --- State Management ---
//     const [token, setToken] = useState('');
//     const [authChecked, setAuthChecked] = useState(false);
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedId, setSelectedId] = useState('');
//     const [selectedDetails, setSelectedDetails] = useState(null);
//     const [detailsLoading, setDetailsLoading] = useState(false);
//     const [detailsError, setDetailsError] = useState('');
//     const [previewTab, setPreviewTab] = useState('details');
//     const [memberFilter, setMemberFilter] = useState('all');
//     const [search, setSearch] = useState('');

//     const [certificateBlobUrl, setCertificateBlobUrl] = useState('');
//     const [certificateLoading, setCertificateLoading] = useState(false);
//     const [certificateError, setCertificateError] = useState('');

//     // --- Authentication ---
//     useEffect(() => {
//         try {
//             const t = localStorage.getItem('adminToken') || '';
//             if (!t) {
//                 router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
//                 return;
//             }
//             setToken(t);
//         } finally {
//             setAuthChecked(true);
//         }
//     }, [router]);

//     // --- Fetch Rows ---
//     useEffect(() => {
//         const fetchRows = async () => {
//             if (!token) return;
//             try {
//                 setLoading(true);
//                 const res = await fetch(`${API_URL}/admin/registrations`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 const json = await res.json();
//                 if (!res.ok || !json?.success) throw new Error(json?.message || 'Failed to fetch');
//                 setRows(Array.isArray(json.data) ? json.data : []);
//             } catch (e) {
//                 setError(e.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRows();
//     }, [API_URL, token]);

//     // --- Fetch Specific Details for Sidebar ---
//     useEffect(() => {
//         const fetchDetails = async () => {
//             if (!token || !selectedId) return;
//             try {
//                 setDetailsLoading(true);
//                 setDetailsError('');
//                 const res = await fetch(`${API_URL}/admin/registrations/${selectedId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 const json = await res.json();
//                 if (!res.ok) throw new Error(json?.message || 'Details error');
//                 setSelectedDetails(json?.data || null);
//             } catch (e) {
//                 setDetailsError(e.message);
//             } finally {
//                 setDetailsLoading(false);
//             }
//         };
//         fetchDetails();
//     }, [API_URL, selectedId, token]);

//     // --- Filter Logic ---
//     const filteredRows = useMemo(() => {
//         const q = (search || '').trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((r) => {
//             const haystack = [r?.registrationId, r?.fullName, r?.email, r?.phone, r?.college, r?.teamName]
//                 .filter(Boolean).map(v => String(v).toLowerCase()).join(' | ');
//             return haystack.includes(q);
//         });
//     }, [rows, search]);

//     const visibleRows = useMemo(() => {
//         if (memberFilter === 'all') return filteredRows;
//         return filteredRows.filter((r) => {
//             const isIeee = (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
//             return memberFilter === 'ieee' ? isIeee : !isIeee;
//         });
//     }, [filteredRows, memberFilter]);

//     const counts = useMemo(() => {
//         let ieee = 0;
//         let nonIeee = 0;
//         for (const r of filteredRows) {
//             const isIeee = (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
//             if (isIeee) ieee += 1; else nonIeee += 1;
//         }
//         return { total: filteredRows.length, ieee, nonIeee };
//     }, [filteredRows]);

//     // --- EXCEL LOGIC (QR Code Embedded) ---
//     const downloadExcel = async () => {
//         const workbook = new ExcelJS.Workbook();
        
//         const generateSheet = async (rowsToExport, sheetName) => {
//             const worksheet = workbook.addWorksheet(sheetName);
//             const maxTeamMembers = Math.max(0, ...rowsToExport.map((r) => 
//                 Array.isArray(r?.teamMembers) ? r.teamMembers.length : 0
//             ));

//             const columns = [
//                 { header: 'Registration ID', key: 'registrationId', width: 20 },
//                 { header: 'Full Name', key: 'fullName', width: 25 },
//                 { header: 'Email', key: 'email', width: 30 },
//                 { header: 'Phone', key: 'phone', width: 15 },
//                 { header: 'College', key: 'college', width: 30 },
//                 { header: 'Event', key: 'event', width: 20 },
//                 { header: 'IEEE Member', key: 'ieeeMember', width: 12 },
//                 { header: 'IEEE ID', key: 'ieeeId', width: 15 },
//                 { header: 'Team Name', key: 'teamName', width: 25 },
//                 { header: 'QR IMAGE (For ID Card)', key: 'qrCode', width: 25 }, 
//             ];

//             for (let i = 0; i < maxTeamMembers; i++) {
//                 columns.push(
//                     { header: `M${i + 2} Name`, key: `m${i}Name`, width: 20 },
//                     { header: `M${i + 2} Email`, key: `m${i}Email`, width: 25 }
//                 );
//             }
//             worksheet.columns = columns;

//             for (let i = 0; i < rowsToExport.length; i++) {
//                 const r = rowsToExport[i];
//                 const members = Array.isArray(r?.teamMembers) ? r.teamMembers : [];
//                 const memberFields = {};
//                 members.forEach((m, idx) => {
//                     memberFields[`m${idx}Name`] = m?.name;
//                     memberFields[`m${idx}Email`] = m?.email;
//                 });

//                 const currentRow = worksheet.addRow({
//                     registrationId: r?.registrationId,
//                     fullName: r?.fullName,
//                     email: r?.email,
//                     phone: r?.phone,
//                     college: r?.college,
//                     event: r?.event,
//                     ieeeMember: r?.ieeeMember,
//                     ieeeId: r?.ieeeId,
//                     teamName: r?.teamName,
//                     ...memberFields
//                 });

//                 currentRow.height = 100; // Large height for scannable QR
//                 currentRow.alignment = { vertical: 'middle', horizontal: 'left' };

//                 if (r?.qrCode) {
//                     try {
//                         const base64Data = r.qrCode.split('base64,')[1] || r.qrCode;
//                         const imageId = workbook.addImage({ base64: base64Data, extension: 'png' });
//                         worksheet.addImage(imageId, {
//                             tl: { col: 9.1, row: i + 1.1 },
//                             ext: { width: 120, height: 120 }
//                         });
//                     } catch (err) { console.error("Img error", err); }
//                 }
//             }
//             worksheet.getRow(1).font = { bold: true };
//         };

//         const ieeeRows = filteredRows.filter(r => (r?.ieeeMember || 'no').toLowerCase() === 'yes');
//         const nonIeeeRows = filteredRows.filter(r => (r?.ieeeMember || 'no').toLowerCase() !== 'yes');

//         if (ieeeRows.length > 0) await generateSheet(ieeeRows, 'IEEE Members');
//         if (nonIeeeRows.length > 0) await generateSheet(nonIeeeRows, 'Non-IEEE Members');

//         const buffer = await workbook.xlsx.writeBuffer();
//         saveAs(new Blob([buffer]), `Final_Registrations_${new Date().getTime()}.xlsx`);
//     };

//     // --- UI Helpers ---
//     const renderValue = (v) => (v === null || v === undefined ? '-' : String(v));
//     const renderField = (label, value) => (
//         <div className="bg-white/5 p-3 border border-white/10 rounded-xl">
//             <div className="text-gray-400 text-xs">{label}</div>
//             <div className="font-medium text-white text-sm break-all">{renderValue(value)}</div>
//         </div>
//     );

//     const previewRecord = selectedDetails || visibleRows.find(x => x._id === selectedId);

//     if (!authChecked) return <div className="bg-black p-10 min-h-screen text-white">Authenticating...</div>;

//     return (
//         <div className="bg-linear-to-r from-[#0f172a] via-[#020617] to-black p-6 min-h-screen font-sans text-white">
//             <div className="mx-auto max-w-7xl">
//                 {/* Header */}
//                 <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 font-extrabold text-transparent text-4xl">
//                             Admin Dashboard
//                         </h1>
//                         <p className="mt-1 text-gray-400">Manage event registrations and export unique QR IDs.</p>
//                     </div>
//                     <button 
//                         onClick={downloadExcel}
//                         className="flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 shadow-lg px-6 py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all"
//                     >
//                         <span>Download Excel (.xlsx)</span>
//                     </button>
//                 </div>

//                 <div className="gap-6 grid grid-cols-1 lg:grid-cols-12">
//                     {/* Left: Table/List (7 Cols) */}
//                     <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
//                         <div className="flex flex-col gap-4 p-5 border-white/10 border-b">
//                             <div className="flex justify-between items-center">
//                                 <span className="font-bold text-2xl">Listings ({visibleRows.length})</span>
//                                 <input 
//                                     value={search} onChange={(e) => setSearch(e.target.value)}
//                                     placeholder="Search name, ID, or college..."
//                                     className="bg-white/10 px-4 py-2 border border-white/10 rounded-xl outline-none ring-cyan-500 focus:ring-2 w-1/2 text-sm"
//                                 />
//                             </div>
//                             <div className="flex gap-2">
//                                 {['all', 'ieee', 'nonIeee'].map(f => (
//                                     <button 
//                                         key={f} onClick={() => setMemberFilter(f)}
//                                         className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${memberFilter === f ? 'bg-cyan-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}
//                                     >
//                                         {f.toUpperCase()}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
//                             {visibleRows.length === 0 ? (
//                                 <div className="p-20 text-gray-500 text-center">No records match your search.</div>
//                             ) : (
//                                 visibleRows.map((r) => (
//                                     <div 
//                                         key={r._id} onClick={() => setSelectedId(r._id)}
//                                         className={`p-5 cursor-pointer flex justify-between items-center transition-all ${selectedId === r._id ? 'bg-cyan-500/10 border-l-4 border-cyan-500' : 'hover:bg-white/5'}`}
//                                     >
//                                         <div>
//                                             <div className="font-bold text-lg">{r.teamName || r.fullName}</div>
//                                             <div className="mt-1 text-gray-400 text-xs">{r.college} • {r.event}</div>
//                                         </div>
//                                         <div className="text-right">
//                                             <div className="mb-1 font-mono text-cyan-400 text-xs">{r.registrationId}</div>
//                                             <span className={`text-[10px] px-2 py-0.5 rounded-md ${r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
//                                                 {r.status?.toUpperCase()}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>

//                     {/* Right: Detailed Preview (5 Cols) */}
//                     <div className="space-y-6 lg:col-span-5">
//                         <div className="top-6 sticky bg-white/5 backdrop-blur-md p-6 border border-white/10 rounded-3xl">
//                             <h2 className="flex justify-between items-center mb-6 font-bold text-xl">
//                                 <span>Record Details</span>
//                                 {previewRecord?.qrCode && <span className="font-normal text-green-400 text-xs">QR Verified</span>}
//                             </h2>

//                             {selectedId ? (
//                                 <div className="space-y-6">
//                                     {/* QR Code Section */}
//                                     <div className="flex justify-center bg-white shadow-2xl mx-auto p-4 rounded-2xl w-fit">
//                                         {previewRecord?.qrCode ? (
//                                             <img src={previewRecord.qrCode} alt="QR" className="w-40 h-40" />
//                                         ) : (
//                                             <div className="flex items-center w-40 h-40 text-black text-xs text-center">No QR data provided</div>
//                                         )}
//                                     </div>

//                                     {/* Information Grid */}
//                                     <div className="gap-3 grid grid-cols-2">
//                                         {renderField('Reg ID', previewRecord?.registrationId)}
//                                         {renderField('Event', previewRecord?.event)}
//                                         {renderField('Leader', previewRecord?.fullName)}
//                                         {renderField('Email', previewRecord?.email)}
//                                         {renderField('Phone', previewRecord?.phone)}
//                                         {renderField('IEEE ID', previewRecord?.ieeeId)}
//                                         <div className="col-span-2">
//                                             {renderField('College', previewRecord?.college)}
//                                         </div>
//                                     </div>

//                                     {/* Team Members List */}
//                                     {previewRecord?.isTeam && previewRecord?.teamMembers?.length > 0 && (
//                                         <div className="mt-4">
//                                             <p className="mb-2 font-bold text-gray-400 text-xs uppercase tracking-widest">Team Members</p>
//                                             <div className="space-y-2">
//                                                 {previewRecord.teamMembers.map((m, idx) => (
//                                                     <div key={idx} className="flex justify-between bg-white/5 p-3 border border-white/5 rounded-xl text-sm">
//                                                         <span className="text-white">{m.name}</span>
//                                                         <span className="text-gray-500">{m.phone}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="p-20 text-gray-500 text-center italic">Select a participant to view QR and details.</div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
















// 'use client';

// import { useEffect, useMemo, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import { 
//   Search, Download, User, Users, ShieldCheck, 
//   Mail, Phone, School, CreditCard, QrCode, 
//   FileText, ExternalLink, RefreshCw, ChevronRight,
//   Filter, AlertCircle, CheckCircle2, XCircle
// } from 'lucide-react';

// /**
//  * IEEE REGISTRATION & QR MANAGEMENT DASHBOARD
//  * Features:
//  * - Scannable QR Generation for Excel & Web
//  * - Batch XLSX Export with Embedded Images
//  * - IEEE Certificate PDF/Image Preview
//  * - Real-time Multi-field Search
//  * - Team & Individual Data Decomposition
//  */

// export default function AdminDashboard() {
//   const router = useRouter();
//   const API_URL = useMemo(() => '/api', []);

//   // --- 1. CORE STATE ---
//   const [token, setToken] = useState('');
//   const [authChecked, setAuthChecked] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Selection State
//   const [selectedId, setSelectedId] = useState('');
//   const [selectedDetails, setSelectedDetails] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [detailsError, setDetailsError] = useState('');
  
//   // Preview & UI State
//   const [previewTab, setPreviewTab] = useState('details'); 
//   const [memberFilter, setMemberFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [isExporting, setIsExporting] = useState(false);

//   // Certificate Management
//   const [certificateBlobUrl, setCertificateBlobUrl] = useState('');
//   const [certificateLoading, setCertificateLoading] = useState(false);
//   const [certificateError, setCertificateError] = useState('');

//   // --- 2. AUTHENTICATION LOGIC ---
//   useEffect(() => {
//     const checkAuth = () => {
//       try {
//         const t = localStorage.getItem('adminToken') || '';
//         if (!t) {
//           router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
//           return;
//         }
//         setToken(t);
//       } finally {
//         setAuthChecked(true);
//       }
//     };
//     checkAuth();
//   }, [router]);

//   // --- 3. DATA FETCHING (MASTER LIST) ---
//   const fetchRows = useCallback(async () => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       setError('');
//       const res = await fetch(`${API_URL}/admin/registrations`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const json = await res.json();

//       if (res.status === 401 || res.status === 403) {
//         localStorage.removeItem('adminToken');
//         router.push('/admin/login');
//         return;
//       }

//       if (!res.ok || !json?.success) throw new Error(json?.message || 'Failed to sync registrations');
//       setRows(Array.isArray(json.data) ? json.data : []);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, token, router]);

//   useEffect(() => { fetchRows(); }, [fetchRows]);

//   // --- 4. DATA FETCHING (DETAILED RECORD) ---
//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!token || !selectedId) return;
//       try {
//         setDetailsLoading(true);
//         setDetailsError('');
//         const res = await fetch(`${API_URL}/admin/registrations/${selectedId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const json = await res.json();
//         if (!res.ok) throw new Error(json?.message || 'Error loading profile details');
//         setSelectedDetails(json?.data || null);
//       } catch (e) {
//         setDetailsError(e.message);
//       } finally {
//         setDetailsLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [API_URL, selectedId, token]);

//   // --- 5. DATA FETCHING (CERTIFICATE BLOB) ---
//   useEffect(() => {
//     const fetchCertificate = async () => {
//       if (!token || !selectedId || previewTab !== 'certificate') return;
//       try {
//         setCertificateLoading(true);
//         setCertificateError('');
//         if (certificateBlobUrl) URL.revokeObjectURL(certificateBlobUrl);

//         const res = await fetch(`${API_URL}/admin/registrations/${selectedId}/ieee-certificate`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (!res.ok) throw new Error('Membership document not found on server');
        
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setCertificateBlobUrl(url);
//       } catch (e) {
//         setCertificateError(e.message);
//       } finally {
//         setCertificateLoading(false);
//       }
//     };
//     fetchCertificate();
//   }, [selectedId, previewTab, token, API_URL]);

//   // --- 6. FILTERING & SEARCH ENGINE ---
//   const filteredRows = useMemo(() => {
//     let result = rows;
    
//     // Member Filter (IEEE vs General)
//     if (memberFilter !== 'all') {
//       result = result.filter(r => {
//         const isIeee = (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
//         return memberFilter === 'ieee' ? isIeee : !isIeee;
//       });
//     }

//     // Search Keywords
//     const q = (search || '').trim().toLowerCase();
//     if (!q) return result;

//     return result.filter((r) => {
//       const haystack = [
//         r?.registrationId, 
//         r?.fullName, 
//         r?.email, 
//         r?.phone, 
//         r?.college, 
//         r?.teamName,
//         r?.ieeeId
//       ].filter(Boolean).map(v => String(v).toLowerCase()).join(' ');
//       return haystack.includes(q);
//     });
//   }, [rows, search, memberFilter]);

//   const counts = useMemo(() => {
//     const total = rows.length;
//     const ieee = rows.filter(r => (r?.ieeeMember || 'no').toLowerCase() === 'yes').length;
//     return { total, ieee, nonIeee: total - ieee };
//   }, [rows]);

//   // --- 7. EXCEL ENGINE (SCANNABLE QR CODES) ---
//   const downloadExcel = async () => {
//     if (filteredRows.length === 0) return;
//     setIsExporting(true);
//     try {
//       const workbook = new ExcelJS.Workbook();
      
//       const generateSheet = async (data, sheetName) => {
//         const ws = workbook.addWorksheet(sheetName);
        
//         // Dynamic Member Columns Calculation
//         const maxM = Math.max(0, ...data.map(r => r.teamMembers?.length || 0));

//         const columns = [
//           { header: 'REGISTRATION ID', key: 'regId', width: 20 },
//           { header: 'TEAM NAME', key: 'team', width: 25 },
//           { header: 'LEADER NAME', key: 'leader', width: 25 },
//           { header: 'EMAIL', key: 'email', width: 35 },
//           { header: 'PHONE', key: 'phone', width: 18 },
//           { header: 'COLLEGE', key: 'college', width: 35 },
//           { header: 'EVENT', key: 'event', width: 25 },
//           { header: 'IEEE ID', key: 'ieeeId', width: 15 },
//           { header: 'QR CODE (SCAN FOR ID)', key: 'qr', width: 28 }, 
//         ];

//         for (let i = 0; i < maxM; i++) {
//           columns.push({ header: `MEMBER ${i+2} NAME`, key: `m${i}name`, width: 20 });
//           columns.push({ header: `MEMBER ${i+2} PHONE`, key: `m${i}phone`, width: 18 });
//         }
//         ws.columns = columns;

//         // Populate Data & Images
//         for (let i = 0; i < data.length; i++) {
//           const r = data[i];
//           const members = r.teamMembers || [];
//           const memberMap = {};
//           members.forEach((m, idx) => {
//             memberMap[`m${idx}name`] = m.name;
//             memberMap[`m${idx}phone`] = m.phone;
//           });

//           const row = ws.addRow({
//             regId: r.registrationId,
//             team: r.teamName || 'N/A',
//             leader: r.fullName,
//             email: r.email,
//             phone: r.phone,
//             college: r.college,
//             event: r.event,
//             ieeeId: r.ieeeId || '-',
//             ...memberMap
//           });

//           row.height = 115; // Vertical space for QR
//           row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

//           if (r?.qrCode) {
//             try {
//               // Clean Base64 Data
//               const base64Clean = r.qrCode.includes('base64,') ? r.qrCode.split('base64,')[1] : r.qrCode;
//               const imgId = workbook.addImage({ base64: base64Clean, extension: 'png' });
              
//               // Anchor to QR column (Column index 9)
//               ws.addImage(imgId, {
//                 tl: { col: 8.2, row: i + 1.15 },
//                 ext: { width: 135, height: 135 }
//               });
//             } catch (err) { console.error("QR Embed Failed for ID:", r.registrationId); }
//           }
//         }

//         // Header Styling
//         ws.getRow(1).height = 30;
//         ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
//         ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
//         ws.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
//       };

//       // Split sheets
//       const ieeeData = filteredRows.filter(r => (r?.ieeeMember || 'no').toLowerCase() === 'yes');
//       const nonIeeeData = filteredRows.filter(r => (r?.ieeeMember || 'no').toLowerCase() !== 'yes');

//       if (ieeeData.length > 0) await generateSheet(ieeeData, 'IEEE Participants');
//       if (nonIeeeData.length > 0) await generateSheet(nonIeeeData, 'General Participants');

//       const buffer = await workbook.xlsx.writeBuffer();
//       saveAs(new Blob([buffer]), `Event_Master_List_${new Date().toISOString().split('T')[0]}.xlsx`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // --- 8. UI RENDER HELPERS ---
//   const getStatusColor = (status) => {
//     const s = status?.toLowerCase();
//     if (s === 'confirmed' || s === 'captured') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
//     if (s === 'pending' || s === 'created') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
//     return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
//   };

//   const renderField = (Icon, label, value) => (
//     <div className="group bg-slate-800/40 p-4 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-colors">
//       <div className="flex items-center gap-2 mb-1">
//         <Icon size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
//         <span className="font-black text-[10px] text-slate-500 uppercase tracking-widest">{label}</span>
//       </div>
//       <p className="font-semibold text-white text-sm truncate select-all">{value || 'Not Provided'}</p>
//     </div>
//   );

//   const previewRecord = selectedDetails || rows.find(x => x._id === selectedId);

//   if (!authChecked) return (
//     <div className="flex justify-center items-center bg-slate-950 min-h-screen">
//       <RefreshCw className="text-blue-500 animate-spin" size={48} />
//     </div>
//   );

//   return (
//     <div className="bg-slate-950 selection:bg-blue-500/30 p-4 md:p-8 lg:p-12 min-h-screen text-slate-200">
//       <div className="mx-auto max-w-[1600px]">
        
//         {/* TOP NAVIGATION BAR */}
//         <header className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-8 mb-12 pb-10 border-slate-800 border-b">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-600 p-2 rounded-xl">
//                 <ShieldCheck className="text-white" size={24} />
//               </div>
//               <h1 className="font-black text-white text-4xl tracking-tighter">ADMIN COMMAND</h1>
//             </div>
//             <p className="flex items-center gap-2 font-medium text-slate-500">
//               <Users size={16} /> Total Registered: <span className="text-blue-400">{counts.total}</span>
//               <span className="mx-2 text-slate-800">|</span>
//               <CheckCircle2 size={16} className="text-emerald-500" /> IEEE Verified: <span className="text-emerald-400">{counts.ieee}</span>
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
//             <div className="group relative flex-1 lg:w-96">
//               <Search className="top-1/2 left-4 absolute text-slate-500 group-focus-within:text-blue-400 transition-colors -translate-y-1/2" size={18} />
//               <input 
//                 value={search} onChange={e => setSearch(e.target.value)} 
//                 placeholder="Find team, participant or reg ID..." 
//                 className="bg-slate-900 py-4 pr-6 pl-12 border border-slate-800 rounded-3xl outline-none ring-blue-600/50 focus:ring-2 w-full font-medium text-sm transition-all" 
//               />
//             </div>
//             <button 
//               onClick={downloadExcel} 
//               disabled={isExporting}
//               className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 shadow-2xl shadow-blue-900/40 px-8 py-4 rounded-3xl font-black text-white active:scale-95 transition-all"
//             >
//               {isExporting ? <RefreshCw className="animate-spin" /> : <Download size={20} />}
//               <span>{isExporting ? 'EXPORTING...' : 'MASTER XLSX'}</span>
//             </button>
//           </div>
//         </header>

//         <div className="gap-10 grid grid-cols-1 lg:grid-cols-12">
          
//           {/* LEFT: MASTER LISTING PANEL */}
//           <section className="flex flex-col gap-6 lg:col-span-5">
//             <div className="flex flex-col bg-slate-900/40 shadow-2xl backdrop-blur-2xl border border-slate-800 rounded-[40px] h-[75vh] overflow-hidden">
              
//               {/* Filter Tabs */}
//               <div className="flex justify-between items-center bg-slate-900/80 p-6 border-slate-800 border-b">
//                 <div className="flex bg-slate-950 p-1.5 border border-slate-800 rounded-2xl">
//                   {['all', 'ieee', 'nonIeee'].map(f => (
//                     <button 
//                       key={f} onClick={() => setMemberFilter(f)} 
//                       className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${memberFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
//                     >
//                       {f.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//                 <button onClick={fetchRows} className="hover:bg-slate-800 p-2 rounded-xl transition-colors">
//                   <RefreshCw size={18} className={loading ? "animate-spin text-blue-400" : "text-slate-500"} />
//                 </button>
//               </div>

//               {/* Scrollable Rows */}
//               <div className="flex-1 overflow-y-auto custom-scrollbar">
//                 {loading && rows.length === 0 ? (
//                   <div className="flex flex-col justify-center items-center gap-4 h-full">
//                     <div className="border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
//                     <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Synchronizing Database</span>
//                   </div>
//                 ) : filteredRows.length === 0 ? (
//                   <div className="flex flex-col justify-center items-center p-12 h-full text-center">
//                     <div className="bg-slate-800/50 mb-4 p-6 rounded-full">
//                       <Filter size={48} className="text-slate-600" />
//                     </div>
//                     <h3 className="font-bold text-slate-400 text-lg">No matches found</h3>
//                     <p className="mt-1 text-slate-600 text-sm">Try adjusting your filters or search keywords.</p>
//                   </div>
//                 ) : (
//                   filteredRows.map(r => (
//                     <div 
//                       key={r._id} 
//                       onClick={() => { setSelectedId(r._id); setPreviewTab('details'); }} 
//                       className={`group p-6 cursor-pointer border-b border-slate-800/50 transition-all relative ${selectedId === r._id ? 'bg-blue-600/10 border-l-[6px] border-blue-500' : 'hover:bg-slate-800/30'}`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             {r.isTeam ? <Users size={14} className="text-blue-400" /> : <User size={14} className="text-slate-500" />}
//                             <span className="font-black text-[10px] text-blue-500 uppercase tracking-widest">
//                               {r.teamName || 'Individual Entry'}
//                             </span>
//                           </div>
//                           <h3 className="font-bold text-white group-hover:text-blue-400 text-xl tracking-tight transition-colors">{r.fullName}</h3>
//                           <p className="flex items-center gap-2 font-medium text-slate-500 text-xs">
//                             <School size={12} /> {r.college}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="bg-slate-950 px-3 py-1 border border-slate-800 group-hover:border-blue-500/30 rounded-lg font-mono font-bold text-blue-400 text-xs">
//                             {r.registrationId}
//                           </div>
//                           <div className={`mt-3 text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-tighter ${getStatusColor(r.status)}`}>
//                             {r.status || 'Pending'}
//                           </div>
//                         </div>
//                       </div>
//                       <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity ${selectedId === r._id ? 'opacity-100' : 'opacity-0'}`} />
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* RIGHT: DETAIL PREVIEW PANEL */}
//           <section className="lg:col-span-7">
//             {previewRecord ? (
//               <div className="top-10 sticky flex flex-col bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-800 border-t-slate-700 rounded-[50px] h-[75vh] overflow-hidden">
                
//                 {/* Preview Tabs */}
//                 <nav className="z-10 flex bg-slate-900/90 backdrop-blur-md border-slate-800 border-b">
//                   <button 
//                     onClick={() => setPreviewTab('details')} 
//                     className={`flex-1 flex items-center justify-center gap-3 py-6 text-xs font-black tracking-[0.2em] uppercase transition-all ${previewTab === 'details' ? 'bg-blue-600 text-white shadow-[inset_0_-4px_0_rgba(255,255,255,0.3)]' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
//                   >
//                     <QrCode size={18} /> Profile & QR
//                   </button>
//                   <button 
//                     disabled={!previewRecord?.ieeeId && !hasCertFile}
//                     onClick={() => setPreviewTab('certificate')} 
//                     className={`flex-1 flex items-center justify-center gap-3 py-6 text-xs font-black tracking-[0.2em] uppercase transition-all ${previewTab === 'certificate' ? 'bg-blue-600 text-white shadow-[inset_0_-4px_0_rgba(255,255,255,0.3)]' : 'text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-5 disabled:cursor-not-allowed'}`}
//                   >
//                     <FileText size={18} /> IEEE Certificate
//                   </button>
//                 </nav>

//                 <div className="flex-1 bg-linear-to-b from-slate-900 to-slate-950 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
//                   {previewTab === 'details' ? (
//                     <div className="slide-in-from-bottom-4 space-y-12 animate-in duration-500 fade-in">
                      
//                       {/* Scannable Header Card */}
//                       <div className="flex md:flex-row flex-col items-center gap-10 bg-white/5 p-10 border border-white/10 rounded-[40px]">
//                         <div className="relative">
//                           <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 rounded-[35px] ring-1 ring-slate-200">
//                             <img src={previewRecord.qrCode} alt="Scannable QR" className="w-48 h-48" />
//                           </div>
//                           <div className="-bottom-4 left-1/2 absolute bg-blue-600 shadow-lg px-4 py-1.5 rounded-full font-black text-[10px] text-white whitespace-nowrap -translate-x-1/2">
//                             UNIQUE SCAN ID
//                           </div>
//                         </div>
                        
//                         <div className="space-y-3 md:text-left text-center">
//                           <h2 className="font-black text-white text-4xl uppercase leading-none tracking-tight">{previewRecord.teamName || previewRecord.fullName}</h2>
//                           <div className="flex flex-wrap justify-center md:justify-start gap-2">
//                              <span className="bg-blue-500/20 px-3 py-1 border border-blue-500/20 rounded-lg font-black text-[10px] text-blue-400 uppercase tracking-widest">
//                                {previewRecord.event}
//                              </span>
//                              <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${getStatusColor(previewRecord.status)}`}>
//                                {previewRecord.status || 'Pending'}
//                              </span>
//                           </div>
//                           <div className="flex items-center gap-2 pt-2 font-mono text-slate-400 text-xl">
//                             <QrCode size={20} className="text-blue-500" /> {previewRecord.registrationId}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Primary Info Grid */}
//                       <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                         {renderField(User, 'Primary Leader', previewRecord.fullName)}
//                         {renderField(Mail, 'Email Link', previewRecord.email)}
//                         {renderField(Phone, 'Direct Mobile', previewRecord.phone)}
//                         {renderField(School, 'Educational Inst.', previewRecord.college)}
//                         {renderField(ShieldCheck, 'IEEE Membership', previewRecord.ieeeId || 'Not Registered')}
//                         {renderField(CreditCard, 'Payment Status', previewRecord.payment?.status)}
//                       </div>

//                       {/* Team Composition Section */}
//                       {previewRecord.isTeam && (
//                         <div className="space-y-6">
//                           <div className="flex items-center gap-4">
//                             <div className="flex-1 bg-slate-800 h-px"></div>
//                             <span className="font-black text-[10px] text-slate-500 uppercase tracking-[0.4em]">Team Roster</span>
//                             <div className="flex-1 bg-slate-800 h-px"></div>
//                           </div>
                          
//                           <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
//                             {previewRecord.teamMembers?.map((m, i) => (
//                               <div key={i} className="flex justify-between items-center bg-slate-800/20 hover:bg-blue-600/5 p-5 border border-white/5 rounded-3xl transition-all">
//                                 <div>
//                                   <p className="font-bold text-white text-base">{m.name}</p>
//                                   <p className="font-medium text-[10px] text-slate-500 tracking-wide">{m.email}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-mono text-blue-400 text-xs">{m.phone}</p>
//                                   <span className="font-bold text-[8px] text-slate-600 uppercase tracking-widest">MEMBER {i+2}</span>
//                                 </div>
//                               </div>
//                             ))}
//                             {(!previewRecord.teamMembers || previewRecord.teamMembers.length === 0) && (
//                                 <div className="col-span-full bg-slate-800/10 py-8 border border-slate-800 border-dashed rounded-3xl font-bold text-slate-600 text-center italic">
//                                     No additional team members registered.
//                                 </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     /* CERTIFICATE PREVIEW VIEW */
//                     <div className="flex flex-col h-full animate-in duration-300 zoom-in-95">
//                       <div className="flex justify-between items-center mb-6">
//                         <h3 className="flex items-center gap-3 font-black text-white text-lg">
//                           <ShieldCheck className="text-emerald-500" /> VERIFIED IEEE DOCUMENT
//                         </h3>
//                         {certificateBlobUrl && (
//                           <a 
//                             href={certificateBlobUrl} 
//                             target="_blank" 
//                             rel="noreferrer"
//                             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl font-bold text-white text-xs transition-colors"
//                           >
//                             <ExternalLink size={16} /> OPEN FULLSCREEN
//                           </a>
//                         )}
//                       </div>
                      
//                       <div className="group relative flex-1 bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden">
//                         {certificateLoading ? (
//                           <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-slate-950">
//                             <div className="border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
//                             <p className="font-black text-[10px] text-slate-500 tracking-widest">DECRYPTING DOCUMENT</p>
//                           </div>
//                         ) : certificateError ? (
//                           <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-12 text-center">
//                             <AlertCircle size={48} className="text-rose-500" />
//                             <p className="font-bold text-white">{certificateError}</p>
//                             <button onClick={() => setPreviewTab('details')} className="font-bold text-blue-400 text-sm underline">Go back to details</button>
//                           </div>
//                         ) : (
//                           <iframe 
//                             src={certificateBlobUrl} 
//                             className="grayscale-20 group-hover:grayscale-0 w-full h-full transition-all duration-700" 
//                             title="IEEE Certificate Preview" 
//                           />
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Sidebar Footer Action */}
//                 <div className="flex justify-between items-center bg-slate-900 p-6 border-slate-800 border-t">
//                    <div className="flex items-center gap-3 font-black text-[10px] text-slate-500 tracking-widest">
//                      <AlertCircle size={14} className="text-amber-500" /> 
//                      CONFIDENTIAL PARTICIPANT DATA
//                    </div>
//                    <div className="flex gap-2">
//                       <button className="bg-slate-800 hover:bg-rose-500/20 p-3 rounded-2xl hover:text-rose-400 transition-all">
//                         <RefreshCw size={18} />
//                       </button>
//                       <button className="bg-blue-600 shadow-blue-900/40 shadow-xl px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
//                         MARK AS VERIFIED
//                       </button>
//                    </div>
//                 </div>
//               </div>
//             ) : (
//               /* EMPTY SELECTION STATE */
//               <div className="flex flex-col justify-center items-center gap-8 border-4 border-slate-900 border-dashed rounded-[60px] h-full min-h-[500px] text-slate-700">
//                 <div className="flex justify-center items-center bg-slate-900 shadow-inner rounded-full w-32 h-32 text-5xl">
//                   <Users className="text-slate-800" size={48} />
//                 </div>
//                 <div className="space-y-2 text-center">
//                   <p className="font-black text-slate-600 text-2xl tracking-tighter">SELECT A PARTICIPANT</p>
//                   <p className="max-w-xs font-medium text-slate-500 text-sm">
//                     Choose a record from the listing to inspect QR codes, team composition, and documents.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </div>

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #1e293b;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #334155;
//         }
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// } );
// }