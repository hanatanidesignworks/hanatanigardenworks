'use client';

import Link from 'next/link';

export default function Footer(){
    return(
        <footer className='mt-10'>
            <div className='w-full h-[50px] bg-gray-500 flex flex-col items-center'>
                <div className='h-[30px] w-[375px] md:w-[768px]'>
                    <Link href="/admin" className='text-white text-sm ml-4'>管理画面</Link>
                </div>
                <p className='text-sm text-white h-[20px] text-center'>Copyright @Hanatanigardenworks All Rights Reserved</p>
            </div>
        </footer>
    );
}