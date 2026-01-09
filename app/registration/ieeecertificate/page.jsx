'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IeeeCertificatesPage() {
    const router = useRouter();
    const API_URL = useMemo(
        () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        []
    );

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
                .map(v => String(v).toLowerCase())
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

    useEffect(() => {
        if (!selectedId) return;
        const stillExists = visibleRows.some(r => String(r._id) === String(selectedId));
        if (!stillExists) {
            setSelectedId('');
            setSelectedDetails(null);
            setDetailsError('');
            setDetailsLoading(false);
        }
    }, [visibleRows, selectedId]);

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
                const json = await res.json();

                if (!res.ok || !json?.success) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('adminToken');
                        router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                        return;
                    }
                    throw new Error(json?.message || 'Failed to fetch registration details');
                }

                setSelectedDetails(json?.data || null);
            } catch (e) {
                setSelectedDetails(null);
                setDetailsError(e?.message || 'Failed to fetch registration details');
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [API_URL, router, selectedId, token]);

    const downloadCsv = () => {
        const escapeCsv = (value) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            const needsQuotes = /[",\n\r]/.test(str);
            const escaped = str.replace(/"/g, '""');
            return needsQuotes ? `"${escaped}"` : escaped;
        };

        const headers = [
            'registrationId',
            'fullName',
            'email',
            'phone',
            'college',
            'event',
            'ieeeMember',
            'ieeeId',
            'teamName',
        ];

        const downloadOne = (rowsToExport, fileLabel) => {
            const lines = [headers.join(',')];
            for (const r of rowsToExport) {
                const values = [
                    r?.registrationId,
                    r?.fullName,
                    r?.email,
                    r?.phone,
                    r?.college,
                    r?.event,
                    r?.ieeeMember,
                    r?.ieeeId,
                    r?.teamName,
                ];
                lines.push(values.map(escapeCsv).join(','));
            }

            const csv = lines.join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `registrations-${fileLabel}-${ts}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);
        };

        // Use search-filtered rows so you always get both IEEE and Non-IEEE splits,
        // regardless of which list filter (All/IEEE/Non-IEEE) is currently active.
        const ieeeRows = filteredRows.filter((r) => (r?.ieeeMember || 'no').toString().toLowerCase() === 'yes');
        const nonIeeeRows = filteredRows.filter((r) => (r?.ieeeMember || 'no').toString().toLowerCase() !== 'yes');

        if (ieeeRows.length > 0) downloadOne(ieeeRows, 'ieee');
        if (nonIeeeRows.length > 0) downloadOne(nonIeeeRows, 'non-ieee');
    };

    useEffect(() => {
        const fetchRows = async () => {
            try {
                setLoading(true);
                setError('');

                if (!token) return;

                const res = await fetch(`${API_URL}/admin/registrations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json();

                if (!res.ok || !json?.success) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('adminToken');
                        router.replace(`/admin/login?next=${encodeURIComponent('/registration/ieeecertificate')}`);
                        return;
                    }
                    throw new Error(json?.message || 'Failed to fetch registrations');
                }

                setRows(Array.isArray(json.data) ? json.data : []);
            } catch (e) {
                setError(e?.message || 'Failed to fetch registrations');
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, [API_URL, router, token]);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return visibleRows.find(r => String(r._id) === String(selectedId)) || null;
    }, [visibleRows, selectedId]);

    const previewRecord = selectedDetails || selected;

    const hasPreviewCertificate = useMemo(() => {
        if (!previewRecord) return false;
        if (typeof previewRecord.hasIeeeCertificate !== 'undefined') return Boolean(previewRecord.hasIeeeCertificate);
        const isIeeeYes = (previewRecord.ieeeMember || 'no').toString().toLowerCase() === 'yes';
        const certMeta = previewRecord.ieeeMembershipCertificate;
        return Boolean(isIeeeYes && certMeta && (certMeta.contentType || certMeta.fileName));
    }, [previewRecord]);

    useEffect(() => {
        if (!previewRecord) {
            setPreviewTab('details');
            return;
        }
        if (hasPreviewCertificate) {
            setPreviewTab('certificate');
            return;
        }
        setPreviewTab('details');
    }, [hasPreviewCertificate, previewRecord]);

    useEffect(() => {
        if (!certificateBlobUrl) return;
        return () => {
            URL.revokeObjectURL(certificateBlobUrl);
        };
    }, [certificateBlobUrl]);

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
                setCertificateError(e?.message || 'Failed to fetch IEEE certificate');
            } finally {
                setCertificateLoading(false);
            }
        };

        fetchCertificate();
    }, [API_URL, hasPreviewCertificate, previewRecord, previewTab, router, token]);

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

    if (!authChecked) {
        return (
            <div className="bg-linear-to-r from-[#0f172a] via-[#020617] to-black p-6 min-h-screen text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-white/5 shadow-xl backdrop-blur-xl p-6 border border-white/10 rounded-2xl">
                        Loading...
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
                    <div className="bg-white/5 shadow-xl backdrop-blur-xl p-6 border border-white/10 rounded-2xl">
                        Loading...
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
                                            type="button"
                                            onClick={downloadCsv}
                                            disabled={visibleRows.length === 0}
                                            className="bg-linear-to-r from-cyan-500 to-blue-600 disabled:opacity-40 shadow-lg px-5 py-2.5 rounded-xl font-medium text-white text-sm hover:scale-105 transition"
                                        >
                                            Download CSV
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
