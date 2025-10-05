'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        setErrorMsg(error.message);
    } else {
        router.push('/admin');
    }
    }

    return (
        <>
        <Header />

        <div className='max-w-md mx-auto mt-10 p-4 h-[550px]'>
            <h1 className='text-2xl font-bold mb-4'>LOGIN</h1>

            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="mailadress"
                className='w-full p-2 border rounded mb-2'
            />

            <input
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password" 
                className='w-full p-2 border rounded mb-4'
            />

            {errorMsg && <p className='text-red-500 mb-4'>{errorMsg}</p>}

            <button 
                onClick={handleLogin} 
                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded'
            >
                LOGIN
            </button>
        </div>
        </>
    )
}