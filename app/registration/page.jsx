// 'use client';

// import { useEffect, useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const loadCashfreeScript = () => {
//     return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.head.appendChild(script);
//     });
// };

// export default function RegistrationPage() {
//     const router = useRouter();
//     const cashfreeScriptPromiseRef = useRef(null);
//     const API_URL = useMemo(() => {
//         return '/api';
//     }, []);
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         phone: '',
//         college: '',
//         event: 'Hackathon',
       
//         ieeeMember: 'no',
//         ieeeId: '',
//         ieeeMembershipCertificate: null,
//         isTeam: false,
//         teamName: '',
//         teamMembers: [{ name: '', email: '', phone: '' }]
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (!cashfreeScriptPromiseRef.current) {
//             cashfreeScriptPromiseRef.current = loadCashfreeScript();
//         }
//     }, []);

//     const handleCertificateChange = async (e) => {
//         const file = e.target.files?.[0];
//         if (!file) {
//             setFormData(prev => ({
//                 ...prev,
//                 ieeeMembershipCertificate: null
//             }));
//             return;
//         }

//         const maxSizeBytes = 5 * 1024 * 1024; // 5MB
//         if (file.size > maxSizeBytes) {
//             e.target.value = '';
//             setFormData(prev => ({
//                 ...prev,
//                 ieeeMembershipCertificate: null
//             }));
//             const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
//             setError(`IEEE certificate file is too large (${sizeMb} MB). Please upload a file up to 5MB.`);
//             return;
//         }

//         setFormData(prev => ({
//             ...prev,
//             ieeeMembershipCertificate: file
//         }));
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => {
//             const next = {
//                 ...prev,
//                 [name]: type === 'checkbox' ? checked : value
//             };

//             if (name === 'isTeam') {
//                 if (checked) {
//                     next.teamMembers = prev.teamMembers && prev.teamMembers.length > 0
//                         ? prev.teamMembers
//                         : [{ name: '', email: '', phone: '' }];
//                 } else {
//                     next.teamName = '';
//                     next.teamMembers = [{ name: '', email: '', phone: '' }];
//                 }
//             }

//             if (name === 'ieeeMember' && value === 'no') {
//                 next.ieeeId = '';
//                 next.ieeeMembershipCertificate = null;
//             }

//             return next;
//         });
//     };

//     const handleTeamMemberChange = (index, e) => {
//         const { name, value } = e.target;
//         const updatedTeamMembers = [...formData.teamMembers];
//         updatedTeamMembers[index] = {
//             ...updatedTeamMembers[index],
//             [name]: value
//         };
//         setFormData(prev => ({
//             ...prev,
//             teamMembers: updatedTeamMembers
//         }));
//     };

//     const addTeamMember = () => {
//         setFormData(prev => ({
//             ...prev,
//             teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '' }]
//         }));
//     };

//     const removeTeamMember = (index) => {
//         if (formData.teamMembers.length <= 1) return;
//         const updatedTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
//         setFormData(prev => ({
//             ...prev,
//             teamMembers: updatedTeamMembers
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             if (!cashfreeScriptPromiseRef.current) {
//                 cashfreeScriptPromiseRef.current = loadCashfreeScript();
//             }

//             // 1. Submit registration
//             // Note: Assuming backend runs on port 5000 and we have a proxy or direct URL
//             // For now, hardcoding localhost:5000 if not proxying, or using relative path if proxy configured
//             // But Next.js won't proxy by default without config. Let's start with FULL URL or configure proxy.
//             // I'll use NEXT_PUBLIC_API_URL or default to localhost:5000
//             const registrationPayload = new FormData();
//             registrationPayload.append('fullName', formData.fullName);
//             registrationPayload.append('email', formData.email);
//             registrationPayload.append('phone', formData.phone);
//             registrationPayload.append('college', formData.college);
//             registrationPayload.append('event', formData.event);
//             registrationPayload.append('ieeeMember', formData.ieeeMember);
//             registrationPayload.append('ieeeId', formData.ieeeId);
//             registrationPayload.append('isTeam', String(formData.isTeam));
//             registrationPayload.append('teamName', formData.teamName);
//             registrationPayload.append('teamMembers', JSON.stringify(formData.teamMembers));

//             if (formData.ieeeMember === 'yes' && formData.ieeeMembershipCertificate) {
//                 registrationPayload.append('ieeeMembershipCertificate', formData.ieeeMembershipCertificate);
//             }

//             const regResponse = await fetch(`${API_URL}/registrations`, {
//                 method: 'POST',
//                 body: registrationPayload
//             });

//             if (!regResponse.ok) {
//                 const errorText = await regResponse.text();
//                 console.error('Registration response error:', errorText);
//                 throw new Error(`Registration failed: ${regResponse.status} ${errorText}`);
//             }

//             const regData = await regResponse.json();

//             // 2. Create payment order
//             const orderResponse = await fetch(`${API_URL}/registrations/${regData.data._id}/create-order`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({})
//             });

//             if (!orderResponse.ok) {
//                 const errorText = await orderResponse.text();
//                 console.error('Order creation error:', errorText);
//                 throw new Error(`Failed to create payment order: ${orderResponse.status} ${errorText}`);
//             }

//             const orderData = await orderResponse.json();

//             // 3. Load Cashfree script
//             const isLoaded = await cashfreeScriptPromiseRef.current;
//             if (!isLoaded) {
//                 throw new Error('Cashfree SDK failed to load. Are you online?');
//             }

//             if (!orderData.paymentSessionId) {
//                 throw new Error('Missing Cashfree payment session id');
//             }

//             const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox').toString();
//             const cashfree = window.Cashfree({ mode });
//             const origin = window.location.origin || '';
//             const returnUrl = `${origin}/registration/success?id=${encodeURIComponent(
//                 regData.data._id
//             )}&verifying=1&order_id={order_id}`;

//             // 4. Open Cashfree checkout
//             cashfree.checkout({
//                 paymentSessionId: orderData.paymentSessionId,
//                 redirectTarget: '_self',
//                 returnUrl
//             });

//         } catch (error) {
//             console.error('Registration error:', error);
//             const message = error?.message || 'An error occurred. Please try again.';
//             if (error instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
//                 setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
//             } else {
//                 setError(message);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-black dark:text-gray-100">
//             {loading && (
//                 <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm">
//                     <div className="bg-white/95 dark:bg-gray-900/95 shadow-xl p-6 rounded-2xl w-full max-w-sm text-center">
//                         <div className="mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin" />
//                         <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
//                             Preparing payment...
//                         </div>
//                         <div className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
//                             Please wait
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-black/30 mx-auto border border-transparent dark:border-gray-800 rounded-xl max-w-md md:max-w-2xl overflow-hidden">
//                 <div className="p-8">
//                     <div className="mb-8 text-center">
//                         <div className="flex justify-center items-center gap-3 mb-4">
//                             <div className="bg-linear-to-r from-blue-500 to-purple-600 shadow-lg p-3 rounded-2xl">
//                                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                         </div>
//                         <h1 className="bg-clip-text bg-linear-to-r from-gray-900 dark:from-gray-100 to-gray-700 dark:to-gray-300 mb-1.5 font-bold text-transparent text-3xl">Register for Chakravyuh 2.0</h1>
//                         <p className="mx-auto max-w-md text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Join the ultimate tech fest and showcase your skills in coding, debugging, and problem-solving</p>
//                     </div>

//                     <div className="bg-gray-50 dark:bg-gray-950/40 mb-8 p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
//                         <div className="font-bold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">Registration Fee &amp; What You Get</div>

//                         <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
//                             <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
//                                 <div className="text-gray-600 dark:text-gray-300 text-xs">IEEE Member Fee</div>
//                                 <div className="mt-1 font-extrabold text-gray-900 dark:text-gray-100 text-xl">₹811.86</div>
//                             </div>
//                             <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
//                                 <div className="text-gray-600 dark:text-gray-300 text-xs">Non-IEEE Member Fee</div>
//                                 <div className="mt-1 font-extrabold text-gray-900 dark:text-gray-100 text-xl">₹1,013.86</div>
//                             </div>
//                         </div>

//                         <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100 text-sm">
//                             Registration fee is for event participation only.
//                         </p>

//                         <ul className="space-y-1.5 mt-3 text-gray-700 dark:text-gray-300 text-sm list-disc list-inside">
//                             <li>Access to the hackathon</li>
//                             <li>Certificates (as applicable)</li>
//                             <li>Mentorship during the event</li>
//                             <li>Eligibility for prizes (as per judging rules)</li>
//                         </ul>

//                         <div className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
//                             Links:
//                             <a href="/pricing" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">Pricing</a>
//                             <span className="mx-2 text-gray-400">|</span>
//                             <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
//                             <span className="mx-2 text-gray-400">|</span>
//                             <a href="/refund-cancellation" className="text-blue-600 dark:text-blue-400 hover:underline">Refund &amp; Cancellation</a>
//                             <span className="mx-2 text-gray-400">|</span>
//                             <a href="/terms-and-conditions" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</a>
//                         </div>
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 dark:bg-red-950/40 mb-4 p-4 border border-transparent dark:border-red-900/40 rounded-md text-red-700 dark:text-red-200">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-6">
                       
//                             <div className="relative">
//                                 <label htmlFor="teamName" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                     <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                     </svg>
//                                     Team Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         id="teamName"
//                                         name="teamName"
//                                         required={formData.isTeam}
//                                         value={formData.teamName}
//                                         onChange={handleChange}
//                                         placeholder="Enter your team name"
//                                         className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-amber-500 dark:border-gray-700 dark:focus:border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                     />
//                                     <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                         <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                       
//                         <div className="relative">
//                             <label htmlFor="fullName" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                 </svg>
//                                 Full Name (Team Leader) <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     id="fullName"
//                                     name="fullName"
//                                     required
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     placeholder="Enter your full name"
//                                     className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-rose-500 dark:border-gray-700 dark:focus:border-rose-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                 />
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="relative">
//                             <label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                 </svg>
//                                 Email <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     required
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter your email address"
//                                     className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                 />
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="relative">
//                             <label htmlFor="phone" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                 </svg>
//                                 Phone <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="tel"
//                                     id="phone"
//                                     name="phone"
//                                     required
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     placeholder="Enter your 10-digit phone number"
//                                     className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-teal-500 dark:border-gray-700 dark:focus:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                 />
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="relative">
//                             <label htmlFor="college" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                 </svg>
//                                 College/Institution <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     id="college"
//                                     name="college"
//                                     required
//                                     value={formData.college}
//                                     onChange={handleChange}
//                                     placeholder="Enter your college or institution name"
//                                     className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-indigo-500 dark:border-gray-700 dark:focus:border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                 />
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="relative">
//                             <label htmlFor="event" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 Event <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     id="event"
//                                     name="event"
//                                     value={formData.event}
//                                     readOnly
//                                     className="block bg-gray-50 dark:bg-gray-800 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 w-full text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out cursor-not-allowed"
//                                 />
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="relative">
//                             <label htmlFor="ieeeMember" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                 <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                 </svg>
//                                 IEEE Member
//                             </label>
//                             <div className="relative">
//                                 <select
//                                     id="ieeeMember"
//                                     name="ieeeMember"
//                                     value={formData.ieeeMember}
//                                     onChange={handleChange}
//                                     className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-8 pl-10 border border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 w-full text-black dark:text-gray-100 transition-all duration-200 ease-in-out appearance-none cursor-pointer"
//                                 >
//                                     <option value="no">No</option>
//                                     <option value="yes">Yes</option>
//                                 </select>
//                                 <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                     </svg>
//                                 </div>
//                                 <div className="right-0 absolute inset-y-0 flex items-center mt-1 pr-3 pointer-events-none">
//                                     <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         {formData.ieeeMember === 'yes' && (
//                             <div className="space-y-4">
//                                 <div className="relative">
//                                     <label htmlFor="ieeeId" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//                                         <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
//                                         </svg>
//                                         IEEE ID <span className="text-red-500">*</span>
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="text"
//                                             id="ieeeId"
//                                             name="ieeeId"
//                                             required={formData.ieeeMember === 'yes'}
//                                             value={formData.ieeeId}
//                                             onChange={handleChange}
//                                             placeholder="Enter your IEEE ID"
//                                             className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                                         />
//                                         <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                                             <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </div>

//                                <div className="relative">
//     <label htmlFor="ieeeMembershipCertificate" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
//         <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//         IEEE Membership Certificate <span className="text-red-500">*</span>
//     </label>
//     <div className="relative">
//         <input
//             type="file"
//             id="ieeeMembershipCertificate"
//             name="ieeeMembershipCertificate"
//             required={formData.ieeeMember === 'yes'}
//             accept="image/*,application/pdf"
//             onChange={handleCertificateChange}
//             className="block bg-white hover:file:bg-green-100 dark:bg-gray-900 dark:hover:file:bg-green-900/30 dark:file:bg-green-900/20 file:bg-green-50 shadow-sm file:mr-4 file:px-4 file:py-2.5 border border-gray-300 focus:border-green-500 dark:border-gray-700 dark:focus:border-green-400 file:border-0 rounded-lg file:rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 w-full file:font-medium text-gray-500 dark:file:text-green-400 dark:text-gray-400 file:text-green-700 text-sm file:text-sm transition-all duration-200 ease-in-out cursor-pointer file:cursor-pointer"
//         />
//         <div className="right-0 absolute inset-y-0 flex items-center pr-3 pointer-events-none">
//             <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//             </svg>
//         </div>
//     </div>
//     <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
//         Accepted formats: Images (JPG, PNG) and PDF files
//     </p>
// </div>

//                             </div>
//                         )}

//                         <div className="flex items-center">
//                             <input
//                                 id="isTeam"
//                                 name="isTeam"
//                                 type="checkbox"
//                                 checked={formData.isTeam}
//                                 onChange={handleChange}
//                                 className="border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 text-blue-600"
//                             />
//                             <label
//                                 htmlFor="isTeam"
//                                 className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 ml-2 px-3 py-1.5 border border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-200 text-sm transition-all duration-200 ease-in-out cursor-pointer select-none"
//                             >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                                 </svg>
//                                 Add Team Member
//                             </label>

//                         </div>

//                         {formData.isTeam && (
//                             <div className="space-y-4">
//                                <div>
//     <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Team Members</h3>
//     {formData.teamMembers.map((member, index) => (
//         <div key={index} className="space-y-2 bg-white dark:bg-gray-900 mb-4 p-4 border border-gray-200 dark:border-gray-800 rounded-md">
//             <div className="flex justify-between items-center">
//                 <h4 className="font-medium text-gray-700 dark:text-gray-200 text-sm">Member {index + 2}</h4>
//                 {formData.teamMembers.length > 1 && (
//                     <button
//                         type="button"
//                         onClick={() => removeTeamMember(index)}
//                         className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 shadow-sm hover:shadow-md px-3 py-1.5 border border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 rounded-md font-medium text-red-600 hover:text-red-700 dark:hover:text-red-300 dark:text-red-400 text-sm hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out transform"
//                     >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         Remove
//                     </button>
//                 )}
//             </div>

//             <div className="relative">
//                 <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
//                     <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2010/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     Name
//                 </label>
//                 <div className="relative">
//                     <input
//                         type="text"
//                         name="name"
//                         required
//                         value={member.name}
//                         onChange={(e) => handleTeamMemberChange(index, e)}
//                         placeholder="Enter team member name"
//                         className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-cyan-500 dark:border-gray-700 dark:focus:border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                     />
//                     <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                         <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2010/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m-4 0v4h4m0 0v-4h4m-4 0a2 2 0 00-2 2v10a2 2 0 002 2h5a2 2 0 002-2v-4a2 2 0 00-2-2h-4m-4 0v-4h4" />
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//             <div className="relative">
//                 <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
//                     <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     Email
//                 </label>
//                 <div className="relative">
//                     <input
//                         type="email"
//                         name="email"
//                         required
//                         value={member.email}
//                         onChange={(e) => handleTeamMemberChange(index, e)}
//                         placeholder="Enter team member email"
//                         className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                     />
//                     <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                         <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//             <div className="relative">
//                 <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
//                     <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                     Phone
//                 </label>
//                 <div className="relative">
//                     <input
//                         type="tel"
//                         name="phone"
//                         required
//                         value={member.phone}
//                         onChange={(e) => handleTeamMemberChange(index, e)}
//                         placeholder="Enter team member phone number"
//                         className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-teal-500 dark:border-gray-700 dark:focus:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
//                     />
//                     <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
//                         <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     ))}

//     {formData.teamMembers.length < 3 && (
//         <button
//             type="button"
//             onClick={addTeamMember}
//             className="inline-flex items-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/30 dark:hover:bg-blue-900/30 mt-2 px-3 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-medium text-blue-700 dark:text-blue-300 text-sm leading-4"
//         >
//             + Add Team Member
//         </button>
//     )}
// </div>
//                             </div>
//                         )}

//                         <div>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className={`w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                         </svg>
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         Register & Pay
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }










































'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
    });
};

