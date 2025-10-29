import React, { useState } from 'react';
import { Route } from '../App';

interface LoginPageProps {
  onNavigate: (route: Route) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form validation and API calls
        // For this demo, we'll just simulate a successful login
        onLoginSuccess();
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F9FAFB] dark:bg-[#101922]">
            <div className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
                <div className="flex w-full max-w-6xl overflow-hidden rounded-xl bg-white dark:bg-[#101922] shadow-lg">
                    {/* Left Branding Panel */}
                    <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-10 bg-[#0A2A5B]/5 dark:bg-[#0A2A5B]/10">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
                            <span className="material-symbols-outlined text-[#0A2A5B] dark:text-white text-3xl">account_balance</span>
                            <span className="text-xl font-bold text-[#0A2A5B] dark:text-white">Vergi ve Finansal Analiz AI</span>
                        </div>
                        <div>
                            <h1 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight text-left pb-3">Automate Financial Reporting with AI</h1>
                            <p className="text-[#6B7280] dark:text-gray-300 text-base font-normal leading-normal pb-3 pt-1">Transform tax return PDFs into actionable insights instantly.</p>
                        </div>
                        <div className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2XSTYB6xiNFmRF6HU_yX6L8t2Y4-sj7rbaUT4O0_lgo1k3KDgcDr0PfSJR6lk97jFRXF5DdVb8qNPW61EJSX1P7U9cycATp4aUtKH7s8A46C9s0A7M2794BMx9jmYZcxEkc8vRjc16brPkGYBwWWaXmapSKkJxBjNaqiXBpc5xTQJoh6eI5PLWjgRvnQ-WtFZz1DbrfIo7UOQmC1J925Dcem36ZOk36vZCvpATiaJTte77WGJYrz4j8DE1jLPwjUxJMYoeTxR7CY")' }}></div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="w-full lg:w-3/5 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#101922]">
                        <div className="flex flex-col max-w-md mx-auto w-full">
                            <div className="flex flex-wrap justify-between gap-3 mb-4">
                                <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Welcome Back</p>
                            </div>
                            <div className="flex py-3">
                                <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-gray-700/50 p-1">
                                    <button onClick={() => setIsLogin(true)} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${isLogin ? 'bg-white dark:bg-[#0A2A5B] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-[#111418] dark:text-white' : 'text-[#6B7280] dark:text-gray-300'}`}>
                                        <span className="truncate">Log In</span>
                                    </button>
                                    <button onClick={() => setIsLogin(false)} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${!isLogin ? 'bg-white dark:bg-[#0A2A5B] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-[#111418] dark:text-white' : 'text-[#6B7280] dark:text-gray-300'}`}>
                                        <span className="truncate">Sign Up</span>
                                    </button>
                                </div>
                            </div>
                            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-muted-gray dark:text-gray-300" htmlFor="email">Email Address</label>
                                    <div className="mt-1">
                                        <input autoComplete="email" className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-[#0A2A5B] focus:ring-[#0A2A5B] sm:text-sm placeholder:text-gray-400" id="email" name="email" placeholder="you@example.com" required type="email" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-muted-gray dark:text-gray-300" htmlFor="password">Password</label>
                                        {isLogin && <div className="text-sm"><a className="font-medium text-[#0A2A5B] hover:text-[#0A2A5B]/80" href="#">Forgot Password?</a></div>}
                                    </div>
                                    <div className="mt-1 relative">
                                        <input autoComplete="current-password" className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white shadow-sm focus:border-[#0A2A5B] focus:ring-[#0A2A5B] sm:text-sm placeholder:text-gray-400" id="password" name="password" placeholder="••••••••" required type="password" />
                                    </div>
                                </div>
                                <div>
                                    <button className="flex w-full justify-center rounded-lg bg-[#0A2A5B] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0A2A5B]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2A5B] transition-colors" type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
                                </div>
                            </form>
                            <div className="relative my-6">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="bg-white dark:bg-[#101922] px-2 text-muted-gray dark:text-gray-400">Or continue with</span></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-3 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 48 48"><g clipPath="url(#clip0_17_80)"><path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2911 47.1175 19.68H24.252V28.752H37.3087C36.6635 31.8583 34.7573 34.5454 31.9566 36.3881V42.235H39.5894C44.5057 37.7143 47.532 31.7317 47.532 24.5528Z" fill="#4285F4"></path><path d="M24.252 48.0001C30.7383 48.0001 36.1415 45.833 40.0552 42.2351L32.4224 36.3882C30.2017 37.869 27.401 38.746 24.252 38.746C18.3656 38.746 13.2797 34.8211 11.666 29.356H3.82324V35.3456C7.7288 43.149 15.4284 48.0001 24.252 48.0001Z" fill="#34A853"></path><path d="M11.666 29.356C11.1794 27.9333 10.9237 26.4067 10.9237 24.84C10.9237 23.2733 11.1794 21.7467 11.666 20.324V14.3344H3.82324C2.10985 17.702 1 21.1691 1 24.84C1 28.5109 2.10985 31.978 3.82324 35.3456L11.666 29.356Z" fill="#FBBC05"></path><path d="M24.252 10.9341C27.6747 10.9341 30.9338 12.1131 33.3986 14.488L40.2243 7.66228C36.1308 3.9914 30.7276 1.68005 24.252 1.68005C15.4284 1.68005 7.7288 6.5311 3.82324 14.3345L11.666 20.3241C13.2797 14.8591 18.3656 10.9341 24.252 10.9341Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_17_80"><rect fill="white" height="48" width="48"></rect></clipPath></defs></svg>
                                    <span>Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-3 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                                    <span>LinkedIn</span>
                                </button>
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-xs text-muted-gray dark:text-gray-400">By creating an account, you agree to our <a className="font-medium text-[#0A2A5B] hover:text-[#0A2A5B]/80" href="#">Terms of Service</a> and <a className="font-medium text-[#0A2A5B] hover:text-[#0A2A5B]/80" href="#">Privacy Policy</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
