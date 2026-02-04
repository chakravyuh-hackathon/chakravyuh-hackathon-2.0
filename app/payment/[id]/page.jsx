'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const API_URL = '/api';

    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [formError, setFormError] = useState('');
    const [processing, setProcessing] = useState(false);

    const [utrNumber, setUtrNumber] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);

    const showFormPopup = (message) => {
        setFormError(message);
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
            window.alert(message);
        }
    };

    const isIeee = (registration?.ieeeMember || 'no').toString().toLowerCase() === 'yes';
    const displayAmount = registration?.payment?.amount ?? (isIeee ? 1000 : 1200);
    const qrImagePath = isIeee ? '/upi/qr-1000.jpeg' : '/upi/qr-1200.jpeg';
    const upiId = 'dipakpawaras19-1@okaxis';
    const supportContact = '8669233747 (Dipak Sambhaji Pawar)';

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setPaymentScreenshot(null);
            return;
        }

        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.type)) {
            setPaymentScreenshot(null);
            showFormPopup('Only PNG, JPG, JPEG, and PDF files are allowed');
            return;
        }

        setPaymentScreenshot(file);
    };

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                if (!id) {
                    setPageError('Invalid payment link');
                    return;
                }
                const response = await fetch(`${API_URL}/registrations/${id}`);
                const result = await response.json();

                if (result.success) {
                    if (result.data.status === 'confirmed') {
                        router.replace(`/registration/success?id=${id}`);
                        return;
                    }
                    setRegistration(result.data);
                } else {
                    setPageError(result.message || 'Registration not found');
                }
            } catch {
                setPageError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [id, router]);

    const handleSubmitProof = async () => {
        setFormError('');

        if (!id) {
            showFormPopup('Invalid payment link');
            return;
        }

        const utr = String(utrNumber || '').replace(/\D/g, '');
        if (!utr) {
            showFormPopup('Please enter 12-digit UTR / Transaction ID');
            return;
        }
        if (utr.length !== 12) {
            showFormPopup('UTR/Transaction ID must be 12 digits');
            return;
        }

        if (!paymentScreenshot) {
            showFormPopup('Please upload payment screenshot');
            return;
        }

        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedMimeTypes.includes(paymentScreenshot.type)) {
            showFormPopup('Only PNG, JPG, JPEG, and PDF files are allowed');
            return;
        }

        setProcessing(true);

        try {
            const payload = new FormData();
            payload.append('utrNumber', utr);
            payload.append('paymentScreenshot', paymentScreenshot);

            const resp = await fetch(`${API_URL}/registrations/${id}/upi-proof`, {
                method: 'POST',
                body: payload
            });

            const data = await resp.json().catch(() => null);
            if (!resp.ok) {
                throw new Error(data?.message || 'Failed to submit payment proof');
            }

            router.replace(`/registration/success?id=${id}`);
        } catch (err) {
            const message = err?.message || 'Payment initiation failed';
            if (err instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                showFormPopup('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } else {
                showFormPopup(message);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-indigo-50 to-blue-100 px-4 min-h-screen font-medium text-gray-700 text-sm sm:text-base tracking-wide">
                Loading registration details...
            </div>
        );

    if (pageError)
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-red-50 to-pink-100 px-4 min-h-screen font-semibold text-red-600 text-sm sm:text-base text-center">
                {pageError}
            </div>
        );

    if (!registration)
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-slate-50 to-slate-100 px-4 min-h-screen text-gray-700 text-sm sm:text-base text-center">
                Registration not found
            </div>
        );

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 px-4 py-10 min-h-screen">
            <div className="bg-white/80 shadow-2xl shadow-indigo-200/40 backdrop-blur-xl p-6 sm:p-8 border border-white/50 rounded-2xl ring-1 ring-black/5 w-full max-w-xl transition-all">
                <h1 className="mb-7 font-extrabold text-gray-900 text-2xl sm:text-3xl text-center leading-tight tracking-tight">
                    Complete Your Payment (UPI)
                </h1>

                <div className="bg-white/60 mb-8 rounded-2xl divide-y divide-gray-200/70 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3">
                        <span className="text-gray-500">Event</span>
                        <span className="font-semibold text-gray-900">{registration.event}</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3">
                        <span className="text-gray-500">Registrant</span>
                        <span className="font-semibold text-gray-900">{registration.fullName}</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-4">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-bold text-indigo-600 text-2xl">₹{displayAmount ?? '-'}</span>
                    </div>
                </div>

                <div className="bg-linear-to-br from-white/80 to-indigo-50/60 mb-6 p-5 border border-indigo-100/70 rounded-2xl ring-1 ring-black/5">
                    <div className="font-semibold text-gray-900 text-sm tracking-wide">Scan & Pay</div>
                    <div className="flex justify-center mt-4">
                        <img
                            src={qrImagePath}
                            alt={isIeee ? 'UPI QR for ₹1000' : 'UPI QR for ₹1200'}
                            className="bg-white shadow-sm p-2 border border-gray-200/80 rounded-2xl w-64 h-auto"
                        />
                    </div>

                    <div className="mt-5 text-center">
                        <div className="text-gray-600 text-sm">UPI ID</div>
                        <div className="mt-1 font-mono font-bold text-gray-900 tracking-wide">{upiId}</div>
                    </div>

                    <div className="mt-4 text-gray-600 text-sm text-center">
                        For payment issues, contact: {supportContact}
                    </div>
                </div>

                <div className="space-y-5">
                    {formError && (
                        <div className="bg-linear-to-r from-red-50/90 to-rose-50/90 shadow-sm p-3.5 border border-red-200/80 rounded-xl ring-1 ring-red-100 font-medium text-red-700 text-sm">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label className="block mb-1 font-medium text-gray-700 text-sm">
                            12-digit UTR / Transaction ID
                        </label>
                        <input
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(String(e.target.value || '').replace(/\D/g, '').slice(0, 12))}
                            inputMode="numeric"
                            maxLength={12}
                            placeholder="Enter 12-digit UTR"
                            className="block bg-white/90 shadow-sm px-4 py-3 border border-gray-300 hover:border-gray-400 focus:border-indigo-500 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200/60 w-full text-gray-900 placeholder:text-gray-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700 text-sm">
                            Payment Screenshot
                        </label>
                        <div className="hover:bg-white/85 bg-linear-to-br from-white/80 to-slate-50/70 shadow-sm hover:shadow-md p-4 border border-gray-300/90 border-dashed rounded-xl ring-1 ring-black/5 transition">
                            <div className="text-gray-700 text-sm">
                                Upload payment proof (PNG, JPG, JPEG, or PDF)
                            </div>
                            <div className="mt-2 text-gray-500 text-xs">
                                Make sure the UTR and amount are visible in the screenshot.
                            </div>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,application/pdf"
                                onChange={handleFileChange}
                                className="block hover:file:bg-indigo-700 file:bg-indigo-600 mt-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 w-full file:font-semibold text-gray-700 file:text-white text-sm file:cursor-pointer"
                            />
                            {paymentScreenshot && (
                                <div className="mt-3 text-gray-700 text-sm">
                                    Selected:{' '}
                                    <span className="bg-slate-100/80 px-2 py-1 border border-slate-200 rounded-md font-medium">
                                        {paymentScreenshot.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmitProof}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
                   bg-linear-to-br from-indigo-600 to-blue-600
                    hover:from-indigo-700 hover:to-blue-700
                    active:scale-[0.98]
                    shadow-lg shadow-indigo-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                    ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {processing ? 'Submitting Proof...' : 'Submit Proof'}
                </button>

                <p className="mt-6 text-gray-500 text-xs text-center leading-relaxed">
                    After submission, your payment will be verified manually.
                </p>
            </div>
        </div>
    );
}








































// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//     });
// };

// export default function PaymentPage() {
//     const router = useRouter();
//     const params = useParams();
//     const id = params?.id;
//     const API_URL = '/api';
//     const [registration, setRegistration] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [processing, setProcessing] = useState(false);

//     const nonIeeeAmount = Number(
//         process.env.NEXT_PUBLIC_PAYMENT_NON_IEEE_AMOUNT ||
//         process.env.NEXT_PUBLIC_PAYMENT_BASE_AMOUNT ||
//         1013.86
//     );
//     const ieeeAmount = Number(process.env.NEXT_PUBLIC_PAYMENT_IEEE_AMOUNT || 811.86);
//     const computedAmount = registration
//         ? ((registration.ieeeMember || 'no').toString().toLowerCase() === 'yes'
//             ? ieeeAmount
//             : nonIeeeAmount)
//         : null;
//     const displayAmount = registration?.payment?.amount ?? computedAmount;

//     useEffect(() => {
//         const fetchRegistration = async () => {
//             try {
//                 if (!id) {
//                     setError('Invalid payment link');
//                     return;
//                 }
//                 const response = await fetch(`${API_URL}/registrations/${id}`);
//                 const result = await response.json();

//                 if (result.success) {
//                     if (result.data.status === 'confirmed') {
//                         router.replace(`/registration/success?id=${id}`);
//                         return;
//                     }
//                     setRegistration(result.data);
//                 } else {
//                     setError(result.message || 'Registration not found');
//                 }
//             } catch {
//                 setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRegistration();
//     }, [id, router]);

//     const handlePayment = async () => {
//         setProcessing(true);
//         setError('');

//         try {
//             if (!id) {
//                 throw new Error('Invalid payment link');
//             }

//             const orderResponse = await fetch(`${API_URL}/registrations/${id}/create-order`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({})
//             });

//             const orderData = await orderResponse.json();
//             if (!orderResponse.ok) {
//                 throw new Error(orderData.message || 'Failed to create payment order');
//             }

//             const isLoaded = await loadRazorpayScript();
//             if (!isLoaded) throw new Error('Razorpay SDK failed to load');

//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
//                 amount: orderData.order.amount,
//                 currency: orderData.order.currency,
//                 name: 'Chakravyuh 2.0',
//                 description: `Payment for ${registration.event}`,
//                 order_id: orderData.order.id,
//                 handler: async function (response) {
//                     router.replace(`/registration/success?id=${id}&verifying=1`);

//                     fetch(`${API_URL}/registrations/${id}/verify-payment`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(response),
//                         keepalive: true
//                     }).catch(() => {
//                         // The success page will handle pending/failed confirmation by polling.
//                     });
//                 },
//                 prefill: {
//                     name: registration.fullName,
//                     email: registration.email,
//                     contact: registration.phone
//                 },
//                 theme: { color: '#4a6cf7' }
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//             rzp.on('payment.failed', (res) =>
//                 setError(`Payment failed: ${res.error.description}`)
//             );
//         } catch (err) {
//             const message = err?.message || 'Payment initiation failed';
//             if (err instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
//                 setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
//             } else {
//                 setError(message);
//             }
//         } finally {
//             setProcessing(false);
//         }
//     };

//     if (loading)
//         return (
//             <div className="flex justify-center items-center bg-linear-to-br from-indigo-50 to-blue-100 min-h-screen font-medium text-gray-700">
//                 Loading registration details...
//             </div>
//         );

//     if (error)
//         return (
//             <div className="flex justify-center items-center bg-linear-to-br from-red-50 to-pink-100 min-h-screen font-semibold text-red-600">
//                 {error}
//             </div>
//         );

//     if (!registration)
//         return (
//             <div className="flex justify-center items-center min-h-screen text-gray-700">
//                 Registration not found
//             </div>
//         );

//     return (
//         <div className="flex justify-center items-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 px-4 min-h-screen">
//             <div className="bg-white/80 shadow-xl backdrop-blur-xl p-8 border border-white/40 rounded-2xl w-full max-w-lg transition-all">
//                 <h1 className="mb-8 font-extrabold text-gray-900 text-3xl text-center tracking-tight">
//                     Complete Your Payment
//                 </h1>

//                 <div className="space-y-5 mb-10">
//                     <div className="flex justify-between items-center pb-3 border-gray-200 border-b">
//                         <span className="text-gray-500">Event</span>
//                         <span className="font-semibold text-gray-900">
//                             {registration.event}
//                         </span>
//                     </div>

//                     <div className="flex justify-between items-center pb-3 border-gray-200 border-b">
//                         <span className="text-gray-500">Registrant</span>
//                         <span className="font-semibold text-gray-900">
//                             {registration.fullName}
//                         </span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                         <span className="text-gray-500">Amount</span>
//                         <span className="font-bold text-indigo-600 text-2xl">
//                             ₹{displayAmount ?? '-'}
//                         </span>
//                     </div>
//                 </div>

//                 <button
//                     onClick={handlePayment}
//                     disabled={processing}
//                     className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
//                    bg-linear-to-br from-indigo-600 to-blue-600
//                     hover:from-indigo-700 hover:to-blue-700
//                     active:scale-[0.98]
//                     shadow-lg shadow-indigo-300
//                     ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     {processing ? 'Processing Payment...' : 'Pay Securely'}
//                 </button>

//                 <p className="mt-6 text-gray-500 text-xs text-center">
//                     Secured by Razorpay • Safe & Encrypted Payment
//                 </p>
//             </div>
//         </div>
//     );
// }