export default function RegistrationPage() {
    const router = useRouter();
    const razorpayScriptPromiseRef = useRef(null);
    const API_URL = useMemo(() => {
        return '/api';
    }, []);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        event: 'Hackathon',
       
        ieeeMember: 'no',
        ieeeId: '',
        ieeeMembershipCertificate: null,
        isTeam: false,
        teamName: '',
        teamMembers: [{ name: '', email: '', phone: '' }]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!razorpayScriptPromiseRef.current) {
            razorpayScriptPromiseRef.current = loadRazorpayScript();
        }
    }, []);

    const handleCertificateChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setFormData(prev => ({
                ...prev,
                ieeeMembershipCertificate: null
            }));
            return;
        }

        const maxSizeBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSizeBytes) {
            e.target.value = '';
            setFormData(prev => ({
                ...prev,
                ieeeMembershipCertificate: null
            }));
            const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
            setError(`IEEE certificate file is too large (${sizeMb} MB). Please upload a file up to 5MB.`);
            return;
        }

        setFormData(prev => ({
            ...prev,
            ieeeMembershipCertificate: file
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const next = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            if (name === 'isTeam') {
                if (checked) {
                    next.teamMembers = prev.teamMembers && prev.teamMembers.length > 0
                        ? prev.teamMembers
                        : [{ name: '', email: '', phone: '' }];
                } else {
                    next.teamName = '';
                    next.teamMembers = [{ name: '', email: '', phone: '' }];
                }
            }

            if (name === 'ieeeMember' && value === 'no') {
                next.ieeeId = '';
                next.ieeeMembershipCertificate = null;
            }

            return next;
        });
    };

    const handleTeamMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeamMembers = [...formData.teamMembers];
        updatedTeamMembers[index] = {
            ...updatedTeamMembers[index],
            [name]: value
        };
        setFormData(prev => ({
            ...prev,
            teamMembers: updatedTeamMembers
        }));
    };

    const addTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '' }]
        }));
    };

    const removeTeamMember = (index) => {
        if (formData.teamMembers.length <= 1) return;
        const updatedTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            teamMembers: updatedTeamMembers
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!razorpayScriptPromiseRef.current) {
                razorpayScriptPromiseRef.current = loadRazorpayScript();
            }

            // 1. Submit registration
            // Note: Assuming backend runs on port 5000 and we have a proxy or direct URL
            // For now, hardcoding localhost:5000 if not proxying, or using relative path if proxy configured
            // But Next.js won't proxy by default without config. Let's start with FULL URL or configure proxy.
            // I'll use NEXT_PUBLIC_API_URL or default to localhost:5000
            const registrationPayload = new FormData();
            registrationPayload.append('fullName', formData.fullName);
            registrationPayload.append('email', formData.email);
            registrationPayload.append('phone', formData.phone);
            registrationPayload.append('college', formData.college);
            registrationPayload.append('event', formData.event);
            registrationPayload.append('ieeeMember', formData.ieeeMember);
            registrationPayload.append('ieeeId', formData.ieeeId);
            registrationPayload.append('isTeam', String(formData.isTeam));
            registrationPayload.append('teamName', formData.teamName);
            registrationPayload.append('teamMembers', JSON.stringify(formData.teamMembers));

            if (formData.ieeeMember === 'yes' && formData.ieeeMembershipCertificate) {
                registrationPayload.append('ieeeMembershipCertificate', formData.ieeeMembershipCertificate);
            }

            const regResponse = await fetch(`${API_URL}/registrations`, {
                method: 'POST',
                body: registrationPayload
            });

            if (!regResponse.ok) {
                const errorText = await regResponse.text();
                console.error('Registration response error:', errorText);
                throw new Error(`Registration failed: ${regResponse.status} ${errorText}`);
            }

            const regData = await regResponse.json();

            // 2. Create payment order
            const orderResponse = await fetch(`${API_URL}/registrations/${regData.data._id}/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!orderResponse.ok) {
                const errorText = await orderResponse.text();
                console.error('Order creation error:', errorText);
                throw new Error(`Failed to create payment order: ${orderResponse.status} ${errorText}`);
            }

            const orderData = await orderResponse.json();

            // 3. Load Razorpay script
            const isLoaded = await razorpayScriptPromiseRef.current;
            if (!isLoaded) {
                throw new Error('Razorpay SDK failed to load. Are you online?');
            }

            // 4. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Rr3WacPY4q7Wdr',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Chakravyuh 2.0',
                description: `Registration for ${formData.event}`,
                order_id: orderData.order.id,
                handler: async function (response) {
                    router.replace(`/registration/success?id=${regData.data._id}&verifying=1`);

                    fetch(`${API_URL}/registrations/${regData.data._id}/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }),
                        keepalive: true
                    }).catch((error) => {
                        console.error('Payment verification error:', error);
                    });
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#4a6cf7'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                setError(`Payment failed: ${response.error.description}`);
            });

        } catch (error) {
            console.error('Registration error:', error);
            const message = error?.message || 'An error occurred. Please try again.';
            if (error instanceof TypeError && message.toLowerCase().includes('failed to fetch')) {
                setError('Network error: could not reach the API. Make sure the backend is running and restart the Next.js dev server.');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-black dark:text-gray-100">
            {loading && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white/95 dark:bg-gray-900/95 shadow-xl p-6 rounded-2xl w-full max-w-sm text-center">
                        <div className="mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin" />
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            Preparing payment...
                        </div>
                        <div className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                            Please wait
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-black/30 mx-auto border border-transparent dark:border-gray-800 rounded-xl max-w-md md:max-w-2xl overflow-hidden">
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <div className="bg-linear-to-r from-blue-500 to-purple-600 shadow-lg p-3 rounded-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="bg-clip-text bg-linear-to-r from-gray-900 dark:from-gray-100 to-gray-700 dark:to-gray-300 mb-1.5 font-bold text-transparent text-3xl">Register for Chakravyuh 2.0</h1>
                        <p className="mx-auto max-w-md text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Join the ultimate tech fest and showcase your skills in coding, debugging, and problem-solving</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/40 mb-4 p-4 border border-transparent dark:border-red-900/40 rounded-md text-red-700 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                       
                            <div className="relative">
                                <label htmlFor="teamName" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Team Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="teamName"
                                        name="teamName"
                                        required={formData.isTeam}
                                        value={formData.teamName}
                                        onChange={handleChange}
                                        placeholder="Enter your team name"
                                        className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-amber-500 dark:border-gray-700 dark:focus:border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                    />
                                    <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                       
                        <div className="relative">
                            <label htmlFor="fullName" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Full Name (Team Leader) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-rose-500 dark:border-gray-700 dark:focus:border-rose-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="phone" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your 10-digit phone number"
                                    className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-teal-500 dark:border-gray-700 dark:focus:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="college" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                College/Institution <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="college"
                                    name="college"
                                    required
                                    value={formData.college}
                                    onChange={handleChange}
                                    placeholder="Enter your college or institution name"
                                    className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-indigo-500 dark:border-gray-700 dark:focus:border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="event" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Event <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="event"
                                    name="event"
                                    value={formData.event}
                                    readOnly
                                    className="block bg-gray-50 dark:bg-gray-800 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 w-full text-gray-700 dark:text-gray-300 transition-all duration-200 ease-in-out cursor-not-allowed"
                                />
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="ieeeMember" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                IEEE Member
                            </label>
                            <div className="relative">
                                <select
                                    id="ieeeMember"
                                    name="ieeeMember"
                                    value={formData.ieeeMember}
                                    onChange={handleChange}
                                    className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-8 pl-10 border border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 w-full text-black dark:text-gray-100 transition-all duration-200 ease-in-out appearance-none cursor-pointer"
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                                <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="right-0 absolute inset-y-0 flex items-center mt-1 pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {formData.ieeeMember === 'yes' && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <label htmlFor="ieeeId" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        IEEE ID <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="ieeeId"
                                            name="ieeeId"
                                            required={formData.ieeeMember === 'yes'}
                                            value={formData.ieeeId}
                                            onChange={handleChange}
                                            placeholder="Enter your IEEE ID"
                                            className="block bg-white dark:bg-gray-900 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                                        />
                                        <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                               <div className="relative">
    <label htmlFor="ieeeMembershipCertificate" className="flex items-center gap-2 mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        IEEE Membership Certificate <span className="text-red-500">*</span>
    </label>
    <div className="relative">
        <input
            type="file"
            id="ieeeMembershipCertificate"
            name="ieeeMembershipCertificate"
            required={formData.ieeeMember === 'yes'}
            accept="image/*,application/pdf"
            onChange={handleCertificateChange}
            className="block bg-white hover:file:bg-green-100 dark:bg-gray-900 dark:hover:file:bg-green-900/30 dark:file:bg-green-900/20 file:bg-green-50 shadow-sm file:mr-4 file:px-4 file:py-2.5 border border-gray-300 focus:border-green-500 dark:border-gray-700 dark:focus:border-green-400 file:border-0 rounded-lg file:rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 w-full file:font-medium text-gray-500 dark:file:text-green-400 dark:text-gray-400 file:text-green-700 text-sm file:text-sm transition-all duration-200 ease-in-out cursor-pointer file:cursor-pointer"
        />
        <div className="right-0 absolute inset-y-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
        </div>
    </div>
    <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
        Accepted formats: Images (JPG, PNG) and PDF files
    </p>
</div>

                            </div>
                        )}

                        <div className="flex items-center">
                            <input
                                id="isTeam"
                                name="isTeam"
                                type="checkbox"
                                checked={formData.isTeam}
                                onChange={handleChange}
                                className="border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-400 w-4 h-4 text-blue-600"
                            />
                            <label
                                htmlFor="isTeam"
                                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 ml-2 px-3 py-1.5 border border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-200 text-sm transition-all duration-200 ease-in-out cursor-pointer select-none"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add Team Member
                            </label>

                        </div>

                        {formData.isTeam && (
                            <div className="space-y-4">
                               <div>
    <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm">Team Members</h3>
    {formData.teamMembers.map((member, index) => (
        <div key={index} className="space-y-2 bg-white dark:bg-gray-900 mb-4 p-4 border border-gray-200 dark:border-gray-800 rounded-md">
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700 dark:text-gray-200 text-sm">Member {index + 2}</h4>
                {formData.teamMembers.length > 1 && (
                    <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 shadow-sm hover:shadow-md px-3 py-1.5 border border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 rounded-md font-medium text-red-600 hover:text-red-700 dark:hover:text-red-300 dark:text-red-400 text-sm hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out transform"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                    </button>
                )}
            </div>

            <div className="relative">
                <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2010/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="name"
                        required
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                        placeholder="Enter team member name"
                        className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-cyan-500 dark:border-gray-700 dark:focus:border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                    />
                    <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2010/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m-4 0v4h4m0 0v-4h4m-4 0a2 2 0 00-2 2v10a2 2 0 002 2h5a2 2 0 002-2v-4a2 2 0 00-2-2h-4m-4 0v-4h4" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="relative">
                <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                </label>
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        required
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                        placeholder="Enter team member email"
                        className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                    />
                    <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="relative">
                <label className="flex items-center gap-2 mb-2 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone
                </label>
                <div className="relative">
                    <input
                        type="tel"
                        name="phone"
                        required
                        value={member.phone}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                        placeholder="Enter team member phone number"
                        className="block bg-white dark:bg-gray-950 shadow-sm mt-1 py-2.5 pr-3 pl-10 border border-gray-300 focus:border-teal-500 dark:border-gray-700 dark:focus:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 w-full text-black dark:placeholder:text-gray-500 dark:text-gray-100 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
                    />
                    <div className="left-0 absolute inset-y-0 flex items-center mt-1 pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    ))}

    {formData.teamMembers.length < 3 && (
        <button
            type="button"
            onClick={addTeamMember}
            className="inline-flex items-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/30 dark:hover:bg-blue-900/30 mt-2 px-3 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 font-medium text-blue-700 dark:text-blue-300 text-sm leading-4"
        >
            + Add Team Member
        </button>
    )}
</div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Register & Pay
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}