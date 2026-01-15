// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// const loadCashfreeScript = () => {
//     return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
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

//             const isLoaded = await loadCashfreeScript();
//             if (!isLoaded) throw new Error('Cashfree SDK failed to load');

//             const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox').toString();
//             const cashfree = window.Cashfree({ mode });

//             if (!orderData.paymentSessionId) {
//                 throw new Error('Missing Cashfree payment session id');
//             }

//             cashfree.checkout({
//                 paymentSessionId: orderData.paymentSessionId,
//                 redirectTarget: '_self'
//             });
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
//                     Secured by Cashfree • Safe & Encrypted Payment
//                 </p>
//             </div>
//         </div>
//     );
// }




















































'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const API_URL = '/api';
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const nonIeeeAmount = Number(
        process.env.NEXT_PUBLIC_PAYMENT_NON_IEEE_AMOUNT ||
        process.env.NEXT_PUBLIC_PAYMENT_BASE_AMOUNT ||
        1013.86
    );
    const ieeeAmount = Number(process.env.NEXT_PUBLIC_PAYMENT_IEEE_AMOUNT || 811.86);
    const computedAmount = registration
        ? ((registration.ieeeMember || 'no').toString().toLowerCase() === 'yes'
            ? ieeeAmount
            : nonIeeeAmount)
        : null;
    const displayAmount = registration?.payment?.amount ?? computedAmount;

    useEffect(() => {
        const fetchRegistration = async () => {
            try {
                if (!id) {
                    setError('Invalid payment link');
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
                    setError(result.message || 'Registration not found');
                }
            } catch {
                setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistration();
    }, [id, router]);

    const handlePayment = async () => {
        setProcessing(true);
        setError('');

        try {
            if (!id) {
                throw new Error('Invalid payment link');
            }

            const orderResponse = await fetch(`${API_URL}/registrations/${id}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create payment order');
            }

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) throw new Error('Razorpay SDK failed to load');

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Chakravyuh 2.0',
                description: `Payment for ${registration.event}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    router.replace(`/registration/success?id=${id}&verifying=1`);

                    fetch(`${API_URL}/registrations/${id}/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                        keepalive: true
                    }).catch(() => {
                        // The success page will handle pending/failed confirmation by polling.
                    });
                },
                prefill: {
                    name: registration.fullName,
                    email: registration.email,
                    contact: registration.phone
                },
                theme: { color: '#4a6cf7' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            rzp.on('payment.failed', (res) =>
                setError(`Payment failed: ${res.error.description}`)
            );
        } catch (err) {
            const message = err?.message || 'Payment initiation failed';
            if (err instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } else {
                setError(message);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-indigo-50 to-blue-100 min-h-screen font-medium text-gray-700">
                Loading registration details...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center bg-linear-to-br from-red-50 to-pink-100 min-h-screen font-semibold text-red-600">
                {error}
            </div>
        );

    if (!registration)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-700">
                Registration not found
            </div>
        );

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 px-4 min-h-screen">
            <div className="bg-white/80 shadow-xl backdrop-blur-xl p-8 border border-white/40 rounded-2xl w-full max-w-lg transition-all">
                <h1 className="mb-8 font-extrabold text-gray-900 text-3xl text-center tracking-tight">
                    Complete Your Payment
                </h1>

                <div className="space-y-5 mb-10">
                    <div className="flex justify-between items-center pb-3 border-gray-200 border-b">
                        <span className="text-gray-500">Event</span>
                        <span className="font-semibold text-gray-900">
                            {registration.event}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-gray-200 border-b">
                        <span className="text-gray-500">Registrant</span>
                        <span className="font-semibold text-gray-900">
                            {registration.fullName}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-bold text-indigo-600 text-2xl">
                            ₹{displayAmount ?? '-'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
                   bg-linear-to-br from-indigo-600 to-blue-600
                    hover:from-indigo-700 hover:to-blue-700
                    active:scale-[0.98]
                    shadow-lg shadow-indigo-300
                    ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {processing ? 'Processing Payment...' : 'Pay Securely'}
                </button>

                <p className="mt-6 text-gray-500 text-xs text-center">
                    Secured by Razorpay • Safe & Encrypted Payment
                </p>
            </div>
        </div>
    );
}