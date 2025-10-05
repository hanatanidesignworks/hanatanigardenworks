'use client';

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from 'next/link';

export default function Header(){
    const [open, setOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
    const lastFoucusableRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (open) root.classList.add('overflow-hidden');
        else root.classList.remove('overflow-hidden');

        return () => root.classList.remove('overflow-hidden');
    }, [open]);

    useEffect(() => {
        if (open) closeBtnRef.current?.focus();
    }, [open]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (!open) return;
            if (e.key === 'Escape') {
                setOpen(false);
                return;
            };
            if (e.key === 'Tab') {
                const first = firstFocusableRef.current;
                const last = lastFoucusableRef.current;
                if (!first || !last) return;
                const isShift = e.shiftKey;
                const active = document.activeElement;

                if (!isShift && active === last) {
                    e.preventDefault();
                    first.focus();
                } else if (isShift && active === first) {
                    e.preventDefault();
                    last.focus();
                };
            };
        };
        document.addEventListener('keydown', onKeyDown);
    }, [open]);

    return(
        <header className="w-full h-[50px] bg-gray-100 flex items-center justify-center">
            <div className="flex w-full md:w-[768px] h-[40px] justify-between items-center">
                <div className="w-[200px] h-[30px]">
                    <p className="ml-[10px] text-base" style={{fontFamily:  "Montserrat, sans-serif"}}>
                        Hanatani Garden Works
                    </p>
                </div>
                <div className="w-[40px] h-[40px]">
                    <button
                        aria-label="Open menu"
                        onClick={() => setOpen(true)}
                        ref={firstFocusableRef}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>  

                    </button>

                    <AnimatePresence>
                        {open && (
                            <>
                                <motion.div
                                    className="fixed inset-0 z-40 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setOpen(false)}
                                    aria-hidden="true"
                                />

                                <motion.aside
                                    className="fixed inset-y-0 right-0 z-50 h-screen bg-black/70 w-[40%] flex-col p-2"
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'tween', duration: 0.28 }}
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label="navigation menu"
                                >
                                    <div className="flex justify-end w-full">
                                        <button
                                            ref={closeBtnRef}
                                            onClick={() => setOpen(false)}
                                            aria-label="Close menu"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>

                                        </button>
                                    </div>
                                    <div className="w-full h-screen flex flex-col items-center justify-center">
                                        <nav className="grid gap-3 text-lg text-white">
                                            <Link href="/" className="rounded px-2 py-2 hover:bg-black/5">HOME</Link>
                                            <Link href="/login" className="rounded px-2 py-2 hover:bg-black/5">LOGIN</Link>
                                            <Link href="/admin" className="rounded px-2 py-2 hover:bg-black/5">管理画面</Link>
                                        </nav>
                                    </div>
                                    
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}