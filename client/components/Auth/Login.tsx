'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Register() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();

    useEffect(() => {
        /*if (localStorage.getItem('chat-app-user')) {
            router.push('/');
        }*/
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username } = values;
        }
    };

    const handleValidation = () => {
        const { password, username } = values;
        if (username === '' || password === '') {
            console.log('Username and password are required');
            return false;
        }
        return true;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <form
            className="fixed top-0 left-0 right-0 flex justify-between h-[56px] bg-[#00000076] gap-4"
            onSubmit={event => handleSubmit(event)}
        >
            <Image src="/logo.svg" alt="" width={80} height={80} className="w-[5rem]" />

            <div className="p-4 flex items-center gap-4">
                <input
                    className="w-[200px] h-[36px] bg-transparent py-[4px] px-[8px] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] text-[13px] focus:border-[#4e0eff] focus:outline-none"
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={e => handleChange(e)}
                />
                <input
                    className="w-[200px] h-[36px] bg-transparent py-[4px] px-[8px] border-2 border-[#b0b3b8] rounded-md text-[#e4e6eb] text-[13px] focus:border-[#4e0eff] focus:outline-none"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={e => handleChange(e)}
                />
                <button
                    className="px-[32px] h-[36px] bg-[#0780ff] text-[#e0e2e6] border-none font-bold cursor-pointer rounded-md text-[12px] uppercase transition ease-in-out hover:bg-[#4e0eff]"
                    type="submit"
                >
                    Login
                </button>
            </div>
        </form>
    );
}
